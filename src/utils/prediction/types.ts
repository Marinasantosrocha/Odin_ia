// Types for the prediction system

export interface MatchData {
  fixture_id: number;
  home_team_name: string;
  away_team_name: string;
  home_team_id: number;
  away_team_id: number;
  league_id: number;
  season_year: number;
  date: string;
  status_long: string;
  status_short: string;
  goals_home: number | null;
  goals_away: number | null;
  round_id: string;
  round_name: string;
  is_current_round: boolean;
}

export interface TeamForm {
  team_id: number;
  team_name: string;
  recent_matches: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  form_score: number; // Pontuação de 0 a 1
}

export interface H2HStats {
  home_team_id: number;
  away_team_id: number;
  total_matches: number;
  home_wins: number;
  draws: number;
  away_wins: number;
  home_goals_avg: number;
  away_goals_avg: number;
  home_advantage: number; // Pontuação de 0 a 1
}

export interface PredictionFactors {
  home_form: number;
  away_form: number;
  h2h_advantage: number;
  home_advantage: number;
  goals_expectancy: number;
  team_statistics_advantage: number; // Novo fator baseado em estatísticas
}

export interface Prediction {
  id: string;
  fixture_id: number;
  probabilities: {
    home_win: number;
    draw: number;
    away_win: number;
  };
  confidence: number;
  factors: PredictionFactors;
  predicted_result: 'HOME' | 'DRAW' | 'AWAY';
  actual_result?: 'HOME' | 'DRAW' | 'AWAY' | null;
  is_correct?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PredictionModel {
  id: string;
  league_id: number;
  season_year: number;
  weights: {
    recent_form: number;
    h2h_history: number;
    home_advantage: number;
    goals_average: number;
    team_statistics: number;
  };
  patterns: {
    home_win_rate: number;
    draw_rate: number;
    away_win_rate: number;
    avg_goals_per_match: number;
  };
  performance: {
    accuracy: number;
    precision: number;
    total_predictions: number;
    correct_predictions: number;
  };
  created_at: Date;
  last_updated: Date;
}

export interface ValidationResult {
  total_matches: number;
  correct_predictions: number;
  accuracy: number;
  precision_by_outcome: {
    home_win: number;
    draw: number;
    away_win: number;
  };
  confidence_correlation: number;
}

export interface AnalysisProgress {
  total_matches: number;
  processed_matches: number;
  current_match: MatchData | null;
  predictions_made: number;
  current_accuracy: number;
  progress_percentage: number;
}

export interface MatchStatistics {
  fixture_id: number;
  team_id: number;
  type: string;
  value: string;
}

export interface TeamStats {
  team_id: number;
  team_name: string;
  // Estatísticas ofensivas
  avg_ball_possession: number;
  avg_total_shots: number;
  avg_shots_on_goal: number;
  avg_shots_accuracy: number; // shots_on_goal / total_shots
  avg_corner_kicks: number;
  avg_expected_goals: number;
  
  // Estatísticas defensivas
  avg_goalkeeper_saves: number;
  avg_blocked_shots: number;
  avg_fouls_committed: number;
  avg_cards_received: number; // yellow + red cards
  
  // Estatísticas de controle
  avg_passes_accuracy: number;
  avg_offsides: number;
  
  // Pontuação geral das estatísticas (0 a 1)
  offensive_rating: number;
  defensive_rating: number;
  overall_rating: number;
}
