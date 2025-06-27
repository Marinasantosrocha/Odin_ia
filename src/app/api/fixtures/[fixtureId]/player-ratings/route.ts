import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// Interface para o retorno da API
interface PlayerRating {
  player_id: number;
  player_name: string;
  games_rating: number | null;
  team_id: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { fixtureId: string } }
) {
  try {
    const fixtureId = params.fixtureId;

    // Buscar games_rating dos jogadores escalados para a partida
    const result = await query({
      text: `
        SELECT DISTINCT
          fps.player_id,
          fps.player_name,
          fps.games_rating,
          fps.team_id
        FROM fixture_player_statistics fps
        INNER JOIN lineup_players lp ON fps.fixture_id = lp.fixture_id 
          AND fps.player_id = lp.player_id
          AND fps.team_id = lp.team_id
        WHERE fps.fixture_id = $1
          AND fps.games_rating IS NOT NULL
        ORDER BY fps.team_id, fps.player_name
      `,
      values: [fixtureId]
    });

    const playerRatings: PlayerRating[] = result.rows.map(row => ({
      player_id: parseInt(row.player_id),
      player_name: row.player_name,
      games_rating: row.games_rating ? parseFloat(row.games_rating) : null,
      team_id: parseInt(row.team_id)
    }));

    return NextResponse.json({
      success: true,
      data: playerRatings,
      count: playerRatings.length
    });

  } catch (error) {
    console.error('Erro ao buscar ratings dos jogadores:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
