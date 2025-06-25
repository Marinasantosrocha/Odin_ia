import { query } from '../lib/db';

async function listDatabaseStructure() {
  try {
    console.log('Conectando ao banco de dados...');
    
    // Consulta para listar todas as tabelas do banco de dados (excluindo tabelas do sistema)
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n=== TABELAS DO BANCO DE DADOS ===');
    
    // Para cada tabela, listar suas colunas
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      console.log(`\n📋 TABELA: ${tableName}`);
      
      const columnsResult = await query(`
        SELECT 
          column_name, 
          data_type, 
          is_nullable,
          column_default
        FROM 
          information_schema.columns 
        WHERE 
          table_schema = 'public' AND 
          table_name = $1
        ORDER BY 
          ordinal_position
      `, [tableName]);
      
      console.log('  COLUNAS:');
      columnsResult.rows.forEach(column => {
        const nullable = column.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultValue = column.column_default ? `DEFAULT ${column.column_default}` : '';
        console.log(`    - ${column.column_name} (${column.data_type}) ${nullable} ${defaultValue}`);
      });
      
      // Verificar chaves primárias
      const primaryKeysResult = await query(`
        SELECT 
          kcu.column_name
        FROM 
          information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        WHERE 
          tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = $1
        ORDER BY 
          kcu.ordinal_position
      `, [tableName]);
      
      if (primaryKeysResult.rows.length > 0) {
        console.log('  CHAVE PRIMÁRIA:');
        primaryKeysResult.rows.forEach(pk => {
          console.log(`    - ${pk.column_name}`);
        });
      }
      
      // Verificar chaves estrangeiras
      const foreignKeysResult = await query(`
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM
          information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE
          tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = $1
      `, [tableName]);
      
      if (foreignKeysResult.rows.length > 0) {
        console.log('  CHAVES ESTRANGEIRAS:');
        foreignKeysResult.rows.forEach(fk => {
          console.log(`    - ${fk.column_name} -> ${fk.foreign_table_name}(${fk.foreign_column_name})`);
        });
      }
    }
    
    console.log('\n✅ Consulta concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao consultar estrutura do banco de dados:', error);
    process.exit(1);
  }
}

listDatabaseStructure().catch(console.error);
