import { pool } from '../lib/db';

async function checkLineupPlayersTable() {
  try {
    console.log('🔍 Verificando estrutura da tabela lineup_players...');
    
    // Verificar se a tabela existe
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'lineup_players'
      );
    `);
    
    if (tableExists.rows[0].exists) {
      console.log('✅ Tabela lineup_players encontrada!');
      
      // Verificar estrutura da tabela
      const structure = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'lineup_players' 
        ORDER BY ordinal_position;
      `);
      
      console.log('\n📋 Estrutura da tabela lineup_players:');
      structure.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULLABLE)'}`);
      });
      
      // Verificar alguns dados de exemplo
      const sampleData = await pool.query(`
        SELECT * FROM lineup_players LIMIT 5;
      `);
      
      console.log('\n📊 Dados de exemplo:');
      console.log(sampleData.rows);
      
    } else {
      console.log('❌ Tabela lineup_players não encontrada!');
      
      // Verificar tabelas relacionadas a lineup
      const relatedTables = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name LIKE '%lineup%'
        ORDER BY table_name;
      `);
      
      console.log('\n🔍 Tabelas relacionadas a lineup encontradas:');
      relatedTables.rows.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar tabela:', error);
  } finally {
    await pool.end();
  }
}

checkLineupPlayersTable();
