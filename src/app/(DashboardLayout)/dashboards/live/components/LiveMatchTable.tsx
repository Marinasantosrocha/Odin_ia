import React, { useState, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Collapse,
  Chip
} from '@mui/material';
import {
  AccessTime,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material';
import LiveMatchCard from './LiveMatchCard';
import LastGamesDisplay from './LastGamesDisplay';

interface LiveMatchTableProps {
  matches: Array<{
    fixture: {
      id: number;
      status: {
        long: string;
        short: string;
        elapsed: number | null;
      };
    };
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      round: string;
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
      home: number | null;
      away: number | null;
    };
    score: {
      halftime: {
        home: number | null;
        away: number | null;
      };
    };
  }>;
  matchEvents: { [key: number]: any[] };
  onFetchEvents: (fixtureId: number) => void;
}

const LiveMatchTable: React.FC<LiveMatchTableProps> = ({ 
  matches, 
  matchEvents, 
  onFetchEvents 
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [standingsData, setStandingsData] = useState<{ [key: string]: any[] }>({});
  const [loadingStandings, setLoadingStandings] = useState<Set<string>>(new Set());
  const [failedStandings, setFailedStandings] = useState<Set<string>>(new Set()); // Cache para ligas sem dados

  // Função para buscar classificação de uma liga
  const fetchStandings = useCallback(async (leagueId: number, season: string = new Date().getFullYear().toString()) => {
    const cacheKey = `${leagueId}-${season}`;
    
    // Verificar se já está carregando, já foi carregado, ou já falhou
    if (loadingStandings.has(cacheKey) || standingsData[cacheKey] || failedStandings.has(cacheKey)) {
      return;
    }

    // Marcar como carregando
    setLoadingStandings(prev => new Set(prev).add(cacheKey));

    try {
      const response = await fetch(`/api/live/standings-api?league=${leagueId}&season=${season}`);
      
      if (!response.ok) {
        // Se retornou 404, marcar como falha para não tentar novamente
        if (response.status === 404) {
          setFailedStandings(prev => new Set(prev).add(cacheKey));
          console.log(`Liga ${leagueId} (temporada ${season}) - classificação não disponível`);
          return; // Retornar silenciosamente para 404
        }
        throw new Error(`Erro ao buscar classificação: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setStandingsData(prev => ({
          ...prev,
          [cacheKey]: data.data
        }));
      } else {
        // Marcar como falha se não há dados válidos
        setFailedStandings(prev => new Set(prev).add(cacheKey));
        console.log(`Liga ${leagueId} (temporada ${season}) - dados de classificação inválidos`);
      }
    } catch (error) {
      // Só logar erro se não for 404 (que já foi tratado acima)
      if (error instanceof Error && !error.message.includes('404')) {
        console.error('Erro ao buscar classificação:', error);
      }
      // Não marcar como falha para outros tipos de erro (timeout, rede, etc.)
    } finally {
      // Remover do loading
      setLoadingStandings(prev => {
        const newSet = new Set(prev);
        newSet.delete(cacheKey);
        return newSet;
      });
    }
  }, [loadingStandings, standingsData, failedStandings]);

  // Função para obter dados do time na classificação
  const getTeamStandingData = useCallback((teamId: number, leagueId: number, season: string = new Date().getFullYear().toString()) => {
    const cacheKey = `${leagueId}-${season}`;
    
    // Se já falhou anteriormente, não tentar novamente
    if (failedStandings.has(cacheKey)) {
      return null;
    }
    
    const leagueStandings = standingsData[cacheKey];
    
    if (!leagueStandings) {
      // Iniciar carregamento se ainda não foi feito
      fetchStandings(leagueId, season);
      return null;
    }

    return leagueStandings.find((team: any) => team.teamId === teamId);
  }, [failedStandings, standingsData, fetchStandings]);

  const handleRowToggle = (fixtureId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(fixtureId)) {
      newExpandedRows.delete(fixtureId);
    } else {
      newExpandedRows.add(fixtureId);
    }
    setExpandedRows(newExpandedRows);
  };

  // Função para obter status formatado
  const getFormattedTime = (match: any) => {
    const status = match.fixture.status.short;
    const elapsed = match.fixture.status.elapsed;

    switch (status) {
      case '1H':
        return `${elapsed}'`;
      case 'HT':
        return 'HT';
      case '2H':
        return `${elapsed}'`;
      case 'FT':
        return 'FT';
      case 'ET':
        return `${elapsed}' ET`;
      case 'P':
        return 'PEN';
      case 'SUSP':
        return 'SUSP';
      case 'INT':
        return 'INT';
      case 'CANC':
        return 'CANC';
      case 'ABD':
        return 'ABD';
      case 'AWD':
        return 'AWD';
      case 'WO':
        return 'WO';
      case 'LIVE':
        return 'LIVE';
      default:
        return status;
    }
  };

  // Função para obter tooltip do status
  const getStatusTooltip = (match: any) => {
    const status = match.fixture.status.short;
    
    switch (status) {
      case '1H':
        return 'Primeiro Tempo';
      case 'HT':
        return 'Intervalo';
      case '2H':
        return 'Segundo Tempo';
      case 'FT':
        return 'Tempo Regulamentar Finalizado';
      case 'ET':
        return 'Tempo Extra';
      case 'P':
        return 'Pênaltis';
      case 'SUSP':
        return 'Partida Suspensa';
      case 'INT':
        return 'Partida Interrompida';
      case 'CANC':
        return 'Partida Cancelada';
      case 'ABD':
        return 'Partida Abandonada';
      case 'AWD':
        return 'Decisão Técnica';
      case 'WO':
        return 'WO (Walkover)';
      case 'LIVE':
        return 'Ao Vivo';
      default:
        return match.fixture.status.long;
    }
  };

  // Função para determinar a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case '1H':
      case '2H':
      case 'LIVE':
        return 'success';
      case 'HT':
        return 'warning';
      case 'ET':
      case 'P':
        return 'error';
      case 'FT':
        return 'default';
      case 'SUSP':
      case 'INT':
      case 'CANC':
      case 'ABD':
        return 'error';
      default:
        return 'default';
    }
  };

  // Pré-calcular dados de classificação para evitar chamadas repetidas durante o render
  const matchesWithStandingsData = useMemo(() => {
    return matches.map(match => ({
      match,
      homeTeamStanding: getTeamStandingData(match.teams.home.id, match.league.id),
      awayTeamStanding: getTeamStandingData(match.teams.away.id, match.league.id)
    }));
  }, [matches, getTeamStandingData]);

  if (!matches || matches.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Nenhuma partida ao vivo encontrada
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.50' }}>
            <TableCell width="120px" align="center">
              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                <AccessTime fontSize="small" />
                <Typography variant="subtitle2" fontWeight="bold">
                  Tempo
                </Typography>
              </Box>
            </TableCell>
            <TableCell width="200px">
              <Typography variant="subtitle2" fontWeight="bold">
                Liga
              </Typography>
            </TableCell>
            <TableCell width="300px">
              <Typography variant="subtitle2" fontWeight="bold">
                Equipes
              </Typography>
            </TableCell>
            <TableCell width="100px" align="center">
              <Typography variant="subtitle2" fontWeight="bold">
                Placar
              </Typography>
            </TableCell>
            <TableCell width="120px" align="center">
              <Typography variant="subtitle2" fontWeight="bold">
                Últimos Jogos
              </Typography>
            </TableCell>
            <TableCell width="80px" align="center">
              <Typography variant="subtitle2" fontWeight="bold">
                Ações
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matchesWithStandingsData.map((matchData) => {
            const { match, homeTeamStanding, awayTeamStanding } = matchData;
            return (
            <React.Fragment key={match.fixture.id}>
              {/* Linha principal da partida */}
              <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                {/* Coluna Tempo */}
                <TableCell align="center">
                  <Tooltip title={getStatusTooltip(match)} arrow>
                    <Chip
                      icon={<AccessTime fontSize="small" />}
                      label={getFormattedTime(match)}
                      size="small"
                      color={getStatusColor(match.fixture.status.short) as any}
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Tooltip>
                </TableCell>

                {/* Coluna Liga */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar 
                      src={match.league.logo} 
                      sx={{ width: 24, height: 24 }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {match.league.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {match.league.round}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* Coluna Equipes */}
                <TableCell>
                  <Box>
                    {/* Time da Casa */}
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Avatar 
                        src={match.teams.home.logo} 
                        sx={{ width: 20, height: 20 }}
                      />
                      <Typography variant="body2" fontWeight="medium">
                        {match.teams.home.name}
                      </Typography>
                    </Box>
                    {/* Time Visitante */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar 
                        src={match.teams.away.logo} 
                        sx={{ width: 20, height: 20 }}
                      />
                      <Typography variant="body2" fontWeight="medium">
                        {match.teams.away.name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* Coluna Placar */}
                <TableCell align="center">
                  <Box>
                    {/* Placar Time Casa */}
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      color="primary"
                      sx={{ lineHeight: 1.2 }}
                    >
                      {match.goals.home ?? '-'}
                    </Typography>
                    {/* Placar Time Visitante */}
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      color="primary"
                      sx={{ lineHeight: 1.2 }}
                    >
                      {match.goals.away ?? '-'}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Coluna Últimos Jogos */}
                <TableCell align="center">
                  <LastGamesDisplay
                    homeTeam={{
                      id: match.teams.home.id,
                      name: match.teams.home.name,
                      form: homeTeamStanding?.form
                    }}
                    awayTeam={{
                      id: match.teams.away.id,
                      name: match.teams.away.name,
                      form: awayTeamStanding?.form
                    }}
                  />
                </TableCell>

                {/* Coluna Ações */}
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleRowToggle(match.fixture.id)}
                    sx={{ 
                      transform: expandedRows.has(match.fixture.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <KeyboardArrowDown />
                  </IconButton>
                </TableCell>
              </TableRow>

              {/* Linha expandida com detalhes */}
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse 
                    in={expandedRows.has(match.fixture.id)} 
                    timeout="auto" 
                    unmountOnExit
                  >
                    <Box sx={{ margin: 1 }}>
                      <LiveMatchCard
                        match={match}
                        events={matchEvents[match.fixture.id] || []}
                        onFetchEvents={onFetchEvents}
                      />
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LiveMatchTable;
