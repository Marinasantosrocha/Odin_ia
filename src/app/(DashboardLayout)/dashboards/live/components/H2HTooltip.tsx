"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  Paper,
  Divider,
  Chip,
  Avatar,
  Stack
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface H2HMatch {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
    };
  };
  league: {
    name: string;
    logo: string;
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

interface H2HTooltipProps {
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
  children: React.ReactElement;
}

const StyledTooltip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 450,
    fontSize: '0.875rem',
    border: '1px solid #dadde9',
    borderRadius: 8,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    padding: 0,
  },
});

const H2HTooltip: React.FC<H2HTooltipProps> = ({ homeTeam, awayTeam, children }) => {
  const [h2hData, setH2hData] = useState<H2HMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const fetchH2HData = async () => {
    if (h2hData.length > 0) return; // Já carregou

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/live/h2h-api?team1=${homeTeam.id}&team2=${awayTeam.id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar H2H: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data && Array.isArray(data.data)) {
        setH2hData(data.data);
      } else {
        setH2hData([]);
      }
    } catch (error) {
      console.error('Erro ao buscar dados H2H:', error);
      setError('Erro ao carregar confrontos anteriores');
      setH2hData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
    fetchH2HData();
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  // Calcular estatísticas
  const getH2HStats = () => {
    if (h2hData.length === 0) return null;

    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;
    let totalGoalsHome = 0;
    let totalGoalsAway = 0;

    h2hData.forEach(match => {
      const isHomeTeamHome = match.teams.home.id === homeTeam.id;
      const homeGoals = match.goals.home;
      const awayGoals = match.goals.away;

      if (isHomeTeamHome) {
        totalGoalsHome += homeGoals;
        totalGoalsAway += awayGoals;
        if (homeGoals > awayGoals) homeWins++;
        else if (homeGoals < awayGoals) awayWins++;
        else draws++;
      } else {
        totalGoalsHome += awayGoals;
        totalGoalsAway += homeGoals;
        if (awayGoals > homeGoals) homeWins++;
        else if (awayGoals < homeGoals) awayWins++;
        else draws++;
      }
    });

    return {
      homeWins,
      awayWins,
      draws,
      totalMatches: h2hData.length,
      totalGoalsHome,
      totalGoalsAway,
      avgGoalsHome: (totalGoalsHome / h2hData.length).toFixed(1),
      avgGoalsAway: (totalGoalsAway / h2hData.length).toFixed(1)
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getResultColor = (match: H2HMatch, teamId: number) => {
    const isHome = match.teams.home.id === teamId;
    const homeGoals = match.goals.home;
    const awayGoals = match.goals.away;

    if (isHome) {
      if (homeGoals > awayGoals) return '#4caf50'; // Verde para vitória
      if (homeGoals < awayGoals) return '#f44336'; // Vermelho para derrota
      return '#ff9800'; // Laranja para empate
    } else {
      if (awayGoals > homeGoals) return '#4caf50'; // Verde para vitória
      if (awayGoals < homeGoals) return '#f44336'; // Vermelho para derrota
      return '#ff9800'; // Laranja para empate
    }
  };

  const renderTooltipContent = () => {
    if (loading) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Carregando confrontos...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </Box>
      );
    }

    if (h2hData.length === 0) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Nenhum confronto anterior encontrado
          </Typography>
        </Box>
      );
    }

    const stats = getH2HStats();
    if (!stats) return null;

    return (
      <Paper sx={{ maxWidth: 600, minWidth: 500, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, textAlign: 'center' }}>
            Confrontos Diretos
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
            <Avatar src={homeTeam.logo} sx={{ width: 24, height: 24 }} />
            <Typography variant="body2" sx={{ mx: 1, fontWeight: 500 }}>
              {homeTeam.name} vs {awayTeam.name}
            </Typography>
            <Avatar src={awayTeam.logo} sx={{ width: 24, height: 24 }} />
          </Box>
        </Box>

        {/* Estatísticas Gerais */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                {stats.homeWins}
              </Typography>
              <Typography variant="caption" display="block">
                Vitórias
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                {homeTeam.name}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">
                {stats.draws}
              </Typography>
              <Typography variant="caption" display="block">
                Empates
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="error.main">
                {stats.awayWins}
              </Typography>
              <Typography variant="caption" display="block">
                Vitórias
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                {awayTeam.name}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Estatísticas de Gols */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Total de jogos: <strong>{stats.totalMatches}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Média de gols: <strong>{stats.avgGoalsHome} - {stats.avgGoalsAway}</strong>
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Lista dos últimos confrontos */}
        <Box sx={{ p: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Últimos Confrontos:
          </Typography>
          <Stack spacing={1}>
            {h2hData.slice(0, 5).map((match, index) => {
              const isHomeTeamHome = match.teams.home.id === homeTeam.id;
              const displayHomeTeam = isHomeTeamHome ? homeTeam : awayTeam;
              const displayAwayTeam = isHomeTeamHome ? awayTeam : homeTeam;
              const displayHomeGoals = isHomeTeamHome ? match.goals.home : match.goals.away;
              const displayAwayGoals = isHomeTeamHome ? match.goals.away : match.goals.home;

              return (
                <Box key={match.fixture.id} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 1, 
                  backgroundColor: index % 2 === 0 ? '#fafafa' : 'transparent',
                  borderRadius: 1
                }}>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <Avatar src={displayHomeTeam.logo} sx={{ width: 20, height: 20, mr: 1 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', minWidth: 60 }}>
                      {displayHomeTeam.name.length > 8 ? 
                        displayHomeTeam.name.substring(0, 8) + '...' : 
                        displayHomeTeam.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mx: 1, 
                    backgroundColor: getResultColor(match, homeTeam.id),
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    minWidth: 40,
                    justifyContent: 'center'
                  }}>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                      {displayHomeGoals} - {displayAwayGoals}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', minWidth: 60, textAlign: 'right' }}>
                      {displayAwayTeam.name.length > 8 ? 
                        displayAwayTeam.name.substring(0, 8) + '...' : 
                        displayAwayTeam.name}
                    </Typography>
                    <Avatar src={displayAwayTeam.logo} sx={{ width: 20, height: 20, ml: 1 }} />
                  </Box>
                  
                  <Typography variant="caption" sx={{ ml: 1, minWidth: 60, fontSize: '0.7rem' }}>
                    {formatDate(match.fixture.date)}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Paper>
    );
  };

  return (
    <StyledTooltip
      title={renderTooltipContent()}
      placement="top"
      arrow
      open={tooltipOpen}
      onOpen={handleTooltipOpen}
      onClose={handleTooltipClose}
      enterDelay={300}
      leaveDelay={200}
    >
      {children}
    </StyledTooltip>
  );
};

export default H2HTooltip;
