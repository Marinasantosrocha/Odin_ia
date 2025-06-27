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
  goals_total: number;
  goals_assists: number;
  shots_total: number;
  shots_on: number;
  passes_total: number;
  passes_key: number;
  passes_accuracy: number;
  tackles_total: number;
  tackles_blocks: number;
  tackles_interceptions: number;
  duels_total: number;
  duels_won: number;
  dribbles_attempts: number;
  dribbles_success: number;
  dribbles_past: number;
  fouls_drawn: number;
  fouls_committed: number;
  cards_yellow: number;
  cards_red: number;
  penalty_won: number;
  penalty_committed: number;
  penalty_scored: number;
  penalty_missed: number;
  penalty_saved: number;
  goals_conceded: number;
  goals_saves: number;
  offsides: number;
  // Campos da escalação
  in_lineup: boolean;
  lineup_position?: string;
}

interface TeamPlayerStatistics {
  team_id: number;
  team_name: string;
  starting_eleven: PlayerStatistics[];
  substitutes: PlayerStatistics[];
  bench_players: PlayerStatistics[];
}

interface FixturePlayerStatisticsAlternativeResponse {
  fixture_id: number;
  home_team: TeamPlayerStatistics;
  away_team: TeamPlayerStatistics;
  total_players_with_stats: number;
  total_players_in_lineup: number;
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

    // 2. Buscar TODAS as estatísticas dos jogadores da partida e cruzar com escalação
    const combinedQuery = `
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
        fps.offsides,
        -- Verificar se está na escalação
        CASE WHEN fl.player_id IS NOT NULL THEN true ELSE false END as in_lineup,
        fl.position as lineup_position
      FROM fixture_player_statistics fps
      LEFT JOIN fixture_lineups fl ON fps.fixture_id = fl.fixture_id 
                                    AND fps.player_id = fl.player_id
      WHERE fps.fixture_id = $1
      ORDER BY fps.team_id, fps.games_number
    `;

    const combinedResult = await pool.query(combinedQuery, [fixtureId]);
    const allPlayerStatistics = combinedResult.rows as PlayerStatistics[];

    if (allPlayerStatistics.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma estatística encontrada para esta partida' },
        { status: 404 }
      );
    }

    // 3. Separar e organizar por time e categoria
    const organizeTeamPlayers = (teamId: number, teamName: string) => {
      const teamPlayers = allPlayerStatistics.filter(p => p.team_id === teamId);
      
      return {
        team_id: teamId,
        team_name: teamName,
        starting_eleven: teamPlayers.filter(p => p.in_lineup && !p.substitute),
        substitutes: teamPlayers.filter(p => p.in_lineup && p.substitute),
        bench_players: teamPlayers.filter(p => !p.in_lineup)
      };
    };

    const homeTeam = organizeTeamPlayers(fixture.home_team_id, fixture.home_team_name);
    const awayTeam = organizeTeamPlayers(fixture.away_team_id, fixture.away_team_name);

    // 4. Construir resposta
    const playersInLineup = allPlayerStatistics.filter(p => p.in_lineup).length;
    
    const response: FixturePlayerStatisticsAlternativeResponse = {
      fixture_id: fixtureId,
      home_team: homeTeam,
      away_team: awayTeam,
      total_players_with_stats: allPlayerStatistics.length,
      total_players_in_lineup: playersInLineup
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erro ao buscar estatísticas dos jogadores (método alternativo):', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
