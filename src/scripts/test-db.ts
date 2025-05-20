import { testConnection } from '../lib/db';

async function runTest() {
  console.log('Iniciando teste de conexão com o banco de dados...');
  const result = await testConnection();
  
  if (result.success) {
    console.log('✅ Teste de conexão bem-sucedido!');
    console.log(`Hora do servidor: ${result.time}`);
    process.exit(0);
  } else {
    console.error('❌ Falha na conexão com o banco de dados:');
    console.error(result.error);
    process.exit(1);
  }
}

runTest().catch(console.error);
