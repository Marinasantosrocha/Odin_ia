import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuração do banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Interfaces para tipagem
interface PlayerStatistics {
  fixture_id: number;
  team_id: number;
  player_id: number;
  player_name: string;
  // Estatísticas de jogo
  games_minutes: number;
  games_number: number;
  games_position: string;
  games_rating: number;
  games_captain: boolean;
  games_substitute: boolean;
  minutes_played: number;
  rating: number;
  captain: boolean;
  substitute: boolean;
  // Estatísticas ofensivas
  goals_total: number;
  goals_assists: number;
  shots_total: number;
  shots_on: number;
  // Estatísticas de passes
  passes_total: number;
  passes_key: number;
  passes_accuracy: number;
  // Estatísticas defensivas
  tackles_total: number;
  tackles_blocks: number;
  tackles_interceptions: number;
  // Estatísticas de duelos
  duels_total: number;
  duels_won: number;
  // Estatísticas de drible
  dribbles_attempts: number;
  dribbles_success: number;
  dribbles_past: number;
  // Faltas e cartões
  fouls_drawn: number;
  fouls_committed: number;
  cards_yellow: number;
  cards_red: number;
  // Pênaltis
  penalty_won: number;
  penalty_committed: number;
  penalty_scored: number;
  penalty_missed: number;
  penalty_saved: number;
  // Goleiro
  goals_conceded: number;
  goals_saves: number;
  // Outros
  offsides: number;
}

interface LineupPlayer {
  player_id: number;
  team_id: number;
}

interface TeamPlayerStatistics {
  team_id: number;
  team_name: string;
  players: PlayerStatistics[];
}

interface FixturePlayerStatisticsResponse {
  fixture_id: number;
  home_team: TeamPlayerStatistics;
  away_team: TeamPlayerStatistics;
  total_players: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { fixtureId: string } }
) {
  try {
    const fixtureId = parseInt(params.fixtureId);

    if (isNaN(fixtureId)) {
      return NextResponse.json(
        { error: 'ID da partida inválido' },
        { status: 400 }
      );
    }

    // 1. Buscar informações básicas da partida
    const fixtureQuery = `
      SELECT 
        f.fixture_id,
        f.home_team_id,
        f.away_team_id,
        ht.name as home_team_name,
        at.name as away_team_name
      FROM fixtures f
      JOIN teams ht ON f.home_team_id = ht.team_id
      JOIN teams at ON f.away_team_id = at.team_id
      WHERE f.fixture_id = $1
    `;

    const fixtureResult = await pool.query(fixtureQuery, [fixtureId]);

    if (fixtureResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Partida não encontrada' },
        { status: 404 }
      );
    }

    const fixture = fixtureResult.rows[0];

    // 2. Buscar escalação da partida (jogadores que efetivamente jogaram)
    const lineupsQuery = `
      SELECT DISTINCT 
        player_id,
        team_id
      FROM fixture_lineups
      WHERE fixture_id = $1
    `;

    const lineupsResult = await pool.query(lineupsQuery, [fixtureId]);
    const escalatedPlayers = lineupsResult.rows as LineupPlayer[];

    if (escalatedPlayers.length === 0) {
      return NextResponse.json(
        { error: 'Escalação não encontrada para esta partida' },
        { status: 404 }
      );
    }

    // 3. Buscar estatísticas apenas dos jogadores escalados
    const playerIds = escalatedPlayers.map(p => p.player_id);
    
    const statisticsQuery = `
      SELECT 
        fps.fixture_id,
        fps.team_id,
        fps.player_id,
        fps.player_name,
        fps.games_minutes,
        fps.games_number,
        fps.games_position,
        fps.games_rating,
        fps.games_captain,
        fps.games_substitute,
        fps.minutes_played,
        fps.rating,
        fps.captain,
        fps.substitute,
        fps.goals_total,
        fps.goals_assists,
        fps.shots_total,
        fps.shots_on,
        fps.passes_total,
        fps.passes_key,
        fps.passes_accuracy,
        fps.tackles_total,
        fps.tackles_blocks,
        fps.tackles_interceptions,
        fps.duels_total,
        fps.duels_won,
        fps.dribbles_attempts,
        fps.dribbles_success,
        fps.dribbles_past,
        fps.fouls_drawn,
        fps.fouls_committed,
        fps.cards_yellow,
        fps.cards_red,
        fps.penalty_won,
        fps.penalty_committed,
        fps.penalty_scored,
        fps.penalty_missed,
        fps.penalty_saved,
        fps.goals_conceded,
        fps.goals_saves,
        fps.offsides
      FROM fixture_player_statistics fps
      WHERE fps.fixture_id = $1 
        AND fps.player_id = ANY($2)
      ORDER BY fps.team_id, fps.games_number
    `;

    const statisticsResult = await pool.query(statisticsQuery, [fixtureId, playerIds]);
    const playerStatistics = statisticsResult.rows as PlayerStatistics[];

    // 4. Organizar dados por time
    const homeTeamPlayers = playerStatistics.filter(p => p.team_id === fixture.home_team_id);
    const awayTeamPlayers = playerStatistics.filter(p => p.team_id === fixture.away_team_id);

    // 5. Construir resposta
    const response: FixturePlayerStatisticsResponse = {
      fixture_id: fixtureId,
      home_team: {
        team_id: fixture.home_team_id,
        team_name: fixture.home_team_name,
        players: homeTeamPlayers
      },
      away_team: {
        team_id: fixture.away_team_id,
        team_name: fixture.away_team_name,
        players: awayTeamPlayers
      },
      total_players: playerStatistics.length
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erro ao buscar estatísticas dos jogadores:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
