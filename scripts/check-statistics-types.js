const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'futebol_db',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
});

async function checkStatisticsTypes() {
  try {
    console.log('🔍 Verificando tipos de estatísticas disponíveis...\n');
    
    // Buscar tipos de estatísticas de partidas
    const fixtureStatsResult = await pool.query(`
      SELECT DISTINCT type, COUNT(*) as count 
      FROM fixture_statistics 
      GROUP BY type 
      ORDER BY count DESC, type
    `);
    
    console.log('📊 ESTATÍSTICAS DE PARTIDAS (fixture_statistics):');
    fixtureStatsResult.rows.forEach(row => {
      console.log(`  • ${row.type} (${row.count} registros)`);
    });
    
    console.log('\n');
    
    // Buscar exemplo de dados de uma partida específica
    const exampleResult = await pool.query(`
      SELECT fixture_id, team_id, type, value 
      FROM fixture_statistics 
      WHERE fixture_id = (SELECT fixture_id FROM fixture_statistics LIMIT 1)
      ORDER BY team_id, type
    `);
    
    if (exampleResult.rows.length > 0) {
      console.log('📋 EXEMPLO DE DADOS DE UMA PARTIDA:');
      console.log(`   Partida ID: ${exampleResult.rows[0].fixture_id}`);
      
      const teamStats = {};
      exampleResult.rows.forEach(row => {
        if (!teamStats[row.team_id]) teamStats[row.team_id] = {};
        teamStats[row.team_id][row.type] = row.value;
      });
      
      Object.keys(teamStats).forEach(teamId => {
        console.log(`\n   Time ${teamId}:`);
        Object.entries(teamStats[teamId]).forEach(([type, value]) => {
          console.log(`     ${type}: ${value}`);
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

checkStatisticsTypes();
