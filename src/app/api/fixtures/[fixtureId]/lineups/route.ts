import { NextRequest, NextResponse } from "next/server";
import { query } from '@/lib/db';

interface LineupPlayer {
  team_id: number;
  player_id: number;
  player_name: string;
  number: number;
  position: string;
  grid: string | null;
  is_starter: boolean;
}

interface TeamLineup {
  team_id: number;
  formation: string;
  coach_name: string;
  coach_photo: string | null;
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
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

    // Buscar informações básicas das escalações (formação, técnico)
    const lineupsResult = await query(`
      SELECT 
        lineup_id,
        team_id,
        formation,
        coach_name,
        coach_photo
      FROM 
        lineups
      WHERE 
        fixture_id = $1
    `, [fixtureIdInt]);

    if (lineupsResult.rowCount === 0) {
      return NextResponse.json(
        { message: "Nenhuma escalação encontrada para esta partida" },
        { status: 200 }
      );
    }

    // Buscar jogadores das escalações
    const playersResult = await query<LineupPlayer>(`
      SELECT 
        team_id,
        player_id,
        player_name,
        number,
        position,
        grid,
        is_starter
      FROM 
        lineup_players
      WHERE 
        fixture_id = $1
      ORDER BY 
        team_id, is_starter DESC, position, number
    `, [fixtureIdInt]);

    // Organizar os dados por time
    const teamLineups: Record<number, TeamLineup> = {};

    // Inicializar estrutura de dados para cada time
    lineupsResult.rows.forEach(lineup => {
      teamLineups[lineup.team_id] = {
        team_id: lineup.team_id,
        formation: lineup.formation,
        coach_name: lineup.coach_name,
        coach_photo: lineup.coach_photo,
        starters: [],
        substitutes: []
      };
    });

    // Adicionar jogadores às respectivas equipes
    playersResult.rows.forEach(player => {
      if (!teamLineups[player.team_id]) {
        teamLineups[player.team_id] = {
          team_id: player.team_id,
          formation: 'Desconhecida',
          coach_name: 'Desconhecido',
          coach_photo: null,
          starters: [],
          substitutes: []
        };
      }

      if (player.is_starter) {
        teamLineups[player.team_id].starters.push(player);
      } else {
        teamLineups[player.team_id].substitutes.push(player);
      }
    });

    return NextResponse.json({
      data: Object.values(teamLineups)
    });
  } catch (error) {
    console.error("Erro ao buscar escalações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar escalações da partida" },
      { status: 500 }
    );
  }
}
