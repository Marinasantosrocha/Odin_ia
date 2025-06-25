import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interface para o formato da API-Football (novo)
interface ApiFootballFixture {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
    };
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number;
    away: number;
  };
}

// Interface para compatibilidade com o formato antigo (banco local)
interface H2HFixture {
  fixture_id: number;
  date: string;
  home_team_id: number;
  away_team_id: number;
  home_team_name: string;
  away_team_name: string;
  goals_home: number;
  goals_away: number;
  status_short: string;
}

interface H2HDisplayProps {
  h2hData: (ApiFootballFixture | H2HFixture)[] | null;
  loading: boolean;
  error: string | null;
  currentMatch: {
    teams: {
      home: { id: number; name: string; logo: string };
      away: { id: number; name: string; logo: string };
    };
  };
}

const H2HDisplay: React.FC<H2HDisplayProps> = ({ h2hData, loading, error, currentMatch }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
        <CircularProgress size={20} sx={{ mr: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Carregando histórico de confrontos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        {error}
      </Alert>
    );
  }

  if (!h2hData || h2hData.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        Nenhum confronto anterior encontrado entre estes times.
      </Alert>
    );
  }

  // Função para verificar se é o formato da API-Football
  const isApiFootballFormat = (match: any): match is ApiFootballFixture => {
    return match.fixture && match.teams && match.goals;
  };

  // Função para normalizar os dados independente do formato
  const normalizeMatch = (match: ApiFootballFixture | H2HFixture) => {
    if (isApiFootballFormat(match)) {
      return {
        id: match.fixture.id,
        date: match.fixture.date,
        home_team_id: match.teams.home.id,
        away_team_id: match.teams.away.id,
        home_team_name: match.teams.home.name,
        away_team_name: match.teams.away.name,
        goals_home: match.goals.home,
        goals_away: match.goals.away,
        status_short: match.fixture.status.short
      };
    } else {
      return {
        id: match.fixture_id,
        date: match.date,
        home_team_id: match.home_team_id,
        away_team_id: match.away_team_id,
        home_team_name: match.home_team_name,
        away_team_name: match.away_team_name,
        goals_home: match.goals_home,
        goals_away: match.goals_away,
        status_short: match.status_short
      };
    }
  };

  // Normalizar todos os jogos
  const normalizedMatches = h2hData.map(normalizeMatch);

  // Calcular estatísticas
  const homeTeamWins = normalizedMatches.filter(match => {
    const isHomeTeamCurrentHome = match.home_team_id === currentMatch.teams.home.id;
    const isHomeTeamCurrentAway = match.away_team_id === currentMatch.teams.home.id;
    
    if (isHomeTeamCurrentHome) {
      return match.goals_home > match.goals_away;
    } else if (isHomeTeamCurrentAway) {
      return match.goals_away > match.goals_home;
    }
    return false;
  }).length;

  const awayTeamWins = normalizedMatches.filter(match => {
    const isAwayTeamCurrentHome = match.home_team_id === currentMatch.teams.away.id;
    const isAwayTeamCurrentAway = match.away_team_id === currentMatch.teams.away.id;
    
    if (isAwayTeamCurrentHome) {
      return match.goals_home > match.goals_away;
    } else if (isAwayTeamCurrentAway) {
      return match.goals_away > match.goals_home;
    }
    return false;
  }).length;

  const draws = normalizedMatches.filter(match => match.goals_home === match.goals_away).length;

  // Função para determinar o resultado para o time atual
  const getMatchResult = (match: any, teamId: number) => {
    const isHome = match.home_team_id === teamId;
    const goalsFor = isHome ? match.goals_home : match.goals_away;
    const goalsAgainst = isHome ? match.goals_away : match.goals_home;
    
    if (goalsFor > goalsAgainst) return 'W';
    if (goalsFor < goalsAgainst) return 'L';
    return 'D';
  };

  // Função para formatar a data
  const formatMatchDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Últimos {normalizedMatches.length} Confrontos
      </Typography>
      
      {/* Estatísticas resumidas */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="success.main">{homeTeamWins}</Typography>
          <Typography variant="caption" color="text.secondary">
            {currentMatch.teams.home.name}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="warning.main">{draws}</Typography>
          <Typography variant="caption" color="text.secondary">Empates</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="error.main">{awayTeamWins}</Typography>
          <Typography variant="caption" color="text.secondary">
            {currentMatch.teams.away.name}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Lista de confrontos */}
      <Stack spacing={1}>
        {normalizedMatches.map((match, index) => {
          const homeResult = getMatchResult(match, match.home_team_id);
          const awayResult = getMatchResult(match, match.away_team_id);
          
          return (
            <Paper 
              key={match.id} 
              elevation={0} 
              sx={{ 
                p: 2, 
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Data */}
                <Typography variant="caption" color="text.secondary">
                  {formatMatchDate(match.date)}
                </Typography>
                
                {/* Status */}
                <Chip 
                  label={match.status_short} 
                  size="small" 
                  variant="outlined"
                  sx={{ minWidth: 45 }}
                />
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 2, alignItems: 'center', mt: 1 }}>
                {/* Time da casa */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Box sx={{ textAlign: 'right', mr: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {match.home_team_name}
                    </Typography>
                    <Chip
                      label={homeResult}
                      size="small"
                      color={homeResult === 'W' ? 'success' : homeResult === 'L' ? 'error' : 'warning'}
                      sx={{ minWidth: 30, height: 20, fontSize: '0.75rem' }}
                    />
                  </Box>
                </Box>

                {/* Placar */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {match.goals_home} - {match.goals_away}
                  </Typography>
                </Box>

                {/* Time visitante */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {match.away_team_name}
                    </Typography>
                    <Chip
                      label={awayResult}
                      size="small"
                      color={awayResult === 'W' ? 'success' : awayResult === 'L' ? 'error' : 'warning'}
                      sx={{ minWidth: 30, height: 20, fontSize: '0.75rem' }}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};

export default H2HDisplay;
