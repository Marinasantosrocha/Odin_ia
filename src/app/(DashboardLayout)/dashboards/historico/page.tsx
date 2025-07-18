"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stack,
  Paper,
  Avatar,
  Chip,
  Collapse,
} from "@mui/material";
import StandingsTooltip from "./components/StandingsTooltip";
import FixtureDetails from "./components/FixtureDetails";
import type { SelectChangeEvent } from "@mui/material/Select";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

// Tipos
interface League {
  league_id: number;
  name: string;
  logo_url?: string;
}

interface Fixture {
  fixture_id: number;
  league_id: number;
  season_year: number;
  date: string;
  status_long: string;
  status_short: string;
  home_team_id: number;
  away_team_id: number;
  home_team_name: string;
  away_team_name: string;
  home_team_logo: string;
  away_team_logo: string;
  goals_home: number | null;
  goals_away: number | null;
  round_id: string;
  round_name: string;
  is_current_round: boolean;
}

// Configuração de navegação
const BCrumb = [
  { to: "/", title: "Dashboard" },
  { title: "Histórico" },
];

export default function Historico() {
  // Estados
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [seasons, setSeasons] = useState<number[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [expandedFixture, setExpandedFixture] = useState<number | null>(null);
  const [expandedRounds, setExpandedRounds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<{
    leagues: boolean;
    seasons: boolean;
    fixtures: boolean;
  }>({ 
    leagues: false, 
    seasons: false,
    fixtures: false
  });
  const [error, setError] = useState<string>("");

  // Buscar ligas ao carregar o componente
  useEffect(() => {
    const fetchLeagues = async () => {
      setLoading((prev) => ({ ...prev, leagues: true }));
      setError("");
      
      try {
        const response = await fetch("/api/leagues");
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar ligas: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        // Verificar se a resposta possui a propriedade data e se é um array
        if (responseData.data && Array.isArray(responseData.data)) {
          setLeagues(responseData.data);
        } else {
          // Tentar lidar com diferentes formatos possíveis de resposta
          const leaguesData = Array.isArray(responseData) ? responseData : 
                             (responseData.data ? responseData.data : []);
          setLeagues(leaguesData);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Erro ao buscar ligas:", errorMessage);
        setError("Erro ao buscar ligas. Tente novamente mais tarde.");
        setLeagues([]);
      } finally {
        setLoading((prev) => ({ ...prev, leagues: false }));
      }
    };
    
    fetchLeagues();
  }, []);

  // Buscar temporadas quando uma liga for selecionada
  useEffect(() => {
    const fetchSeasons = async () => {
      if (!selectedLeague) return;
      
      setLoading((prev) => ({ ...prev, seasons: true }));
      setError("");
      
      try {
        const response = await fetch(`/api/leagues/${selectedLeague}/seasons`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar temporadas: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        // Verificar se a resposta possui a propriedade data e se é um array
        if (responseData.data && Array.isArray(responseData.data)) {
          setSeasons(responseData.data);
        } else {
          // Tentar lidar com diferentes formatos possíveis de resposta
          const seasonsData = Array.isArray(responseData) ? responseData : 
                             (responseData.data ? responseData.data : []);
          setSeasons(seasonsData);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Erro ao buscar temporadas:", errorMessage);
        setError("Erro ao buscar temporadas. Tente novamente mais tarde.");
        setSeasons([]);
      } finally {
        setLoading((prev) => ({ ...prev, seasons: false }));
      }
    };
    
    fetchSeasons();
  }, [selectedLeague]);

  // Função para agrupar partidas por rodada e garantir ordem crescente
  const groupFixturesByRound = (fixtures: Fixture[]) => {
    const groupedFixtures: Record<string, { roundName: string; fixtures: Fixture[]; isCurrent: boolean; roundNumber: number }> = {};
    
    fixtures.forEach(fixture => {
      const roundId = fixture.round_id || 'unknown';
      if (!groupedFixtures[roundId]) {
        // Extrair o número da rodada para ordenação
        let roundNumber = 0;
        try {
          // Tentar extrair um número do roundId ou do nome da rodada
          const match = /\d+/.exec(roundId) || /\d+/.exec(fixture.round_name || '');
          if (match) {
            roundNumber = parseInt(match[0], 10);
          }
        } catch (e) {
          console.log('Erro ao extrair número da rodada:', e);
        }
        
        groupedFixtures[roundId] = {
          roundName: fixture.round_name || `Rodada ${roundId}`,
          fixtures: [],
          isCurrent: fixture.is_current_round,
          roundNumber: roundNumber
        };
      }
      groupedFixtures[roundId].fixtures.push(fixture);
    });
    
    return groupedFixtures;
  };
  
  // Função para obter rodadas ordenadas
  const getSortedRounds = (fixtures: Fixture[]) => {
    const grouped = groupFixturesByRound(fixtures);
    
    // Converter para array e ordenar por número da rodada
    return Object.entries(grouped)
      .map(([roundId, data]) => ({
        roundId,
        ...data
      }))
      .sort((a, b) => a.roundNumber - b.roundNumber);
  };

  // Efeito para buscar partidas quando liga e temporada são selecionadas
  useEffect(() => {
    const fetchFixtures = async () => {
      if (!selectedLeague || !selectedSeason) {
        return;
      }
      
      setLoading((prev) => ({ ...prev, fixtures: true }));
      setError("");
      
      try {
        const response = await fetch(`/api/leagues/${selectedLeague}/seasons/${selectedSeason}/fixtures`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar partidas: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        // Verificar se a resposta possui a propriedade data e se é um array
        if (responseData.data && Array.isArray(responseData.data)) {
          setFixtures(responseData.data);
        } else {
          // Tentar lidar com diferentes formatos possíveis de resposta
          const fixturesData = Array.isArray(responseData) ? responseData : 
                             (responseData.data ? responseData.data : []);
          setFixtures(fixturesData);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Erro ao buscar partidas:", errorMessage);
        setError("Erro ao buscar partidas. Tente novamente mais tarde.");
      } finally {
        setLoading((prev) => ({ ...prev, fixtures: false }));
      }
    };
    
    fetchFixtures();
  }, [selectedLeague, selectedSeason]);

  // Handlers para os eventos de seleção
  const handleLeagueChange = (event: SelectChangeEvent<string>) => {
    setSelectedLeague(event.target.value);
    // Resetar rodadas expandidas ao mudar de liga
    setExpandedRounds({});
  };
  
  const handleSeasonChange = (event: SelectChangeEvent<string>) => {
    setSelectedSeason(event.target.value);
    // Resetar rodadas expandidas ao mudar de temporada
    setExpandedRounds({});
  };

  const handleFixtureClick = (fixture: Fixture) => {
    if (expandedFixture === fixture.fixture_id) {
      setExpandedFixture(null);
    } else {
      setExpandedFixture(fixture.fixture_id);
    }
  };
  
  // Handler para expandir/retrair rodadas
  const handleRoundClick = (roundId: string) => {
    setExpandedRounds(prev => ({
      ...prev,
      [roundId]: !prev[roundId]
    }));
  };

  return (
    <PageContainer title="Histórico" description="Histórico de Partidas">
      <Breadcrumb title="Histórico" items={BCrumb} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={0} sx={{ width: '100%', maxWidth: 800, p: 4 }}>
          {/* Área de seleção de liga e temporada */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
            {/* Dropdown de liga */}
            <Box sx={{ width: '100%' }}>
              <FormControl 
                fullWidth 
                error={!!error && error.includes("ligas") && !loading.leagues}
              >
                <InputLabel id="league-select-label">Liga</InputLabel>
                <Select
                  labelId="league-select-label"
                  id="league-select"
                  value={selectedLeague}
                  label="Liga"
                  onChange={handleLeagueChange}
                  disabled={loading.leagues}
                >
                  <MenuItem value="">
                    <em>Selecione uma liga</em>
                  </MenuItem>
                  {leagues.map((league) => (
                    <MenuItem key={league.league_id} value={String(league.league_id)}>
                      {league.name}
                    </MenuItem>
                  ))}
                </Select>
                {loading.leagues && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
              </FormControl>
            </Box>
            
            {/* Dropdown de temporada */}
            <Box sx={{ width: '100%' }}>
              <FormControl 
                fullWidth 
                disabled={!selectedLeague || loading.seasons}
                error={!!error && error.includes("temporadas") && !loading.seasons}
              >
                <InputLabel id="season-select-label">Temporada</InputLabel>
                <Select
                  labelId="season-select-label"
                  id="season-select"
                  value={selectedSeason}
                  label="Temporada"
                  onChange={handleSeasonChange}
                  disabled={!selectedLeague || loading.seasons}
                >
                  {loading.seasons ? (
                    <MenuItem disabled>
                      <em>Carregando temporadas...</em>
                    </MenuItem>
                  ) : (
                    seasons.map((season) => (
                      <MenuItem key={season} value={String(season)}>
                        {season}/{Number(season) + 1}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {loading.seasons && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
              </FormControl>
            </Box>
          </Stack>
          
          {/* Mensagem de erro */}
          {error && (
            <Box sx={{ mt: 3, textAlign: 'center', color: 'error.main' }}>
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}
          
          {/* Mensagem instrutiva */}
          {(!selectedLeague || !selectedSeason) && !error && (
            <Box sx={{ mt: 5, textAlign: 'center', color: 'text.secondary' }}>
              <Typography variant="body1">
                Selecione uma liga e uma temporada para visualizar os dados históricos.
              </Typography>
            </Box>
          )}
          
          {/* Área de exibição das partidas */}
          {selectedLeague && selectedSeason && !error && (
            <Box sx={{ mt: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">
                  Partidas da temporada {selectedSeason}/{Number(selectedSeason) + 1}
                </Typography>
                <StandingsTooltip 
                  leagueId={Number(selectedLeague)} 
                  seasonYear={selectedSeason} 
                />
              </Box>
              
              {loading.fixtures ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Carregando partidas...</Typography>
                </Box>
              ) : fixtures.length === 0 ? (
                <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhuma partida encontrada para esta temporada.
                  </Typography>
                </Paper>
              ) : (
                <Stack spacing={1.5}>
                  {/* Agrupar partidas por rodada em ordem crescente */}
                  {getSortedRounds(fixtures).map((roundData) => (
                    <Box key={roundData.roundId}>
                      {/* Cabeçalho da rodada (clicável) */}
                      <Paper
                        elevation={0}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          p: 1.5,
                          mb: 1,
                          borderRadius: 1,
                          cursor: 'pointer',
                          bgcolor: roundData.isCurrent ? 'rgba(25, 118, 210, 0.08)' : 'background.default',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          },
                          transition: 'background-color 0.2s'
                        }}
                        onClick={() => handleRoundClick(roundData.roundId)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h6" fontWeight="medium">
                            {roundData.roundName}
                          </Typography>
                          {roundData.isCurrent && (
                            <Chip 
                              label="Rodada Atual" 
                              color="primary" 
                              size="small" 
                              sx={{ ml: 2 }}
                            />
                          )}
                        </Box>
                        
                        {/* Ícone de expansão */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            transform: expandedRounds[roundData.roundId] ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Box>
                      </Paper>
                      
                      {/* Partidas da rodada (retrátil) */}
                      <Collapse in={expandedRounds[roundData.roundId] || false} timeout="auto">
                        <Stack spacing={1} sx={{ mb: 1 }}>
                          {roundData.fixtures.map((fixture) => (
                            <Paper 
                              key={fixture.fixture_id} 
                              sx={{ 
                                p: 1.5, 
                                borderRadius: 1,
                                cursor: 'pointer',
                                bgcolor: expandedFixture === fixture.fixture_id ? 'action.hover' : 'background.paper',
                                transition: 'background-color 0.3s ease',
                                '&:hover': {
                                  bgcolor: 'action.hover'
                                }
                              }}
                              onClick={() => handleFixtureClick(fixture)}
                            >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Time da casa */}
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                          <Typography variant="body1" fontWeight="medium" sx={{ mr: 2, textAlign: 'right' }}>
                            {fixture.home_team_name}
                          </Typography>
                          <Avatar 
                            src={fixture.home_team_logo} 
                            alt={fixture.home_team_name}
                            sx={{ 
                              width: 30, 
                              height: 30,
                              borderRadius: 0
                            }}
                          />
                        </Box>
                        
                        {/* Placar */}
                        <Box sx={{ 
                          mx: 2, 
                          px: 3, 
                          py: 1, 
                          borderRadius: 1,
                          bgcolor: 'background.default',
                          minWidth: '90px',
                          textAlign: 'center'
                        }}>
                          {fixture.status_short === 'NS' ? (
                            <Typography variant="body2" color="text.secondary">
                              Não iniciado
                            </Typography>
                          ) : (
                            <Typography variant="h6" fontWeight="bold">
                              {fixture.goals_home === null ? '-' : fixture.goals_home} x {fixture.goals_away === null ? '-' : fixture.goals_away}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {new Date(fixture.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </Typography>
                        </Box>
                        
                        {/* Time visitante */}
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <Avatar 
                            src={fixture.away_team_logo} 
                            alt={fixture.away_team_name}
                            sx={{ 
                              width: 30, 
                              height: 30,
                              borderRadius: 0
                            }}
                          />
                          <Typography variant="body1" fontWeight="medium" sx={{ ml: 2 }}>
                            {fixture.away_team_name}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Status da partida */}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                        <Chip 
                          size="small" 
                          label={fixture.status_long || 'Status não disponível'}
                          color={fixture.status_short === 'FT' ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                      
                      <Collapse in={expandedFixture === fixture.fixture_id} timeout="auto">
                        <FixtureDetails 
                          fixture={fixture} 
                          open={expandedFixture === fixture.fixture_id}
                          selectedLeagueId={selectedLeague ? parseInt(selectedLeague) : 0}
                        />
                      </Collapse>
                          </Paper>
                        ))}
                        </Stack>
                      </Collapse>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </PageContainer>
  );
}
