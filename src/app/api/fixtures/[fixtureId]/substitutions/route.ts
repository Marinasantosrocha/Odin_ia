import { NextRequest, NextResponse } from "next/server";
import { query } from '@/lib/db';

interface Substitution {
  player_id_main: number;
  player_name_main: string;
  player_id_assist: number | null;
  player_name_assist: string | null;
  detail: string;
  time_elapsed: number;
  time_extra: number | null;
  team_id: number;
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

    // Buscar substituições da partida
    const result = await query<Substitution>(
      `SELECT 
        fe.player_id_main,
        fe.player_name_main,
        fe.player_id_assist,
        fe.player_name_assist,
        fe.detail,
        fe.time_elapsed,
        fe.time_extra,
        fe.team_id
      FROM fixture_events fe
      WHERE fe.fixture_id = $1
        AND fe.type = 'subst'
      ORDER BY fe.time_elapsed ASC`,
      [fixtureIdInt]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({
        data: [],
        message: "Nenhuma substituição registrada nesta partida",
        status: 200,
      });
    }

    // Processar os dados para o formato esperado pelo frontend
    // Na tabela, player_name_main é o jogador que saiu e player_name_assist é o jogador que entrou
    const processedData = result.rows.map(sub => {
      return {
        player_in_id: sub.player_id_assist,
        player_in_name: sub.player_name_assist || "Jogador desconhecido",
        player_out_name: sub.player_name_main,
        time_elapsed: sub.time_elapsed,
        minute: sub.time_elapsed, // Usando time_elapsed como minuto
        team_id: sub.team_id
      };
    });

    return NextResponse.json({
      data: processedData,
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao buscar substituições da partida:", error);
    return NextResponse.json(
      { error: "Erro ao buscar substituições da partida" },
      { status: 500 }
    );
  }
}
