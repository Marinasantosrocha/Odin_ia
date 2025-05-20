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
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
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
  const [loading, setLoading] = useState<{ leagues: boolean; seasons: boolean; fixtures: boolean }>({ 
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

  // Efeito para buscar partidas quando liga e temporada são selecionadas
  useEffect(() => {
    const fetchFixtures = async () => {
      if (!selectedLeague || !selectedSeason) {
        setFixtures([]);
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
        setFixtures([]);
      } finally {
        setLoading((prev) => ({ ...prev, fixtures: false }));
      }
    };
    
    fetchFixtures();
  }, [selectedLeague, selectedSeason]);

  // Handlers para os eventos de seleção
  const handleLeagueChange = (event: SelectChangeEvent<string>) => {
    setSelectedLeague(event.target.value);
    setSelectedSeason("");
    setSeasons([]);
    setFixtures([]);
  };
  
  const handleSeasonChange = (event: SelectChangeEvent<string>) => {
    setSelectedSeason(event.target.value);
  };

  return (
    <PageContainer title="Histórico" description="Selecione uma liga e temporada">
      <Breadcrumb title="Histórico" items={BCrumb} />
      <Box sx={{ mb: 4 }}>
        {/* Área de seleção de liga e temporada */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
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
            <Typography variant="h6" sx={{ mb: 3 }}>
              Partidas da temporada {selectedSeason}/{Number(selectedSeason) + 1}
            </Typography>
            
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
              <Stack spacing={2}>
                {fixtures.map((fixture) => (
                  <Paper key={fixture.fixture_id} sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Time da casa */}
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                        <Typography variant="body1" fontWeight="medium" sx={{ mr: 2, textAlign: 'right' }}>
                          {fixture.home_team_name}
                        </Typography>
                        <Avatar 
                          src={fixture.home_team_logo} 
                          alt={fixture.home_team_name}
                          sx={{ width: 40, height: 40 }}
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
                            {fixture.goals_home === null ? '-' : fixture.goals_home} : {fixture.goals_away === null ? '-' : fixture.goals_away}
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
                          sx={{ width: 40, height: 40 }}
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
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Box>
    </PageContainer>
  );
}
