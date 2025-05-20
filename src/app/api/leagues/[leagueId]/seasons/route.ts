import { query, QueryResult } from '@/lib/db';
import { NextResponse } from 'next/server';

interface SeasonRow {
  season_year: number;
}

interface RouteParams {
  params: {
    leagueId: string;
  };
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { leagueId } = params;
    
    if (!leagueId) {
      return NextResponse.json(
        { error: 'ID da liga não fornecido' },
        { status: 400 }
      );
    }

    const result = await query<SeasonRow>(
      'SELECT DISTINCT season_year FROM team_seasons WHERE league_id = $1 ORDER BY season_year DESC',
      [leagueId]
    );
    
    // Extrai apenas os anos das temporadas
    const seasons = result.rows.map(row => row.season_year);
    
    return NextResponse.json(seasons);
  } catch (error) {
    console.error('Erro ao buscar temporadas:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao buscar temporadas',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
