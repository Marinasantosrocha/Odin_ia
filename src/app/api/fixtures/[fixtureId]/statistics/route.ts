import { NextRequest, NextResponse } from "next/server";
import { query } from '@/lib/db';

interface FixtureStatistic {
  team_id: number;
  type: string;
  value: string;
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

    // Buscar estatísticas da partida
    const result = await query<FixtureStatistic>(
      `SELECT 
        team_id,
        type,
        value
      FROM 
        fixture_statistics
      WHERE 
        fixture_id = $1
      ORDER BY 
        team_id, type`,
      [fixtureIdInt]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Nenhuma estatística encontrada para esta partida" },
        { status: 200 }
      );
    }

    // Agrupar estatísticas por time
    const teamStats: Record<number, Record<string, string>> = {};
    
    result.rows.forEach(row => {
      if (!teamStats[row.team_id]) {
        teamStats[row.team_id] = {};
      }
      teamStats[row.team_id][row.type] = row.value;
    });

    return NextResponse.json({
      data: result.rows,
      teamStats: teamStats
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas da partida" },
      { status: 500 }
    );
  }
}
