import { Pool } from 'pg';

// Configuração do banco
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function testPlayerStatisticsAPI() {
  try {
    console.log('🔍 Testando APIs de Estatísticas de Jogadores...\n');

    // 1. Encontrar uma partida que tenha tanto escalação quanto estatísticas
    const testQuery = `
      SELECT DISTINCT 
        fps.fixture_id,
        f.date,
        ht.name as home_team,
        at.name as away_team,
        COUNT(DISTINCT fps.player_id) as players_with_stats,
        COUNT(DISTINCT fl.player_id) as players_in_lineup
      FROM fixture_player_statistics fps
      JOIN fixtures f ON fps.fixture_id = f.fixture_id
      JOIN teams ht ON f.home_team_id = ht.team_id
      JOIN teams at ON f.away_team_id = at.team_id
      LEFT JOIN fixture_lineups fl ON fps.fixture_id = fl.fixture_id
      WHERE f.status_short = 'FT'
      GROUP BY fps.fixture_id, f.date, ht.name, at.name
      HAVING COUNT(DISTINCT fps.player_id) > 10 
        AND COUNT(DISTINCT fl.player_id) > 10
      ORDER BY f.date DESC
      LIMIT 5
    `;

    const testResult = await pool.query(testQuery);
    
    if (testResult.rows.length === 0) {
      console.log('❌ Nenhuma partida encontrada com estatísticas e escalação');
      return;
    }

    console.log('📊 Partidas disponíveis para teste:');
    testResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. Fixture ${row.fixture_id} - ${row.home_team} vs ${row.away_team}`);
      console.log(`   Data: ${row.date} | Stats: ${row.players_with_stats} | Lineup: ${row.players_in_lineup}`);
    });

    const testFixture = testResult.rows[0];
    console.log(`\n🎯 Testando com Fixture ID: ${testFixture.fixture_id}\n`);

    // 2. Testar primeira API (escalados apenas)
    console.log('📋 API 1: /player-statistics (apenas escalados)');
    const api1Query = `
      SELECT 
        fps.fixture_id,
        fps.team_id,
        fps.player_id,
        fps.player_name,
        fps.games_position,
        fps.goals_total,
        fps.shots_total,
        fps.passes_total,
        fps.rating
      FROM fixture_player_statistics fps
      WHERE fps.fixture_id = $1 
        AND fps.player_id IN (
          SELECT DISTINCT player_id 
          FROM fixture_lineups 
          WHERE fixture_id = $1
        )
      ORDER BY fps.team_id, fps.games_number
      LIMIT 10
    `;

    const api1Result = await pool.query(api1Query, [testFixture.fixture_id]);
    console.log(`   ✅ Encontrados ${api1Result.rows.length} jogadores escalados com estatísticas`);
    
    if (api1Result.rows.length > 0) {
      console.log('   📄 Exemplo:');
      const example = api1Result.rows[0];
      console.log(`      ${example.player_name} - ${example.games_position}`);
      console.log(`      Gols: ${example.goals_total} | Chutes: ${example.shots_total}`);
      console.log(`      Passes: ${example.passes_total} | Rating: ${example.rating}`);
    }

    // 3. Testar segunda API (todos + cruzamento)
    console.log('\n📋 API 2: /player-statistics-extended (todos + cruzamento)');
    const api2Query = `
      SELECT 
        fps.player_name,
        fps.games_position,
        fps.goals_total,
        fps.rating,
        CASE WHEN fl.player_id IS NOT NULL THEN 'Escalado' ELSE 'Banco' END as status
      FROM fixture_player_statistics fps
      LEFT JOIN fixture_lineups fl ON fps.fixture_id = fl.fixture_id 
                                    AND fps.player_id = fl.player_id
      WHERE fps.fixture_id = $1
      ORDER BY fps.team_id, 
               CASE WHEN fl.player_id IS NOT NULL THEN 0 ELSE 1 END,
               fps.games_number
      LIMIT 15
    `;

    const api2Result = await pool.query(api2Query, [testFixture.fixture_id]);
    console.log(`   ✅ Encontrados ${api2Result.rows.length} jogadores com estatísticas`);
    
    if (api2Result.rows.length > 0) {
      console.log('   📄 Primeiros exemplos:');
      api2Result.rows.slice(0, 5).forEach(player => {
        console.log(`      ${player.player_name} (${player.status}) - Rating: ${player.rating}`);
      });
    }

    // 4. Análise comparativa
    console.log('\n📈 Análise Comparativa:');
    
    const summaryQuery = `
      SELECT 
        COUNT(*) as total_stats,
        COUNT(CASE WHEN fl.player_id IS NOT NULL THEN 1 END) as escalados_com_stats,
        COUNT(CASE WHEN fl.player_id IS NULL THEN 1 END) as banco_com_stats
      FROM fixture_player_statistics fps
      LEFT JOIN fixture_lineups fl ON fps.fixture_id = fl.fixture_id 
                                    AND fps.player_id = fl.player_id
      WHERE fps.fixture_id = $1
    `;

    const summaryResult = await pool.query(summaryQuery, [testFixture.fixture_id]);
    const summary = summaryResult.rows[0];

    console.log(`   • Total de jogadores com estatísticas: ${summary.total_stats}`);
    console.log(`   • Escalados com estatísticas: ${summary.escalados_com_stats}`);
    console.log(`   • Jogadores do banco com estatísticas: ${summary.banco_com_stats}`);

    // 5. Recomendação
    console.log('\n💡 Recomendação:');
    if (summary.escalados_com_stats > 15) {
      console.log('   ✅ API 1 (/player-statistics) é IDEAL');
      console.log('   📋 Foca apenas nos jogadores que realmente jogaram');
      console.log('   🚀 Melhor performance e dados mais relevantes');
    } else {
      console.log('   ⚠️  API 2 (/player-statistics-extended) pode ser melhor');
      console.log('   📊 Mostra contexto completo (escalados + banco)');
    }

    console.log('\n🎯 URLs das APIs:');
    console.log(`   GET /api/fixtures/${testFixture.fixture_id}/player-statistics`);
    console.log(`   GET /api/fixtures/${testFixture.fixture_id}/player-statistics-extended`);

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await pool.end();
  }
}

// Executar teste
testPlayerStatisticsAPI();
