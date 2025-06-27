import { query } from '@/lib/db';

async function checkStatisticsTypes() {
  try {
    console.log('🔍 Verificando tipos de estatísticas disponíveis...\n');
    
    // Buscar tipos únicos de estatísticas
    const typesResult = await query(
      `SELECT DISTINCT type, COUNT(*) as count
       FROM fixture_statistics 
       GROUP BY type 
       ORDER BY count DESC, type`
    );

    console.log('📊 Tipos de estatísticas encontrados:');
    console.log('==================================');
    typesResult.rows.forEach((row: any) => {
      console.log(`• ${row.type}: ${row.count} registros`);
    });

    // Buscar exemplos de valores para cada tipo
    console.log('\n📋 Exemplos de valores por tipo:');
    console.log('=================================');
    
    for (const typeRow of typesResult.rows.slice(0, 10)) { // Apenas os 10 primeiros
      const exampleResult = await query(
        `SELECT value 
         FROM fixture_statistics 
         WHERE type = $1 
         LIMIT 5`,
        [typeRow.type]
      );
      
      const examples = exampleResult.rows.map((r: any) => r.value).join(', ');
      console.log(`• ${typeRow.type}: ${examples}`);
    }

    // Verificar algumas partidas específicas com estatísticas
    console.log('\n🎯 Partidas com estatísticas (últimas 5):');
    console.log('=========================================');
    
    const fixturesWithStats = await query(
      `SELECT DISTINCT fs.fixture_id, COUNT(fs.type) as stats_count
       FROM fixture_statistics fs
       JOIN fixtures f ON fs.fixture_id = f.fixture_id
       WHERE f.goals_home IS NOT NULL AND f.goals_away IS NOT NULL
       GROUP BY fs.fixture_id
       ORDER BY fs.fixture_id DESC
       LIMIT 5`
    );

    fixturesWithStats.rows.forEach((row: any) => {
      console.log(`• Fixture ID: ${row.fixture_id} - ${row.stats_count} estatísticas`);
    });

    console.log('\n✅ Verificação concluída!');
    
  } catch (error) {
    console.error('❌ Erro ao verificar estatísticas:', error);
  } finally {
    process.exit(0);
  }
}

checkStatisticsTypes();
