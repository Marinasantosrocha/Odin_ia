import { Pool } from 'pg';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env.local
dotenv.config({ path: '.env.local' });

// Configuração da conexão com o banco de dados
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'football_data',
  user: process.env.DB_USER || 'pedro',
  password: process.env.DB_PASSWORD || 'Pedro2020**',
  // Habilita SSL apenas em produção (requer configuração adicional em produção)
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Testa a conexão com o banco de dados
async function testConnection() {
  const client = await pool.connect();
  try {
    console.log('Conectando ao banco de dados PostgreSQL...');
    const res = await client.query('SELECT NOW() as now');
    console.log('Conexão bem-sucedida! Hora atual do servidor:', res.rows[0].now);
    return { success: true, message: 'Conexão bem-sucedida!', time: res.rows[0].now };
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return { success: false, error: error };
  } finally {
    client.release();
  }
}

// Interface para o resultado da consulta
export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  command: string;
  oid: number;
  fields: any[];
}

// Função para executar consultas SQL com tipagem genérica
export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<QueryResult<T>>(text, params);
    const duration = Date.now() - start;
    console.log('Query executada', { text, duration, rows: res.rowCount });
    return res as unknown as QueryResult<T>;
  } catch (error) {
    console.error('Erro na consulta:', { text, error });
    throw error;
  }
}

export { pool, testConnection };
