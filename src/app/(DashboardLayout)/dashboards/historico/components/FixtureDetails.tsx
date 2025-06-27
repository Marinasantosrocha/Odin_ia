"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Divider,
  Tabs,
  Tab,
  Paper,
  Tooltip,
  Button,
  Alert,
  useTheme,
  useMediaQuery,
  Chip,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface OddOption {
  option_value: string;
  odd_value: number;
}

interface Bet {
  bet_id: number;
  bet_name: string;
  options: OddOption[];
}

interface Bookmaker {
  bookmaker_id: number;
  bookmaker_name: string;
  bets: Bet[];
}

interface H2HFixture {
  fixture_id: number;
  date: string;
  home_team_id: number;
  away_team_id: number;
  home_team_name: string;
  away_team_name: string;
  home_team_logo: string;
  away_team_logo: string;
  goals_home: number;
  goals_away: number;
  status_short: string;
}

interface FixtureDetailsProps {
  fixture: {
    fixture_id: number;
    home_team_id: number;
    away_team_id: number;
    home_team_name: string;
    away_team_name: string;
    league_id: number;
    date: string;
  };
  open: boolean;
  selectedLeagueId: number;
}

interface FixtureEvent {
  player_name_main: string;
  detail: string;
  time_elapsed: number;
  team_id: number;
  type: string;
}

interface Statistic {
  team_id: number;
  type: string;
  value: string;
}

// Interface para os dados de escalação
interface LineupPlayer {
  team_id: number;
  player_id: number;
  player_name: string;
  number: number;
  position: string;
  grid: string | null;
  is_starter: boolean;
  games_rating?: number | null; // Rating do jogador na partida
}

interface TeamStatistic {
  team_id: number;
  team_name: string;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  gols_marcados: number;
  gols_sofridos: number;
  saldo_gols: number;
  pontos: number;
  clean_sheets: number;
  failed_to_score: number;
  fixtures_played_home: number;
  fixtures_played_away: number;
  fixtures_wins_home: number;
  fixtures_wins_away: number;
  fixtures_draws_home: number;
  fixtures_draws_away: number;
  fixtures_loses_home: number;
  fixtures_loses_away: number;
  goals_for_total_home: number;
  goals_for_total_away: number;
  goals_against_total_home: number;
  goals_against_total_away: number;
  goals_for_avg_home: number;
  goals_for_avg_away: number;
  goals_against_avg_home: number;
  goals_against_avg_away: number;
  penalty_scored_total: number;
  penalty_scored_percentage: string;
  penalty_missed_total: number;
  penalty_missed_percentage: string;
  penalty_total: number;
  most_used_formation: string;
  biggest_win_home: string;
  biggest_win_away: string;
  biggest_lose_home: string;
  biggest_lose_away: string;
  biggest_goals_for_home: number;
  biggest_goals_for_away: number;
  biggest_goals_against_home: number;
  biggest_goals_against_away: number;
  media_gols_marcados: number;
  media_gols_sofridos: number;
  forma: string;
  data_estatistica: string;
  dias_diferenca: number;
}

interface TeamLineup {
  team_id: number;
  formation: string;
  coach_name: string;
  coach_photo: string | null;
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
}

interface Substitution {
  team_id: number;
  player_in_id: number;
  player_in_name: string;
  player_out_name: string;
  time_elapsed: number;
  minute: number;
}

export default function FixtureDetails({ fixture, open, selectedLeagueId }: FixtureDetailsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<FixtureEvent[]>([]);
  const [tabValue, setTabValue] = useState<number>(0);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [h2hFixtures, setH2hFixtures] = useState<H2HFixture[]>([]);
  const [loadingH2h, setLoadingH2h] = useState<boolean>(false);
  const [h2hError, setH2hError] = useState<string | null>(null);
  const [lineups, setLineups] = useState<TeamLineup[]>([]);
  const [loadingLineups, setLoadingLineups] = useState<boolean>(false);
  const [lineupsError, setLineupsError] = useState<string | null>(null);
  const [teamStats, setTeamStats] = useState<TeamStatistic[]>([]);
  const [loadingTeamStats, setLoadingTeamStats] = useState<boolean>(false);
  const [teamStatsError, setTeamStatsError] = useState<string | null>(null);
  const [statsViewMode, setStatsViewMode] = useState<'home' | 'away' | 'all'>('all');
  const [odds, setOdds] = useState<Bookmaker[]>([]);
  const [loadingOdds, setLoadingOdds] = useState<boolean>(false);
  const [oddsError, setOddsError] = useState<string | null>(null);
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);
  const [loadingSubstitutions, setLoadingSubstitutions] = useState<boolean>(false);
  const [substitutionsError, setSubstitutionsError] = useState<string | null>(null);
  const [playerRatings, setPlayerRatings] = useState<{[key: number]: number}>({});
  const [loadingPlayerRatings, setLoadingPlayerRatings] = useState<boolean>(false);
  
  // Ordenar os jogos por data (do mais recente para o mais antigo)
  const sortedH2hFixtures = [...h2hFixtures].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Função para calcular os resultados (vitórias, empates, derrotas) para cada time
  const calculateResults = (teamId: number, fixtures: H2HFixture[]) => {
    return fixtures.map(match => {
      const isHome = match.home_team_id === teamId;
      const isAway = match.away_team_id === teamId;
      
      if (!isHome && !isAway) return null;
      
      if (match.goals_home > match.goals_away) {
        return isHome ? 'win' : 'loss';
      } else if (match.goals_home < match.goals_away) {
        return isAway ? 'win' : 'loss';
      } else {
        return 'draw';
      }
    }).filter(Boolean) as ('win' | 'draw' | 'loss')[];
  };
  
  // Estilos para os quadrados de resultados
  const resultSquareStyle = {
    width: '16px',
    height: '16px',
    display: 'inline-block',
    margin: '0 2px',
    borderRadius: '2px',
  };
  
  const resultStyles = {
    win: {
      ...resultSquareStyle,
      backgroundColor: '#4caf50', // Verde para vitória
    },
    draw: {
      ...resultSquareStyle,
      backgroundColor: '#9e9e9e', // Cinza para empate
    },
    loss: {
      ...resultSquareStyle,
      backgroundColor: '#f44336', // Vermelho para derrota
    },
  };
  
  const fetchH2HData = async () => {
    if (!fixture) return;
    
    setLoadingH2h(true);
    setH2hError(null);
    
    try {
      const params = new URLSearchParams({
        leagueId: selectedLeagueId.toString(),
        team1Id: fixture.home_team_id.toString(),
        team2Id: fixture.away_team_id.toString(),
        fixtureDate: fixture.date
      });
      
      console.log('Buscando dados H2H com parâmetros:', {
        leagueId: selectedLeagueId,
        team1Id: fixture.home_team_id,
        team2Id: fixture.away_team_id,
        fixtureDate: fixture.date
      });
      
      const response = await fetch(`/api/h2h?${params.toString()}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API H2H:', errorText);
        throw new Error(`Erro ao buscar dados H2H: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Dados H2H recebidos:', data);
      
      if (!Array.isArray(data.data)) {
        console.error('Formato de dados H2H inválido:', data);
        throw new Error('Formato de dados H2H inválido');
      }
      
      setH2hFixtures(data.data);
      console.log('Dados H2H definidos no estado:', data.data);
      
      // Buscar estatísticas dos times quando os dados H2H são carregados
      fetchTeamStats();
    } catch (error) {
      console.error('Erro ao buscar dados H2H:', error);
      setH2hError('Não foi possível carregar os confrontos anteriores.');
    } finally {
      setLoadingH2h(false);
    }
  };
  
  const fetchTeamStats = async () => {
    if (!fixture || !selectedLeagueId) return;
    
    setLoadingTeamStats(true);
    setTeamStatsError(null);
    
    try {
      // Buscar estatísticas dos times
      const response = await fetch(`/api/team-statistics?leagueId=${selectedLeagueId}&teamIds=${fixture.home_team_id},${fixture.away_team_id}&date=${fixture.date}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar estatísticas dos times: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Formato de dados inválido');
      }
      
      setTeamStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos times:', error);
      setTeamStatsError('Não foi possível carregar as estatísticas dos times.');
    } finally {
      setLoadingTeamStats(false);
    }
  };

  const fetchSubstitutions = async () => {
    if (!fixture) return;
    
    setLoadingSubstitutions(true);
    setSubstitutionsError(null);
    
    try {
      const response = await fetch(`/api/fixtures/${fixture.fixture_id}/substitutions`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API de substituições:', errorText);
        throw new Error(`Erro ao buscar substituições: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data.data)) {
        console.error('Formato de dados de substituições inválido:', data);
        throw new Error('Formato de dados de substituições inválido');
      }
      
      setSubstitutions(data.data);
    } catch (error) {
      console.error('Erro ao buscar substituições:', error);
      setSubstitutionsError('Não foi possível carregar as substituições da partida.');
    } finally {
      setLoadingSubstitutions(false);
    }
  };

  const fetchOdds = async () => {
    if (!fixture) return;
    
    setLoadingOdds(true);
    setOddsError(null);
    
    try {
      console.log('Buscando odds para a partida:', fixture.fixture_id);
      
      const response = await fetch(`/api/fixtures/${fixture.fixture_id}/odds`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API de odds:', errorText);
        throw new Error(`Erro ao buscar odds: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Dados de odds recebidos:', data);
      
      if (!data.bookmakers) {
        console.error('Formato de dados de odds inválido:', data);
        throw new Error('Formato de dados de odds inválido');
      }
      
      setOdds(data.bookmakers);
    } catch (error) {
      console.error('Erro ao buscar odds:', error);
      setOddsError('Não foi possível carregar as odds da partida.');
    } finally {
      setLoadingOdds(false);
    }
  };

  // Função para posicionar jogadores no campo de acordo com a formação
  const getPlayerPositions = (formation: string, players: LineupPlayer[]) => {
    // Ordenar jogadores por posição para facilitar o posicionamento
    const sortedPlayers = [...players].sort((a, b) => {
      const positionOrder: Record<string, number> = {
        'G': 0,      // Goleiro
        'D': 1,      // Defesa
        'M': 2,      // Meio-campo
        'F': 3       // Atacante
      };
      
      const posA = a.position.charAt(0);
      const posB = b.position.charAt(0);
      
      return (positionOrder[posA] || 5) - (positionOrder[posB] || 5);
    });
    
    // Extrair números da formação (ex: 4-4-2 => [4, 4, 2])
    const formationNumbers = formation.split('-').map(n => parseInt(n, 10));
    
    // Posições padrão para diferentes formações
    const positions: {x: number, y: number}[] = [];
    
    // Goleiro sempre na mesma posição
    positions.push({ x: 50, y: 90 });
    
    // Posicionar defensores
    const defenseCount = formationNumbers[0] || 4;
    const defenseY = 75;
    for (let i = 0; i < defenseCount; i++) {
      const x = 10 + (80 / (defenseCount + 1)) * (i + 1);
      positions.push({ x, y: defenseY });
    }
    
    // Posicionar meio-campistas
    const midfieldCount = formationNumbers[1] || 4;
    const midfieldY = 55;
    for (let i = 0; i < midfieldCount; i++) {
      const x = 10 + (80 / (midfieldCount + 1)) * (i + 1);
      positions.push({ x, y: midfieldY });
    }
    
    // Posicionar atacantes
    const attackCount = formationNumbers[2] || 2;
    const attackY = 30;
    for (let i = 0; i < attackCount; i++) {
      const x = 10 + (80 / (attackCount + 1)) * (i + 1);
      positions.push({ x, y: attackY });
    }
    
    // Associar jogadores às posições
    const result = [];
    let currentIndex = 0;
    
    for (let i = 0; i < Math.min(sortedPlayers.length, positions.length); i++) {
      result.push({
        player: sortedPlayers[i],
        position: positions[i]
      });
    }
    
    return result;
  };

  const fetchLineups = async () => {
    if (!fixture) return;
    
    setLoadingLineups(true);
    setLineupsError(null);
    
    try {
      console.log('Buscando escalações para a partida:', fixture.fixture_id);
      
      const response = await fetch(`/api/fixtures/${fixture.fixture_id}/lineups`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API de escalações:', errorText);
        throw new Error(`Erro ao buscar escalações: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Dados de escalações recebidos:', data);
      
      if (!Array.isArray(data.data)) {
        console.error('Formato de dados de escalações inválido:', data);
        throw new Error('Formato de dados de escalações inválido');
      }
      
      setLineups(data.data);
      console.log('Dados de escalações definidos no estado:', data.data);
      
      // Buscar ratings dos jogadores após carregar as escalações
      await fetchPlayerRatings();
    } catch (error) {
      console.error('Erro ao buscar escalações:', error);
      setLineupsError('Não foi possível carregar as escalações das equipes.');
    } finally {
      setLoadingLineups(false);
    }
  };

  const fetchPlayerRatings = async () => {
    if (!fixture) return;
    
    setLoadingPlayerRatings(true);
    
    try {
      console.log('Buscando ratings dos jogadores para a partida:', fixture.fixture_id);
      
      const response = await fetch(`/api/fixtures/${fixture.fixture_id}/player-ratings`);
      
      if (!response.ok) {
        console.warn('Ratings dos jogadores não disponíveis:', response.status);
        return;
      }
      
      const data = await response.json();
      console.log('Dados de ratings dos jogadores recebidos:', data);
      
      if (data.success && Array.isArray(data.data)) {
        const ratingsMap: {[key: number]: number} = {};
        data.data.forEach((player: {player_id: number, games_rating: number | null}) => {
          if (player.games_rating !== null) {
            ratingsMap[player.player_id] = player.games_rating;
          }
        });
        setPlayerRatings(ratingsMap);
        console.log('Ratings dos jogadores definidos no estado:', ratingsMap);
      }
    } catch (error) {
      console.warn('Erro ao buscar ratings dos jogadores:', error);
    } finally {
      setLoadingPlayerRatings(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    event.stopPropagation();
    setTabValue(newValue);
    
    // Carregar estatísticas quando a tab de estatísticas for selecionada
    if (newValue === 0 && statistics.length === 0 && fixture) {
      fetchStatistics();
    }
    // Carregar dados H2H quando a tab H2H for selecionada
    else if (newValue === 1 && h2hFixtures.length === 0 && fixture) {
      fetchH2HData();
    }
    // Carregar escalações quando a tab de Escalação for selecionada
    else if (newValue === 2 && lineups.length === 0 && fixture) {
      fetchLineups();
    }
    // Carregar substituições quando a tab de Substituições for selecionada
    else if (newValue === 3 && substitutions.length === 0 && fixture) {
      fetchSubstitutions();
    }
    // Carregar odds quando a tab de ODDS for selecionada
    else if (newValue === 4 && odds.length === 0 && fixture) {
      fetchOdds();
    }
  };
  
  const fetchStatistics = async () => {
    if (!fixture) return;
    
    setLoadingStats(true);
    
    try {
      const response = await fetch(`/api/fixtures/${fixture.fixture_id}/statistics`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar estatísticas: ${response.status}`);
      }
      
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setStatistics(data.data);
      } else if (data.data) {
        setStatistics([]);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!open || !fixture) return;
      
      // Carregar detalhes dos cartões e gols
      setLoading(true);
      setEvents([]);
      
      try {
        const response = await fetch(`/api/fixtures/${fixture.fixture_id}/details`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar eventos: ${response.status}`);
        }
        
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setEvents(data.data);
        } else if (Array.isArray(data)) {
          setEvents(data);
        }
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      } finally {
        setLoading(false);
      }
      
      // Carregar estatísticas automaticamente
      fetchStatistics();
    };
    
    fetchData();
  }, [fixture, open]);

  // Componente de cartão estilizado
  const CardIndicator = ({ type, playerName, time }: { type: 'Red Card' | 'Yellow Card', playerName: string, time: number }) => {
    const isRed = type === 'Red Card';
    
    return (
      <Tooltip title={`${playerName} - ${time}'`} arrow>
        <Box
          sx={{
            position: 'relative',
            width: 12,
            height: 18,
            bgcolor: isRed ? '#ff5252' : '#ffeb3b',
            borderRadius: '2px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            '&:after': {
              content: '""',
              position: 'absolute',
              top: 1,
              left: 1,
              right: 1,
              bottom: 1,
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '1px',
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
              borderTopLeftRadius: '1px',
              borderTopRightRadius: '1px',
            }
          }}
        />
      </Tooltip>
    );
  };

  // Componente de gol estilizado
  const GoalIndicator = ({ detail, playerName, time }: { detail: string, playerName: string, time: number }) => {
    const isMissedPenalty = detail.includes('Missed Penalty');
    const isPenaltyCancelled = detail.includes('penalty cancelled') || detail.includes('Penalty Cancelled');
    const isGoalCancelled = detail.includes('Goal Cancelled') || detail.includes('goal cancelled');
    const isFailedPenalty = isMissedPenalty || isPenaltyCancelled || isGoalCancelled;
    
    // Escolher o ícone apropriado com base no tipo de evento
    let icon = '⚽'; // Bola de futebol padrão
    let iconColor = 'inherit';
    
    if (isFailedPenalty) {
      icon = '❌'; // Símbolo de X vermelho
      iconColor = 'inherit'; // Manter a cor original do emoji
    }
    
    return (
      <Tooltip title={`${playerName} - ${time}' ${detail}`} arrow>
        <Box
          sx={{
            fontSize: '16px',
            color: iconColor,
            lineHeight: 1,
          }}
        >
          {icon}
        </Box>
      </Tooltip>
    );
  };

  if (!open) return null;
  
  return (
    <Box sx={{ mt: 2, p: 2 }}>
      {loading && (
        <Typography variant="body2" align="center">
          Carregando detalhes...
        </Typography>
      )}
      
      {!loading && events.length === 0 && (
        <Typography variant="body2" color="text.secondary" align="center">
          Nenhum evento registrado nesta partida.
        </Typography>
      )}

      {!loading && events.length > 0 && (
        <>
          {/* Seção de Gols */}
          <Box sx={{ mb: 3 }}>
            {events.filter(event => event.type === 'Goal').length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                Nenhum gol registrado nesta partida.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Gols do Time da Casa */}
                <Box sx={{ flex: 1, pr: 1 }}>
                  <Stack spacing={1}>
                    {events
                      .filter(event => event.team_id === fixture.home_team_id && event.type === 'Goal')
                      .map((event, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 1 }}>
                          <GoalIndicator 
                            detail={event.detail}
                            playerName={event.player_name_main}
                            time={event.time_elapsed}
                          />
                          <Typography variant="body2" noWrap sx={{ maxWidth: 'calc(100% - 32px)' }}>
                            {event.player_name_main} 
                            <Box component="span" sx={{ color: 'text.secondary', ml: 0.5 }}>
                              {event.time_elapsed}' ({event.detail})
                            </Box>
                          </Typography>
                        </Box>
                      ))}
                  </Stack>
                </Box>

                {/* Divisor */}
                <Divider orientation="vertical" flexItem />

                {/* Gols do Time Visitante */}
                <Box sx={{ flex: 1, pl: 1 }}>
                  <Stack spacing={1}>
                    {events
                      .filter(event => event.team_id === fixture.away_team_id && event.type === 'Goal')
                      .map((event, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 1, justifyContent: 'flex-end' }}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 'calc(100% - 32px)', textAlign: 'right' }}>
                            {event.player_name_main} 
                            <Box component="span" sx={{ color: 'text.secondary', ml: 0.5 }}>
                              {event.time_elapsed}' ({event.detail})
                            </Box>
                          </Typography>
                          <GoalIndicator 
                            detail={event.detail}
                            playerName={event.player_name_main}
                            time={event.time_elapsed}
                          />
                        </Box>
                      ))}
                  </Stack>
                </Box>
              </Box>
            )}
          </Box>

          {/* Divisor entre gols e cartões */}
          <Divider sx={{ my: 2, borderColor: '#e0e0e0', opacity: 0.7 }} />

          {/* Seção de Cartões */}
          <Box sx={{ mt: 1 }}>
            {events.filter(event => event.type === 'Card').length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                Nenhum cartão registrado nesta partida.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Cartões do Time da Casa */}
                <Box sx={{ flex: 1, pr: 1 }}>
                  <Stack spacing={1}>
                    {events
                      .filter(event => event.team_id === fixture.home_team_id && event.type === 'Card')
                      .map((event, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 1 }}>
                          <CardIndicator 
                            type={event.detail as 'Red Card' | 'Yellow Card'} 
                            playerName={event.player_name_main}
                            time={event.time_elapsed}
                          />
                          <Typography variant="body2" noWrap sx={{ maxWidth: 'calc(100% - 32px)' }}>
                            {event.player_name_main} 
                            <Box component="span" sx={{ color: 'text.secondary', ml: 0.5 }}>
                              {event.time_elapsed}'
                            </Box>
                          </Typography>
                        </Box>
                      ))}
                  </Stack>
                </Box>

                {/* Divisor */}
                <Divider orientation="vertical" flexItem />

                {/* Cartões do Time Visitante */}
                <Box sx={{ flex: 1, pl: 1 }}>
                  <Stack spacing={1}>
                    {events
                      .filter(event => event.team_id === fixture.away_team_id && event.type === 'Card')
                      .map((event, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 1, justifyContent: 'flex-end' }}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 'calc(100% - 32px)', textAlign: 'right' }}>
                            {event.player_name_main} 
                            <Box component="span" sx={{ color: 'text.secondary', ml: 0.5 }}>
                              {event.time_elapsed}'
                            </Box>
                          </Typography>
                          <CardIndicator 
                            type={event.detail as 'Red Card' | 'Yellow Card'} 
                            playerName={event.player_name_main}
                            time={event.time_elapsed}
                          />
                        </Box>
                      ))}
                  </Stack>
                </Box>
              </Box>
            )}
          </Box>
        </>
      )}
      
      {/* Navbar com botões */}
      <Paper elevation={0} sx={{ mt: 3, borderRadius: '8px 8px 0 0', bgcolor: 'white', mb: 0 }} onClick={(e) => e.stopPropagation()}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="fixture details tabs"
        >
          <Tab label="Estatísticas" />
          <Tab label="H2H" />
          <Tab label="Escalação" />
          <Tab label="Substituições" />
          <Tab label="ODDS" />
        </Tabs>
      </Paper>
      
      {/* Conteúdo das tabs */}
      <Box sx={{ mt: 0, p: 0, minHeight: '100px', bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
        <Box sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px', pt: 2 }}>
          {/* Tab de Estatísticas */}
          {tabValue === 0 && (
            <>
              {loadingStats ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 2 }}>Carregando estatísticas...</Typography>
                </Box>
              ) : statistics.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center">
                  Nenhuma estatística disponível para esta partida
                </Typography>
              ) : (
                <Box sx={{ width: '100%', px: 2 }}>
                
                {/* Agrupar estatísticas por tipo */}
                {(() => {
                  // Organizar estatísticas por tipo
                  const statsByType: Record<string, {home: string, away: string}> = {};
                  const homeTeamId = fixture.home_team_id;
                  const awayTeamId = fixture.away_team_id;
                  
                  statistics.forEach(stat => {
                    if (!statsByType[stat.type]) {
                      statsByType[stat.type] = {home: '-', away: '-'};
                    }
                    
                    if (stat.team_id === homeTeamId) {
                      statsByType[stat.type].home = stat.value;
                    } else if (stat.team_id === awayTeamId) {
                      statsByType[stat.type].away = stat.value;
                    }
                  });
                  
                  return (
                    <Stack spacing={2.5}>
                      {Object.entries(statsByType).map(([type, values]) => (
                        <Box key={type}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {values.home}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: 'text.secondary',
                              textTransform: 'uppercase',
                              fontWeight: 'medium',
                              letterSpacing: '0.5px'
                            }}>
                              {type}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {values.away}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ 
                            height: 4, 
                            width: '80%', maxWidth: '220px', mx: 'auto', 
                            bgcolor: '#f0f0f0',
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative'
                          }}>
                            {(() => {
                              // Tentar converter valores para números
                              let homeValue = parseFloat(values.home);
                              let awayValue = parseFloat(values.away);
                              
                              // Se ambos são números válidos
                              if (!isNaN(homeValue) && !isNaN(awayValue) && (homeValue + awayValue) > 0) {
                                const total = homeValue + awayValue;
                                const homePercentage = Math.round((homeValue / total) * 100);
                                
                                return (
                                  <Box 
                                    sx={{ 
                                      position: 'absolute',
                                      left: 0,
                                      top: 0,
                                      height: '100%',
                                      width: `${homePercentage}%`,
                                      bgcolor: 'rgba(0, 0, 0, 0.15)',
                                      borderRadius: 2,
                                      transition: 'width 0.5s ease-in-out'
                                    }} 
                                  />
                                );
                              }
                              return null;
                            })()}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  );
                })()} 
              </Box>
            )}
          </>
          )}
          
            {/* Tab de H2H */}
          {tabValue === 1 && (
            <Box onClick={(e) => e.stopPropagation()} sx={{ p: 2, width: '100%' }}>
            {loadingH2h ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress size={24} />
              </Box>
            ) : h2hError ? (
              <Typography color="error" align="center">{h2hError}</Typography>
            ) : h2hFixtures.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                Nenhum confronto anterior encontrado.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {/* Linha única com resultados dos dois times */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 1, 
                  bgcolor: 'background.paper', 
                  borderRadius: 1,
                  mb: 2
                }}>
                  {/* Time da Casa - Lado Esquerdo */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    flex: 1,
                    justifyContent: 'flex-start',
                    pr: 1
                  }}>
                    {calculateResults(fixture.home_team_id, h2hFixtures).map((result, index) => (
                      <Box 
                        key={index} 
                        sx={resultStyles[result]}
                        title={result === 'win' ? 'Vitória' : result === 'draw' ? 'Empate' : 'Derrota'}
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                    Últimos {h2hFixtures.length} jogos
                  </Typography>
                  
                  {/* Time Visitante - Lado Direito */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    flex: 1,
                    justifyContent: 'flex-end',
                    pl: 1
                  }}>
                    {calculateResults(fixture.away_team_id, h2hFixtures).map((result, index) => (
                      <Box 
                        key={index} 
                        sx={resultStyles[result]}
                        title={result === 'win' ? 'Vitória' : result === 'draw' ? 'Empate' : 'Derrota'}
                      />
                    ))}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                {/* Tabela de Jogos */}
                <Box sx={{ width: '100%', overflow: 'auto', pl: 0, display: 'flex', justifyContent: 'flex-start' }}>
                  <table style={{ width: '95%', borderCollapse: 'collapse', marginLeft: '0', marginRight: 'auto' }}>
                    <tbody>
                      {h2hFixtures.map((match) => (
                        <tr key={match.fixture_id}>
                          <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(match.date).toLocaleDateString('pt-BR')}
                            </Typography>
                          </td>
                          <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <Typography variant="body2" sx={{ 
                              fontWeight: match.home_team_id === fixture.home_team_id || match.home_team_id === fixture.away_team_id ? 'bold' : 'normal' 
                            }}>
                              {match.home_team_name}
                            </Typography>
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <Typography variant="body2" fontWeight="bold">
                              {match.goals_home} x {match.goals_away}
                            </Typography>
                          </td>
                          <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <Typography variant="body2" sx={{ 
                              fontWeight: match.away_team_id === fixture.home_team_id || match.away_team_id === fixture.away_team_id ? 'bold' : 'normal' 
                            }}>
                              {match.away_team_name}
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
                
                {/* Estatísticas dos Times */}
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Estatísticas dos Times
                </Typography>
                
                {loadingTeamStats ? (
                  <Box display="flex" justifyContent="center" p={2}>
                    <CircularProgress size={24} />
                    <Typography sx={{ ml: 2 }}>Carregando estatísticas...</Typography>
                  </Box>
                ) : teamStatsError ? (
                  <Typography color="error" align="center">{teamStatsError}</Typography>
                ) : teamStats.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center">
                    Nenhuma estatística disponível para estes times.
                  </Typography>
                ) : (
                  <Box sx={{ width: '100%', overflow: 'auto' }}>
                    {/* Tabela principal de estatísticas */}
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <Typography variant="caption" color="text.secondary">Time</Typography>
                          </th>
                          <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <Tooltip title="Jogos">
                              <Typography variant="caption" color="text.secondary">J</Typography>
                            </Tooltip>
                          </th>
                          <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <Tooltip title="Vitórias">
                              <Typography variant="caption" color="text.secondary">V</Typography>
                            </Tooltip>
                          </th>
                          <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <Tooltip title="Empates">
                              <Typography variant="caption" color="text.secondary">E</Typography>
                            </Tooltip>
                          </th>
                          <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <Tooltip title="Derrotas">
                              <Typography variant="caption" color="text.secondary">D</Typography>
                            </Tooltip>
                          </th>
                          <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <Tooltip title="Gols Marcados">
                              <Typography variant="caption" color="text.secondary">GM</Typography>
                            </Tooltip>
                          </th>
                          <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <Tooltip title="Gols Sofridos">
                              <Typography variant="caption" color="text.secondary">GS</Typography>
                            </Tooltip>
                          </th>
                          <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <Tooltip title="Saldo de Gols">
                              <Typography variant="caption" color="text.secondary">SG</Typography>
                            </Tooltip>
                          </th>
                          <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <Tooltip title="Pontos">
                              <Typography variant="caption" color="text.secondary">Pts</Typography>
                            </Tooltip>
                          </th>
                          <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <Tooltip title="Sequência de resultados recentes">
                              <Typography variant="caption" color="text.secondary">Forma</Typography>
                            </Tooltip>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamStats.map((stat) => (
                          <tr key={stat.team_id}>
                            <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <Typography variant="body2" fontWeight="medium">
                                {stat.team_name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(stat.data_estatistica).toLocaleDateString('pt-BR')}
                              </Typography>
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <Typography variant="body2">{stat.jogos}</Typography>
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <Typography variant="body2">{stat.vitorias}</Typography>
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <Typography variant="body2">{stat.empates}</Typography>
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <Typography variant="body2">{stat.derrotas}</Typography>
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <Typography variant="body2">{stat.gols_marcados}</Typography>
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <Typography variant="body2">{stat.gols_sofridos}</Typography>
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <Typography variant="body2">{stat.saldo_gols}</Typography>
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <Typography variant="body2" fontWeight="bold">{stat.pontos}</Typography>
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <Typography variant="body2">{stat.forma}</Typography>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Abas para selecionar modo de visualização (HOME/AWAY/ALL) */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                      <Box 
                        onClick={() => setStatsViewMode('home')} 
                        sx={{ 
                          px: 3, py: 1, cursor: 'pointer',
                          borderBottom: statsViewMode === 'home' ? '2px solid #1976d2' : 'none',
                          fontWeight: statsViewMode === 'home' ? 'bold' : 'normal',
                          color: statsViewMode === 'home' ? '#1976d2' : 'inherit'
                        }}
                      >
                        <Typography variant="body2">HOME</Typography>
                      </Box>
                      <Box 
                        onClick={() => setStatsViewMode('away')} 
                        sx={{ 
                          px: 3, py: 1, cursor: 'pointer',
                          borderBottom: statsViewMode === 'away' ? '2px solid #1976d2' : 'none',
                          fontWeight: statsViewMode === 'away' ? 'bold' : 'normal',
                          color: statsViewMode === 'away' ? '#1976d2' : 'inherit'
                        }}
                      >
                        <Typography variant="body2">AWAY</Typography>
                      </Box>
                      <Box 
                        onClick={() => setStatsViewMode('all')} 
                        sx={{ 
                          px: 3, py: 1, cursor: 'pointer',
                          borderBottom: statsViewMode === 'all' ? '2px solid #1976d2' : 'none',
                          fontWeight: statsViewMode === 'all' ? 'bold' : 'normal',
                          color: statsViewMode === 'all' ? '#1976d2' : 'inherit'
                        }}
                      >
                        <Typography variant="body2">ALL</Typography>
                      </Box>
                    </Box>
                    
                    {/* Tabela de comparação de estatísticas no estilo da imagem */}
                    {teamStats.length === 2 && (
                      <Box sx={{ width: '100%', overflow: 'auto', mt: 2 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#f9f9f9' }}>
                          <thead>
                            <tr>
                              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.1)' }}></th>
                              <th colSpan={3} style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Typography variant="subtitle2" fontWeight="bold">{teamStats[0].team_name}</Typography>
                                </Box>
                              </th>
                              <th colSpan={3} style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Typography variant="subtitle2" fontWeight="bold">{teamStats[1].team_name}</Typography>
                                </Box>
                              </th>
                            </tr>
                            <tr>
                              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.1)' }}></th>
                              <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#f0f0f0' }}>
                                <Typography variant="caption" color="text.secondary">HOME</Typography>
                              </th>
                              <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#f0f0f0' }}>
                                <Typography variant="caption" color="text.secondary">AWAY</Typography>
                              </th>
                              <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#f0f0f0' }}>
                                <Typography variant="caption" color="text.secondary">ALL</Typography>
                              </th>
                              <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#f0f0f0' }}>
                                <Typography variant="caption" color="text.secondary">HOME</Typography>
                              </th>
                              <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#f0f0f0' }}>
                                <Typography variant="caption" color="text.secondary">AWAY</Typography>
                              </th>
                              <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#f0f0f0' }}>
                                <Typography variant="caption" color="text.secondary">ALL</Typography>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Jogos */}
                            <tr>
                              <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 'bold' }}>
                                <Typography variant="body2">Games played</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2">{teamStats[0].fixtures_played_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2">{teamStats[0].fixtures_played_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>{teamStats[0].jogos}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2">{teamStats[1].fixtures_played_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2">{teamStats[1].fixtures_played_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>{teamStats[1].jogos}</Typography>
                              </td>
                            </tr>
                            
                            {/* Vitórias */}
                            <tr>
                              <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 'bold' }}>
                                <Typography variant="body2">Wins</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50' }}>{teamStats[0].fixtures_wins_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50' }}>{teamStats[0].fixtures_wins_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>{teamStats[0].vitorias}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336' }}>{teamStats[1].fixtures_wins_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336' }}>{teamStats[1].fixtures_wins_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336', fontWeight: 'bold' }}>{teamStats[1].vitorias}</Typography>
                              </td>
                            </tr>
                            
                            {/* Empates */}
                            <tr>
                              <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 'bold' }}>
                                <Typography variant="body2">Draws</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#9e9e9e' }}>{teamStats[0].fixtures_draws_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#9e9e9e' }}>{teamStats[0].fixtures_draws_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#9e9e9e', fontWeight: 'bold' }}>{teamStats[0].empates}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#9e9e9e' }}>{teamStats[1].fixtures_draws_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#9e9e9e' }}>{teamStats[1].fixtures_draws_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#9e9e9e', fontWeight: 'bold' }}>{teamStats[1].empates}</Typography>
                              </td>
                            </tr>
                            
                            {/* Derrotas */}
                            <tr>
                              <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 'bold' }}>
                                <Typography variant="body2">Loss</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336' }}>{teamStats[0].fixtures_loses_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336' }}>{teamStats[0].fixtures_loses_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336', fontWeight: 'bold' }}>{teamStats[0].derrotas}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50' }}>{teamStats[1].fixtures_loses_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50' }}>{teamStats[1].fixtures_loses_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>{teamStats[1].derrotas}</Typography>
                              </td>
                            </tr>
                            
                            {/* Cabeçalho GOALS */}
                            <tr>
                              <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#f5f5f5' }}>
                                <Typography variant="body2" fontWeight="bold">GOALS</Typography>
                              </td>
                              <td colSpan={6} style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#f5f5f5' }}></td>
                            </tr>
                            
                            {/* Gols marcados */}
                            <tr>
                              <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 'bold' }}>
                                <Typography variant="body2">Goals For</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50' }}>{teamStats[0].goals_for_total_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50' }}>{teamStats[0].goals_for_total_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>{teamStats[0].gols_marcados}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336' }}>{teamStats[1].goals_for_total_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336' }}>{teamStats[1].goals_for_total_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336', fontWeight: 'bold' }}>{teamStats[1].gols_marcados}</Typography>
                              </td>
                            </tr>
                            
                            {/* Gols sofridos */}
                            <tr>
                              <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 'bold' }}>
                                <Typography variant="body2">Goals Against</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336' }}>{teamStats[0].goals_against_total_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336' }}>{teamStats[0].goals_against_total_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336', fontWeight: 'bold' }}>{teamStats[0].gols_sofridos}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50' }}>{teamStats[1].goals_against_total_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50' }}>{teamStats[1].goals_against_total_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>{teamStats[1].gols_sofridos}</Typography>
                              </td>
                            </tr>
                            
                            {/* Cabeçalho GOALS AVERAGE */}
                            <tr>
                              <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#f5f5f5' }}>
                                <Typography variant="body2" fontWeight="bold">GOALS AVERAGE</Typography>
                              </td>
                              <td colSpan={6} style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#f5f5f5' }}></td>
                            </tr>
                            
                            {/* Média gols marcados */}
                            <tr>
                              <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 'bold' }}>
                                <Typography variant="body2">Goals For</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50' }}>{typeof teamStats[0].goals_for_avg_home === 'number' ? teamStats[0].goals_for_avg_home.toFixed(1) : teamStats[0].goals_for_avg_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50' }}>{typeof teamStats[0].goals_for_avg_away === 'number' ? teamStats[0].goals_for_avg_away.toFixed(1) : teamStats[0].goals_for_avg_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>{typeof teamStats[0].media_gols_marcados === 'number' ? teamStats[0].media_gols_marcados.toFixed(1) : teamStats[0].media_gols_marcados}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336' }}>{typeof teamStats[1].goals_for_avg_home === 'number' ? teamStats[1].goals_for_avg_home.toFixed(1) : teamStats[1].goals_for_avg_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336' }}>{typeof teamStats[1].goals_for_avg_away === 'number' ? teamStats[1].goals_for_avg_away.toFixed(1) : teamStats[1].goals_for_avg_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336', fontWeight: 'bold' }}>{typeof teamStats[1].media_gols_marcados === 'number' ? teamStats[1].media_gols_marcados.toFixed(1) : teamStats[1].media_gols_marcados}</Typography>
                              </td>
                            </tr>
                            
                            {/* Média gols sofridos */}
                            <tr>
                              <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 'bold' }}>
                                <Typography variant="body2">Goals Against</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336' }}>{typeof teamStats[0].goals_against_avg_home === 'number' ? teamStats[0].goals_against_avg_home.toFixed(1) : teamStats[0].goals_against_avg_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336' }}>{typeof teamStats[0].goals_against_avg_away === 'number' ? teamStats[0].goals_against_avg_away.toFixed(1) : teamStats[0].goals_against_avg_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#f44336', fontWeight: 'bold' }}>{typeof teamStats[0].media_gols_sofridos === 'number' ? teamStats[0].media_gols_sofridos.toFixed(1) : teamStats[0].media_gols_sofridos}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50' }}>{typeof teamStats[1].goals_against_avg_home === 'number' ? teamStats[1].goals_against_avg_home.toFixed(1) : teamStats[1].goals_against_avg_home}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50' }}>{typeof teamStats[1].goals_against_avg_away === 'number' ? teamStats[1].goals_against_avg_away.toFixed(1) : teamStats[1].goals_against_avg_away}</Typography>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>{typeof teamStats[1].media_gols_sofridos === 'number' ? teamStats[1].media_gols_sofridos.toFixed(1) : teamStats[1].media_gols_sofridos}</Typography>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        {/* Informações adicionais abaixo da tabela */}
                        <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                          {/* Informações do Time 1 */}
                          <Box sx={{ flex: '1 1 300px', p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, borderBottom: '1px solid rgba(0,0,0,0.1)', pb: 1 }}>
                              {teamStats[0].team_name} - Informações Adicionais
                            </Typography>
                            
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Formação mais usada:</strong> {teamStats[0].most_used_formation || 'N/A'}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                              <Box sx={{ flex: '1 1 120px' }}>
                                <Typography variant="body2">
                                  <strong>Clean sheets:</strong> {teamStats[0].clean_sheets}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Não marcou:</strong> {teamStats[0].failed_to_score}
                                </Typography>
                              </Box>
                              <Box sx={{ flex: '1 1 120px' }}>
                                <Typography variant="body2">
                                  <strong>Pênaltis marcados:</strong> {teamStats[0].penalty_scored_total} ({teamStats[0].penalty_scored_percentage || '0%'})
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Pênaltis perdidos:</strong> {teamStats[0].penalty_missed_total} ({teamStats[0].penalty_missed_percentage || '0%'})
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" fontWeight="medium" sx={{ mt: 2, mb: 1, borderBottom: '1px solid rgba(0,0,0,0.1)', pb: 1 }}>
                              Maiores resultados
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                              <Box sx={{ flex: '1 1 120px' }}>
                                <Typography variant="body2">
                                  <strong>Maior vitória em casa:</strong> {teamStats[0].biggest_win_home || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Maior vitória fora:</strong> {teamStats[0].biggest_win_away || 'N/A'}
                                </Typography>
                              </Box>
                              <Box sx={{ flex: '1 1 120px' }}>
                                <Typography variant="body2">
                                  <strong>Maior derrota em casa:</strong> {teamStats[0].biggest_lose_home || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Maior derrota fora:</strong> {teamStats[0].biggest_lose_away || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          
                          {/* Informações do Time 2 */}
                          <Box sx={{ flex: '1 1 300px', p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, borderBottom: '1px solid rgba(0,0,0,0.1)', pb: 1 }}>
                              {teamStats[1].team_name} - Informações Adicionais
                            </Typography>
                            
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Formação mais usada:</strong> {teamStats[1].most_used_formation || 'N/A'}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                              <Box sx={{ flex: '1 1 120px' }}>
                                <Typography variant="body2">
                                  <strong>Clean sheets:</strong> {teamStats[1].clean_sheets}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Não marcou:</strong> {teamStats[1].failed_to_score}
                                </Typography>
                              </Box>
                              <Box sx={{ flex: '1 1 120px' }}>
                                <Typography variant="body2">
                                  <strong>Pênaltis marcados:</strong> {teamStats[1].penalty_scored_total} ({teamStats[1].penalty_scored_percentage || '0%'})
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Pênaltis perdidos:</strong> {teamStats[1].penalty_missed_total} ({teamStats[1].penalty_missed_percentage || '0%'})
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" fontWeight="medium" sx={{ mt: 2, mb: 1, borderBottom: '1px solid rgba(0,0,0,0.1)', pb: 1 }}>
                              Maiores resultados
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                              <Box sx={{ flex: '1 1 120px' }}>
                                <Typography variant="body2">
                                  <strong>Maior vitória em casa:</strong> {teamStats[1].biggest_win_home || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Maior vitória fora:</strong> {teamStats[1].biggest_win_away || 'N/A'}
                                </Typography>
                              </Box>
                              <Box sx={{ flex: '1 1 120px' }}>
                                <Typography variant="body2">
                                  <strong>Maior derrota em casa:</strong> {teamStats[1].biggest_lose_home || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Maior derrota fora:</strong> {teamStats[1].biggest_lose_away || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    )}
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        * Estatísticas baseadas nos dados mais recentes disponíveis antes da data da partida.
                      </Typography>
                      {teamStats.some(stat => stat.dias_diferenca > 0) && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          * Alguns dados podem ser de até {Math.max(...teamStats.map(s => s.dias_diferenca))} dias antes da partida.
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}                
              </Stack>
            )}
          </Box>
          )}
          
          {/* Tab de Escalação */}
          {tabValue === 2 && (
            <Box onClick={(e) => e.stopPropagation()} sx={{ p: 2, maxWidth: '900px', mx: 'auto' }}>
              {loadingLineups ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 2 }}>Carregando escalações...</Typography>
                </Box>
              ) : lineupsError ? (
                <Typography color="error" align="center">{lineupsError}</Typography>
              ) : lineups.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center">
                  Nenhuma escalação disponível para esta partida.
                </Typography>
              ) : (
                <Box sx={{ width: '100%' }}>

                  
                  {(() => {
                    // Encontrar as equipes da casa e visitante
                    const homeTeam = lineups.find(team => team.team_id === fixture.home_team_id);
                    const awayTeam = lineups.find(team => team.team_id === fixture.away_team_id);
                    
                    if (!homeTeam || !awayTeam) {
                      return (
                        <Typography variant="body2" color="text.secondary" align="center">
                          Informações incompletas sobre as escalações.
                        </Typography>
                      );
                    }
                    
                    // Posicionar jogadores nos campos
                    const homePositionedPlayers = getPlayerPositions(homeTeam.formation, homeTeam.starters);
                    const awayPositionedPlayers = getPlayerPositions(awayTeam.formation, awayTeam.starters);
                    
                    return (
                      <>

                        
                        {/* Campos de futebol e jogadores lado a lado */}
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', md: 'row' },
                          justifyContent: 'center',
                          mb: 3,
                          gap: 3
                        }}>
                          {/* Campo da equipe da casa */}
                          <Box sx={{ flex: 1 }}>
                            {/* Nome do técnico e formação */}
                            <Box sx={{ mb: 2, textAlign: 'center' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                                Técnico: {homeTeam.coach_name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                Formação: {homeTeam.formation}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ 
                              position: 'relative', 
                              width: '80%', maxWidth: '220px', mx: 'auto', 
                              height: 240, 
                              backgroundColor: '#4CAF50',
                              borderRadius: 2,
                              overflow: 'hidden',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage: `
                                  linear-gradient(to right, white 1px, transparent 1px),
                                  linear-gradient(to bottom, white 1px, transparent 1px)
                                `,
                                backgroundSize: '20px 20px',
                                opacity: 0.1,
                              }
                            }}>
                              {/* Linhas do campo */}
                              <Box sx={{ 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                border: '2px solid white',
                                borderRadius: 2,
                              }}>
                                {/* Linha do meio campo */}
                                <Box sx={{ 
                                  position: 'absolute',
                                  top: '50%',
                                  left: 0,
                                  right: 0,
                                  height: 2,
                                  backgroundColor: 'white',
                                }} />
                                
                                {/* Círculo do meio campo */}
                                <Box sx={{ 
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  width: 60,
                                  height: 60,
                                  borderRadius: '50%',
                                  border: '2px solid white',
                                  transform: 'translate(-50%, -50%)',
                                }} />
                                
                                {/* Áreas */}
                                <Box sx={{ 
                                  position: 'absolute',
                                  top: 0,
                                  left: '50%',
                                  width: 120,
                                  height: 50,
                                  border: '2px solid white',
                                  borderTop: 'none',
                                  transform: 'translateX(-50%)',
                                }} />
                                <Box sx={{ 
                                  position: 'absolute',
                                  bottom: 0,
                                  left: '50%',
                                  width: 120,
                                  height: 50,
                                  border: '2px solid white',
                                  borderBottom: 'none',
                                  transform: 'translateX(-50%)',
                                }} />
                              </Box>
                              
                              {/* Jogadores posicionados no campo */}
                              {homePositionedPlayers.map(({ player, position }, index) => (
                                <Tooltip 
                                  key={player.player_id} 
                                  title={`${player.number} - ${player.player_name} (${player.position})`}
                                  arrow
                                >
                                  <Box sx={{ 
                                    position: 'absolute',
                                    left: `${position.x}%`,
                                    top: `${position.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #1976d2, #0d47a1)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    zIndex: 2,
                                    boxShadow: '0 3px 5px rgba(0,0,0,0.3)',
                                    border: '2px solid white',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      transform: 'translate(-50%, -50%) scale(1.1)',
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                                    }
                                  }}>
                                    {player.number}
                                  </Box>
                                </Tooltip>
                              ))}
                            </Box>
                            

                            
                            {/* Lista de jogadores titulares da casa */}
                            <Box sx={{ mt: 1 }}>

                              
                              <Box>
                                <Typography variant="subtitle2" sx={{ 
                                  mb: 2, 
                                  pb: 0.5, 
                                  textAlign: 'center',
                                  color: 'primary.dark',
                                  fontWeight: 'bold',
                                  borderBottom: '2px solid',
                                  borderImage: 'linear-gradient(to right, transparent, #1976d2, transparent) 1',
                                }}>
                                  TITULARES
                                </Typography>
                                <Stack spacing={0.5}>
                                  {homeTeam.starters.map((player) => (
                                    <Box key={player.player_id} sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      py: 0.7,
                                      px: 1.5,
                                      borderRadius: 1,
                                      justifyContent: 'flex-start', // Alinhado à esquerda
                                      transition: 'all 0.2s ease',
                                      '&:hover': { 
                                        backgroundColor: 'rgba(25, 118, 210, 0.08)'
                                      }
                                    }}>
                                      <Box sx={{ 
                                        minWidth: 26, 
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 1.5,
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold'
                                      }}>
                                        {player.number}
                                      </Box>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                          {player.player_name}
                                        </Typography>
                                        <Typography variant="caption" color="primary.dark" sx={{ ml: 0.5, fontSize: '0.7rem', opacity: 0.8 }}>
                                          ({player.position})
                                        </Typography>
                                        {playerRatings[player.player_id] && (
                                          <Typography 
                                            variant="caption" 
                                            sx={{ 
                                              ml: 1, 
                                              px: 0.5, 
                                              py: 0.2, 
                                              backgroundColor: 'success.light', 
                                              color: 'success.dark',
                                              borderRadius: 0.5,
                                              fontSize: '0.65rem',
                                              fontWeight: 'bold'
                                            }}
                                          >
                                            ⭐ {playerRatings[player.player_id].toFixed(1)}
                                          </Typography>
                                        )}
                                      </Box>
                                    </Box>
                                  ))}
                                </Stack>
                              </Box>
                            </Box>
                          </Box>
                          
                          {/* Campo da equipe visitante */}
                          <Box sx={{ flex: 1 }}>
                            {/* Nome do técnico e formação */}
                            <Box sx={{ mb: 2, textAlign: 'center' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                                Técnico: {awayTeam.coach_name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                Formação: {awayTeam.formation}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ 
                              position: 'relative', 
                              width: '80%', maxWidth: '220px', mx: 'auto', 
                              height: 240, 
                              backgroundColor: '#4CAF50',
                              borderRadius: 2,
                              overflow: 'hidden',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage: `
                                  linear-gradient(to right, white 1px, transparent 1px),
                                  linear-gradient(to bottom, white 1px, transparent 1px)
                                `,
                                backgroundSize: '20px 20px',
                                opacity: 0.1,
                              }
                            }}>
                              {/* Linhas do campo */}
                              <Box sx={{ 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                border: '2px solid white',
                                borderRadius: 2,
                              }}>
                                {/* Linha do meio campo */}
                                <Box sx={{ 
                                  position: 'absolute',
                                  top: '50%',
                                  left: 0,
                                  right: 0,
                                  height: 2,
                                  backgroundColor: 'white',
                                }} />
                                
                                {/* Círculo do meio campo */}
                                <Box sx={{ 
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  width: 60,
                                  height: 60,
                                  borderRadius: '50%',
                                  border: '2px solid white',
                                  transform: 'translate(-50%, -50%)',
                                }} />
                                
                                {/* Áreas */}
                                <Box sx={{ 
                                  position: 'absolute',
                                  top: 0,
                                  left: '50%',
                                  width: 120,
                                  height: 50,
                                  border: '2px solid white',
                                  borderTop: 'none',
                                  transform: 'translateX(-50%)',
                                }} />
                                <Box sx={{ 
                                  position: 'absolute',
                                  bottom: 0,
                                  left: '50%',
                                  width: 120,
                                  height: 50,
                                  border: '2px solid white',
                                  borderBottom: 'none',
                                  transform: 'translateX(-50%)',
                                }} />
                              </Box>
                              
                              {/* Jogadores posicionados no campo */}
                              {awayPositionedPlayers.map(({ player, position }, index) => (
                                <Tooltip 
                                  key={player.player_id} 
                                  title={`${player.number} - ${player.player_name} (${player.position})`}
                                  arrow
                                >
                                  <Box sx={{ 
                                    position: 'absolute',
                                    left: `${position.x}%`,
                                    top: `${position.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #2196f3, #0d47a1)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    boxShadow: '0 3px 5px rgba(0,0,0,0.3)',
                                    border: '2px solid white',
                                    zIndex: 10,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      transform: 'translate(-50%, -50%) scale(1.1)',
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                                      zIndex: 20,
                                    }
                                  }}>
                                    {player.number}
                                  </Box>
                                </Tooltip>
                              ))}
                            </Box>
                            

                            
                            {/* Lista de jogadores titulares visitante */}
                            <Box sx={{ mt: 1 }}>

                              
                              <Box>
                                <Typography variant="subtitle2" sx={{ 
                                  mb: 2, 
                                  pb: 0.5, 
                                  textAlign: 'center',
                                  color: '#0d47a1',
                                  fontWeight: 'bold',
                                  borderBottom: '2px solid',
                                  borderImage: 'linear-gradient(to right, transparent, #2196f3, transparent) 1',
                                }}>
                                  TITULARES
                                </Typography>
                                <Stack spacing={0.5}>
                                  {awayTeam.starters.map((player) => (
                                    <Box key={player.player_id} sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      py: 0.7,
                                      px: 1.5,
                                      borderRadius: 1,
                                      justifyContent: 'flex-end', // Alinhado à direita
                                      transition: 'all 0.2s ease',
                                      '&:hover': { 
                                        backgroundColor: 'rgba(33, 150, 243, 0.08)'
                                      }
                                    }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        {playerRatings[player.player_id] && (
                                          <Typography 
                                            variant="caption" 
                                            sx={{ 
                                              mr: 1, 
                                              px: 0.5, 
                                              py: 0.2, 
                                              backgroundColor: 'success.light', 
                                              color: 'success.dark',
                                              borderRadius: 0.5,
                                              fontSize: '0.65rem',
                                              fontWeight: 'bold'
                                            }}
                                          >
                                            ⭐ {playerRatings[player.player_id].toFixed(1)}
                                          </Typography>
                                        )}
                                        <Typography variant="body2" sx={{ fontWeight: 'medium', textAlign: 'right' }}>
                                          {player.player_name}
                                        </Typography>
                                        <Typography variant="caption" color="#0d47a1" sx={{ ml: 0.5, fontSize: '0.7rem', opacity: 0.8 }}>
                                          ({player.position})
                                        </Typography>
                                      </Box>
                                      <Box sx={{ 
                                        minWidth: 26, 
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        ml: 1.5,
                                        mr: 0,
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold'
                                      }}>
                                        {player.number}
                                      </Box>
                                    </Box>
                                  ))}
                                </Stack>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </>
                    );
                  })()}
                </Box>
              )}
            </Box>
          )}
          
          {/* Tab de Substituições */}
          {tabValue === 3 && (
            <Box sx={{ p: 2 }} onClick={(e) => e.stopPropagation()}>
              {loadingSubstitutions ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 2 }}>Carregando substituições...</Typography>
                </Box>
              ) : substitutionsError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {substitutionsError}
                </Alert>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    Substituições da Partida
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 2 }}>
                    {/* Substituições do Time da Casa */}
                    <Box sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {fixture.home_team_name}
                      </Typography>
                      
                      {substitutions.filter(sub => sub.team_id === fixture.home_team_id).length === 0 ? (
                        <Typography variant="body2" color="text.secondary" align="center">
                          Nenhuma substituição registrada
                        </Typography>
                      ) : (
                        <Stack spacing={2}>
                          {substitutions
                            .filter(sub => sub.team_id === fixture.home_team_id)
                            .map((sub, index) => (
                              <Paper 
                                key={index} 
                                elevation={0} 
                                sx={{ 
                                  p: 1.5, 
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  borderRadius: 1,
                                  position: 'relative',
                                  overflow: 'hidden'
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Box 
                                    sx={{ 
                                      bgcolor: '#4caf50', 
                                      color: 'white', 
                                      borderRadius: '50%',
                                      width: 20,
                                      height: 20,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.75rem',
                                      fontWeight: 'bold',
                                      mr: 1
                                    }}
                                  >
                                    ↑
                                  </Box>
                                  <Typography variant="body2" fontWeight="bold">
                                    {sub.player_in_name}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box 
                                    sx={{ 
                                      bgcolor: '#f44336', 
                                      color: 'white', 
                                      borderRadius: '50%',
                                      width: 20,
                                      height: 20,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.75rem',
                                      fontWeight: 'bold',
                                      mr: 1
                                    }}
                                  >
                                    ↓
                                  </Box>
                                  <Typography variant="body2">
                                    {sub.player_out_name}
                                  </Typography>
                                </Box>
                                
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    position: 'absolute', 
                                    top: 8, 
                                    right: 8,
                                    bgcolor: 'rgba(0,0,0,0.05)',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontWeight: 'medium'
                                  }}
                                >
                                  {sub.minute}'
                                </Typography>
                              </Paper>
                            ))
                          }
                        </Stack>
                      )}
                    </Box>
                    
                    {/* Substituições do Time Visitante */}
                    <Box sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {fixture.away_team_name}
                      </Typography>
                      
                      {substitutions.filter(sub => sub.team_id === fixture.away_team_id).length === 0 ? (
                        <Typography variant="body2" color="text.secondary" align="center">
                          Nenhuma substituição registrada
                        </Typography>
                      ) : (
                        <Stack spacing={2}>
                          {substitutions
                            .filter(sub => sub.team_id === fixture.away_team_id)
                            .map((sub, index) => (
                              <Paper 
                                key={index} 
                                elevation={0} 
                                sx={{ 
                                  p: 1.5, 
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  borderRadius: 1,
                                  position: 'relative',
                                  overflow: 'hidden'
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Box 
                                    sx={{ 
                                      bgcolor: '#4caf50', 
                                      color: 'white', 
                                      borderRadius: '50%',
                                      width: 20,
                                      height: 20,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.75rem',
                                      fontWeight: 'bold',
                                      mr: 1
                                    }}
                                  >
                                    ↑
                                  </Box>
                                  <Typography variant="body2" fontWeight="bold">
                                    {sub.player_in_name}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box 
                                    sx={{ 
                                      bgcolor: '#f44336', 
                                      color: 'white', 
                                      borderRadius: '50%',
                                      width: 20,
                                      height: 20,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.75rem',
                                      fontWeight: 'bold',
                                      mr: 1
                                    }}
                                  >
                                    ↓
                                  </Box>
                                  <Typography variant="body2">
                                    {sub.player_out_name}
                                  </Typography>
                                </Box>
                                
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    position: 'absolute', 
                                    top: 8, 
                                    right: 8,
                                    bgcolor: 'rgba(0,0,0,0.05)',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontWeight: 'medium'
                                  }}
                                >
                                  {sub.minute}'
                                </Typography>
                              </Paper>
                            ))
                          }
                        </Stack>
                      )}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          )}
          
          {/* Tab de ODDS */}
          {tabValue === 4 && (
            <Box sx={{ p: 2 }} onClick={(e) => e.stopPropagation()}>
              {loadingOdds ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : oddsError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {oddsError}
                </Alert>
              ) : odds.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center">
                  Nenhuma odd disponível para esta partida
                </Typography>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Odds da Partida
                  </Typography>
                  
                  {odds.map((bookmaker, index) => (
                    <Accordion 
                      key={`${bookmaker.bookmaker_id}-${index}`} 
                      sx={{ mb: 1 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon />}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Typography>{bookmaker.bookmaker_name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails onClick={(e) => e.stopPropagation()}>
                        {bookmaker.bets.map((bet, betIndex) => (
                          <Box 
                            key={`${bet.bet_id}-${betIndex}`} 
                            sx={{ mb: 2 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {bet.bet_name}
                            </Typography>
                            
                            <Box sx={{ width: '100%' }}>
                              <Box 
                                sx={{ 
                                  display: 'grid', 
                                  gridTemplateColumns: {
                                    xs: 'repeat(3, 1fr)',
                                    sm: 'repeat(4, 1fr)',
                                    md: 'repeat(6, 1fr)'
                                  },
                                  gap: 1
                                }}
                              >
                                {bet.options.map((option, optionIndex) => (
                                  <Box
                                    key={`${option.option_value}-${optionIndex}`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Paper 
                                      elevation={0} 
                                      sx={{ 
                                        p: 1, 
                                        textAlign: 'center',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        '&:hover': {
                                          bgcolor: 'action.hover'
                                        }
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Typography variant="caption" display="block" color="text.secondary">
                                        {option.option_value}
                                      </Typography>
                                      <Typography variant="body2" fontWeight="bold">
                                        {option.odd_value}
                                      </Typography>
                                    </Paper>
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
