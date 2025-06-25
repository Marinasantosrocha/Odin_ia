import { query, QueryResult } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface Fixture {
  fixture_id: number;
  date: string;
  status_long: string;
  status_short: string;
  home_team_id: number;
  away_team_id: number;
  home_team_name: string;
  away_team_name: string;
  home_team_logo: string;
  away_team_logo: string;
  goals_home: number | null;
  goals_away: number | null;
  round_id: string;
  round_name: string;
  is_current_round: boolean;
}

export async function GET(
  request: NextRequest,
  context: { params: { leagueId: string; seasonYear: string } }
) {
  try {
    const { leagueId, seasonYear } = await context.params;

    // Validar parâmetros
    if (!leagueId || !seasonYear) {
      return NextResponse.json(
        { error: 'ID da liga e ano da temporada são obrigatórios' },
        { status: 400 }
      );
    }
    // Consultar fixtures com JOIN para buscar os nomes e logos dos times
    // Primeiro, vamos buscar as partidas sem a informação de rodada para garantir que funcione
    const result = await query<Fixture>(`
      SELECT 
        f.fixture_id, 
        f.date, 
        f.status_long, 
        f.status_short,
        f.home_team_id,
        f.away_team_id,
        home.name AS home_team_name,
        away.name AS away_team_name,
        home.logo_url AS home_team_logo,
        away.logo_url AS away_team_logo,
        f.goals_home,
        f.goals_away,
        f.round AS round_id,
        COALESCE(fr.round_name, CONCAT('Rodada ', f.round)) AS round_name,
        COALESCE(fr.is_current, false) AS is_current_round
      FROM 
        fixtures f
      JOIN 
        teams home ON f.home_team_id = home.team_id
      JOIN 
        teams away ON f.away_team_id = away.team_id
      LEFT JOIN
        fixture_rounds fr ON f.round = fr.round_id 
        AND f.league_id = fr.league_id 
        AND CAST(f.season_year AS VARCHAR) = fr.season
      WHERE 
        f.league_id = $1 AND 
        f.season_year = $2
      ORDER BY 
        f.round ASC, f.date ASC
    `, [leagueId, seasonYear]);

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { data: [], message: 'Nenhuma partida encontrada para esta liga e temporada' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      data: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Erro ao buscar partidas:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao buscar partidas',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
