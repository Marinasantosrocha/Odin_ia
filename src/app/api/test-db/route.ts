import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

// Rota de teste de conexão com o banco de dados
export async function GET() {
  try {
    console.log('Iniciando teste de conexão com o banco de dados...');
    const result = await testConnection();
    
    if (result.success) {
      console.log('✅ Conexão bem-sucedida!');
      return NextResponse.json({ 
        status: 'success', 
        message: 'Conexão bem-sucedida!',
        serverTime: result.time,
        database: 'PostgreSQL',
        statusCode: 200
      });
    } else {
      console.error('❌ Falha na conexão:', result.error);
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Falha na conexão com o banco de dados',
          error: result.error.message || 'Erro desconhecido',
          statusCode: 500
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Erro inesperado ao conectar ao banco de dados', 
        error: error.message || 'Erro desconhecido',
        statusCode: 500
      },
      { status: 500 }
    );
  }
}

// Para evitar erros de tipagem no TypeScript
export const dynamic = 'force-dynamic';
