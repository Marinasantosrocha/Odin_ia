import { query, QueryResult } from '@/lib/db';
import { NextRequest, NextResponse } from "next/server";

interface Season {
  season_year: number;
}

interface RouteParams {
  params: {
    leagueId: string;
  };
}

export async function GET(
  request: NextRequest,
  context: { params: { leagueId: string } }
) {
  try {
    const { leagueId } = await context.params;
    if (!leagueId) {
      return NextResponse.json(
        { error: 'ID da liga não fornecido' },
        { status: 400 }
      );
    }

    const result: QueryResult<Season> = await query(
      `SELECT DISTINCT season_year
       FROM fixtures
       WHERE league_id = $1
       ORDER BY season_year DESC`,
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
