import { NextRequest, NextResponse } from "next/server";
import { query } from '@/lib/db';

interface FixtureEvent {
  player_name_main: string;
  detail: string;
  time_elapsed: number;
  team_id: number;
  type: string;
}

export async function GET(
  request: NextRequest,
  context: { params: { fixtureId: string } }
) {
  try {
    const { fixtureId } = await context.params;
    const fixtureIdInt = parseInt(fixtureId, 10);

    if (isNaN(fixtureIdInt)) {
      return NextResponse.json(
        { error: "ID da partida inválido" },
        { status: 400 }
      );
    }

    // Buscar cartões e gols da partida
    const result = await query<FixtureEvent>(
      `SELECT DISTINCT
        fe.player_name_main,
        fe.detail,
        fe.time_elapsed,
        fe.team_id,
        fe.type
      FROM fixture_events fe
      WHERE fe.fixture_id = $1
        AND (
          (fe.type = 'Card' AND fe.detail IN ('Yellow Card', 'Red Card'))
          OR
          (fe.type IN ('Goal', 'Var'))
        )
      GROUP BY fe.player_name_main, fe.detail, fe.time_elapsed, fe.team_id, fe.type
      ORDER BY fe.time_elapsed ASC`,
      [fixtureIdInt]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({
        data: [],
        message: "Nenhum evento (cartão ou gol) registrado nesta partida",
        status: 200,
      });
    }

    return NextResponse.json({
      data: result.rows,
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao buscar eventos da partida:", error);
    return NextResponse.json(
      { error: "Erro ao buscar eventos da partida" },
      { status: 500 }
    );
  }
}
