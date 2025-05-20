import { query, QueryResult } from '@/lib/db';
import { NextResponse } from 'next/server';

interface League {
  league_id: number;
  name: string;
  logo_url?: string;
  country_name?: string;
  country_code?: string;
}

export async function GET() {
  try {
    const result = await query<League>(
      'SELECT league_id, name, logo_url, country_name, country_code FROM leagues ORDER BY name'
    );
    
    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { data: [], message: 'Nenhuma liga encontrada' },
        { status: 200 }
      );
    }
    
    return NextResponse.json({
      data: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    console.error('Erro ao buscar ligas:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao buscar ligas',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
