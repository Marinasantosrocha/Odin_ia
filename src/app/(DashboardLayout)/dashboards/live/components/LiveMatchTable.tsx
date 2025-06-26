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
import H2HTooltip from './H2HTooltip';

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
  const [standingsTimestamps, setStandingsTimestamps] = useState<{ [key: string]: number }>({}); // Cache de timestamps
  
  // Estados para odds
  const [oddsData, setOddsData] = useState<{ [key: number]: any }>({});
  const [loadingOdds, setLoadingOdds] = useState<Set<number>>(new Set());
  const [failedOdds, setFailedOdds] = useState<Set<number>>(new Set());
  const [oddsTimestamps, setOddsTimestamps] = useState<{ [key: number]: number }>({});

  // Constantes de cache
  const FRONTEND_CACHE_DURATION = 10 * 60 * 1000; // 10 minutos no frontend
  const FAILED_CACHE_DURATION = 30 * 60 * 1000; // 30 minutos para falhas no frontend

  // Função para buscar classificação de uma liga
  const fetchStandings = useCallback(async (leagueId: number, season: string = new Date().getFullYear().toString()) => {
    const cacheKey = `${leagueId}-${season}`;
    const now = Date.now();
    
    // Verificar se já está carregando
    if (loadingStandings.has(cacheKey)) {
      return;
    }

    // Verificar se já falhou recentemente
    if (failedStandings.has(cacheKey)) {
      return;
    }

    // Verificar se já temos dados válidos e não expiraram
    const lastFetch = standingsTimestamps[cacheKey];
    if (standingsData[cacheKey] && lastFetch && (now - lastFetch) < FRONTEND_CACHE_DURATION) {
      return; // Dados ainda válidos, não fazer nova requisição
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
        // Salvar timestamp do cache
        setStandingsTimestamps(prev => ({
          ...prev,
          [cacheKey]: now
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
  }, [loadingStandings, standingsData, failedStandings, standingsTimestamps]);

  // Função para buscar odds de uma partida
  const fetchOdds = useCallback(async (fixtureId: number) => {
    const now = Date.now();
    
    // Verificar se já está carregando
    if (loadingOdds.has(fixtureId)) {
      return;
    }

    // Verificar se já falhou recentemente
    if (failedOdds.has(fixtureId)) {
      return;
    }

    // Verificar cache válido
    const timestamp = oddsTimestamps[fixtureId];
    if (timestamp && (now - timestamp) < FRONTEND_CACHE_DURATION && oddsData[fixtureId]) {
      return;
    }

    setLoadingOdds(prev => new Set(prev).add(fixtureId));

    try {
      const response = await fetch(`/api/live/odds-api?fixture=${fixtureId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        setOddsData(prev => ({
          ...prev,
          [fixtureId]: data.data[0] // Pegar primeiro resultado
        }));
        setOddsTimestamps(prev => ({
          ...prev,
          [fixtureId]: now
        }));
      } else {
        // Adicionar ao cache de falhas se não há dados
        setFailedOdds(prev => new Set(prev).add(fixtureId));
        setTimeout(() => {
          setFailedOdds(prev => {
            const newSet = new Set(prev);
            newSet.delete(fixtureId);
            return newSet;
          });
        }, FAILED_CACHE_DURATION);
      }
    } catch (error) {
      console.error(`Erro ao buscar odds para fixture ${fixtureId}:`, error);
      // Adicionar ao cache de falhas
      setFailedOdds(prev => new Set(prev).add(fixtureId));
      setTimeout(() => {
        setFailedOdds(prev => {
          const newSet = new Set(prev);
          newSet.delete(fixtureId);
          return newSet;
        });
      }, FAILED_CACHE_DURATION);
    } finally {
      setLoadingOdds(prev => {
        const newSet = new Set(prev);
        newSet.delete(fixtureId);
        return newSet;
      });
    }
  }, [loadingOdds, oddsData, failedOdds, oddsTimestamps]);

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

  // Função para obter as melhores odds de uma partida
  const getBestOdds = useCallback((fixtureId: number) => {
    // Se já falhou anteriormente, não tentar novamente
    if (failedOdds.has(fixtureId)) {
      return null;
    }
    
    const matchOdds = oddsData[fixtureId];
    
    if (!matchOdds) {
      // Iniciar carregamento se ainda não foi feito
      fetchOdds(fixtureId);
      return null;
    }

    // Extrair melhores odds do mercado "Match Winner" (1X2)
    const bestOdds: { 
      home: number | null, 
      draw: number | null, 
      away: number | null,
      homeBookie: string | null,
      drawBookie: string | null,
      awayBookie: string | null,
      allBookies: string[]
    } = { 
      home: null, 
      draw: null, 
      away: null, 
      homeBookie: null, 
      drawBookie: null, 
      awayBookie: null,
      allBookies: []
    };
    
    if (matchOdds.bookmakers && matchOdds.bookmakers.length > 0) {
      // Coletar todas as casas de apostas
      const bookieNames = matchOdds.bookmakers.map((bookie: any) => bookie.bookmaker?.name).filter(Boolean);
      bestOdds.allBookies = Array.from(new Set(bookieNames)); // Remove duplicatas
      
      matchOdds.bookmakers.forEach((bookmaker: any) => {
        if (bookmaker.bets) {
          bookmaker.bets.forEach((bet: any) => {
            if (bet.name === 'Match Winner' && bet.values) {
              bet.values.forEach((value: any) => {
                const odd = parseFloat(value.odd);
                if (!isNaN(odd)) {
                  // Verificar diferentes formatos de valores
                  if ((value.value === 'Home' || value.value === '1') && (bestOdds.home === null || odd > bestOdds.home)) {
                    bestOdds.home = odd;
                    bestOdds.homeBookie = bookmaker.bookmaker?.name;
                  }
                  if ((value.value === 'Draw' || value.value === 'X') && (bestOdds.draw === null || odd > bestOdds.draw)) {
                    bestOdds.draw = odd;
                    bestOdds.drawBookie = bookmaker.bookmaker?.name;
                  }
                  if ((value.value === 'Away' || value.value === '2') && (bestOdds.away === null || odd > bestOdds.away)) {
                    bestOdds.away = odd;
                    bestOdds.awayBookie = bookmaker.bookmaker?.name;
                  }
                }
              });
            }
          });
        }
      });
    }

    return bestOdds;
  }, [failedOdds, oddsData, fetchOdds]);

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
    <TableContainer 
      component={Paper} 
      sx={{ 
        mt: 2
      }}
    >
      <Table sx={{ minWidth: 1200 }}>
        <TableHead sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'background.paper'
        }}>
          <TableRow sx={{ 
            '& .MuiTableCell-head': {
              backgroundColor: 'grey.50',
              borderBottom: '2px solid rgba(224, 224, 224, 1)'
            }
          }}>
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
            <TableCell width="60px" align="center">
              <Tooltip title="Vitória do time da casa">
                <Typography variant="subtitle2" fontWeight="bold">
                  1
                </Typography>
              </Tooltip>
            </TableCell>
            <TableCell width="60px" align="center">
              <Tooltip title="Empate">
                <Typography variant="subtitle2" fontWeight="bold">
                  X
                </Typography>
              </Tooltip>
            </TableCell>
            <TableCell width="60px" align="center">
              <Tooltip title="Vitória do time visitante">
                <Typography variant="subtitle2" fontWeight="bold">
                  2
                </Typography>
              </Tooltip>
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
                  <H2HTooltip
                    homeTeam={{
                      id: match.teams.home.id,
                      name: match.teams.home.name,
                      logo: match.teams.home.logo
                    }}
                    awayTeam={{
                      id: match.teams.away.id,
                      name: match.teams.away.name,
                      logo: match.teams.away.logo
                    }}
                  >
                    <Box sx={{ cursor: 'pointer' }}>
                      {/* Time da Casa */}
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Avatar 
                          src={match.teams.home.logo} 
                          sx={{ width: 20, height: 20 }}
                        />
                        <Typography variant="body2" fontWeight="medium">
                          {match.teams.home.name}
                          {homeTeamStanding?.position && (
                            <Typography component="span" variant="caption" sx={{ color: 'grey.500', ml: 0.5 }}>
                              ({homeTeamStanding.position}º)
                            </Typography>
                          )}
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
                          {awayTeamStanding?.position && (
                            <Typography component="span" variant="caption" sx={{ color: 'grey.500', ml: 0.5 }}>
                              ({awayTeamStanding.position}º)
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </H2HTooltip>
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

                {/* Colunas de Odds */}
                {(() => {
                  const bestOdds = getBestOdds(match.fixture.id);
                  return (
                    <>
                      {/* Coluna Odd Casa (1) */}
                      <TableCell align="center">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            sx={{ 
                              color: (bestOdds && typeof bestOdds.home === 'number') ? 'primary.main' : 'text.secondary',
                              fontSize: '0.875rem',
                              lineHeight: 1.2
                            }}
                          >
                            {(bestOdds && typeof bestOdds.home === 'number') ? bestOdds.home.toFixed(2) : '-'}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontSize: '0.65rem',
                              color: 'text.secondary',
                              display: 'block',
                              lineHeight: 1,
                              mt: 0.2
                            }}
                          >
                            {bestOdds?.homeBookie || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Coluna Odd Empate (X) */}
                      <TableCell align="center">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            sx={{ 
                              color: (bestOdds && typeof bestOdds.draw === 'number') ? 'warning.main' : 'text.secondary',
                              fontSize: '0.875rem',
                              lineHeight: 1.2
                            }}
                          >
                            {(bestOdds && typeof bestOdds.draw === 'number') ? bestOdds.draw.toFixed(2) : '-'}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontSize: '0.65rem',
                              color: 'text.secondary',
                              display: 'block',
                              lineHeight: 1,
                              mt: 0.2
                            }}
                          >
                            {bestOdds?.drawBookie || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Coluna Odd Visitante (2) */}
                      <TableCell align="center">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            sx={{ 
                              color: (bestOdds && typeof bestOdds.away === 'number') ? 'success.main' : 'text.secondary',
                              fontSize: '0.875rem',
                              lineHeight: 1.2
                            }}
                          >
                            {(bestOdds && typeof bestOdds.away === 'number') ? bestOdds.away.toFixed(2) : '-'}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontSize: '0.65rem',
                              color: 'text.secondary',
                              display: 'block',
                              lineHeight: 1,
                              mt: 0.2
                            }}
                          >
                            {bestOdds?.awayBookie || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                    </>
                  );
                })()}

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
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
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
