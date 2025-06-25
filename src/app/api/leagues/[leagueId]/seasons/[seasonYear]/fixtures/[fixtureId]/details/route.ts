import { query, QueryResult } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface CardEvent {
  fixture_id: number;
  team_id: number;
  player_id: number;
  player_name: string;
  detail: string; // Cor do cartão (yellow ou red)
  time: string;
  type: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { leagueId: string; seasonYear: string; fixtureId: string } }
) {
  try {
    const { leagueId, seasonYear, fixtureId } = params;

    if (!leagueId || !seasonYear || !fixtureId) {
      return NextResponse.json(
        { error: 'ID da liga, ano da temporada e ID da partida são obrigatórios' },
        { status: 400 }
      );
    }

    const [fixtureInfoResult, cardsResult] = await Promise.all([
      query(`
        SELECT 
          f.date,
          f.status_short as status,
          home.name as home_team,
          away.name as away_team,
          f.goals_home,
          f.goals_away
        FROM 
          fixtures f
        JOIN 
          teams home ON f.home_team_id = home.team_id
        JOIN 
          teams away ON f.away_team_id = away.team_id
        WHERE 
          f.fixture_id = $1
      `, [fixtureId]),

      query<CardEvent>(`
        SELECT 
          fe.fixture_id,
          fe.team_id,
          fe.player_id,
          p.name as player_name,
          fe.detail,
          fe.time,
          fe.type
        FROM 
          fixture_events fe
        JOIN 
          players p ON fe.player_id = p.player_id
        WHERE 
          fe.fixture_id = $1 AND
          fe.type = 'card'
        ORDER BY
          fe.time ASC
      `, [fixtureId])
    ]);

    const fixtureInfo = fixtureInfoResult.rows[0];
    // Mapear detail para 'yellow' ou 'red'
    const cards = cardsResult.rows.reduce((acc: Record<string, CardEvent[]>, card) => {
      let color = '';
      if (card.detail === 'Yellow Card') color = 'yellow';
      else if (card.detail === 'Red Card') color = 'red';
      else color = card.detail;
      const cardWithColor = { ...card, detail: color };
      if (!acc[card.team_id.toString()]) {
        acc[card.team_id.toString()] = [];
      }
      acc[card.team_id.toString()].push(cardWithColor);
      return acc;
    }, {});

    return NextResponse.json({
      cards,
      fixtureInfo: {
        date: fixtureInfo.date,
        status: fixtureInfo.status,
        home_team: fixtureInfo.home_team,
        away_team: fixtureInfo.away_team,
        home_goals: fixtureInfo.goals_home,
        away_goals: fixtureInfo.goals_away
      }
    });
  } catch (error) {
    console.error('Erro ao buscar detalhes da partida:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar detalhes da partida' },
      { status: 500 }
    );
  }
}
