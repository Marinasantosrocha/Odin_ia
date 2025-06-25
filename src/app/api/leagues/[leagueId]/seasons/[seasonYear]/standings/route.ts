import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface Standing {
  standing_id: number;
  league_id: number;
  season_year: number;
  team_id: number;
  team_name: string;
  team_logo: string;
  rank: number;
  points: number;
  goals_diff: number;
  group_name: string | null;
  form: string | null;
  status: string | null;
  description: string | null;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals_for: number;
  goals_against: number;
  last_update: string | null;
}

export async function GET(
  request: NextRequest,
  context: { params: { leagueId: string; seasonYear: string } }
) {
  try {
    const { leagueId, seasonYear } = context.params;
    const searchParams = request.nextUrl.searchParams;
    const groupName = searchParams.get('group');

    // Validar parâmetros
    if (!leagueId || !seasonYear) {
      return NextResponse.json(
        { error: 'ID da liga e ano da temporada são obrigatórios' },
        { status: 400 }
      );
    }

    // Construir a consulta SQL
    let queryText = `
      SELECT 
        s.standing_id, 
        s.league_id,
        s.season_year,
        s.team_id,
        t.name AS team_name,
        t.logo_url AS team_logo,
        s.rank,
        s.points,
        s.goals_diff,
        s.group_name,
        s.form,
        s.status,
        s.description,
        s.played,
        s.win,
        s.draw,
        s.lose,
        s.goals_for,
        s.goals_against,
        s.last_update
      FROM 
        standings s
      JOIN
        teams t ON s.team_id = t.team_id
      WHERE 
        s.league_id = $1 AND 
        s.season_year = $2
    `;

    const queryParams = [leagueId, seasonYear];

    // Adicionar filtro por grupo, se fornecido
    if (groupName) {
      queryText += ` AND s.group_name = $3`;
      queryParams.push(groupName);
    }

    // Ordenar por classificação
    queryText += ` ORDER BY s.rank ASC, s.points DESC, s.goals_diff DESC, s.goals_for DESC`;

    // Executar a consulta
    const result = await query<Standing>(queryText, queryParams);

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { data: [], message: 'Nenhuma classificação encontrada para esta liga e temporada' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      data: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Erro ao buscar classificação:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao buscar classificação',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
