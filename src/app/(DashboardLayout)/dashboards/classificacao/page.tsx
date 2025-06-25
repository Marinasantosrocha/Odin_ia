"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Tooltip,
  Chip
} from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import DashboardCard from "@/app/components/shared/DashboardCard";

interface Standing {
  standing_id: number;
  league_id: number;
  season_year: number;
  team_id: number;
  team_name: string;
  team_logo: string;
  rank: number;
  points: number;
  goals_diff: number;
  group_name: string | null;
  form: string | null;
  status: string | null;
  description: string | null;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals_for: number;
  goals_against: number;
  last_update: string | null;
}

interface League {
  league_id: number;
  name: string;
  logo_url?: string;
  country_name?: string;
  country_code?: string;
}

interface Season {
  season_year: string;
  is_current: boolean;
}

const ClassificacaoPage = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<number | "">("");
  const [selectedSeason, setSelectedSeason] = useState<string | "">("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar ligas ao iniciar a página
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await fetch('/api/leagues');
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          setLeagues(data.data);
          // Se houver ligas, selecionar a primeira por padrão
          if (data.data.length > 0) {
            setSelectedLeague(data.data[0].league_id);
          }
        }
      } catch (error) {
        setError('Erro ao carregar ligas');
        console.error('Erro ao carregar ligas:', error);
      }
    };

    fetchLeagues();
  }, []);

  // Carregar temporadas quando uma liga for selecionada
  useEffect(() => {
    if (selectedLeague) {
      const fetchSeasons = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/leagues/${selectedLeague}/seasons`);
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            setSeasons(data.data);
            // Se houver temporadas, selecionar a atual ou a primeira por padrão
            if (data.data.length > 0) {
              const currentSeason = data.data.find((season: { is_current: any; }) => season.is_current);
              setSelectedSeason(currentSeason ? currentSeason.season_year : data.data[0].season_year);
            }
          }
          setLoading(false);
        } catch (error) {
          setError('Erro ao carregar temporadas');
          console.error('Erro ao carregar temporadas:', error);
          setLoading(false);
        }
      };

      fetchSeasons();
    }
  }, [selectedLeague]);

  // Carregar classificação quando liga e temporada forem selecionadas
  useEffect(() => {
    if (selectedLeague && selectedSeason) {
      const fetchStandings = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/leagues/${selectedLeague}/seasons/${selectedSeason}/standings`);
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            setStandings(data.data);
          }
          setLoading(false);
        } catch (error) {
          setError('Erro ao carregar classificação');
          console.error('Erro ao carregar classificação:', error);
          setLoading(false);
        }
      };

      fetchStandings();
    }
  }, [selectedLeague, selectedSeason]);

  // Manipuladores de eventos para os selects
  const handleLeagueChange = (event: SelectChangeEvent<number>) => {
    setSelectedLeague(event.target.value as number);
    setSelectedSeason("");
    setStandings([]);
  };

  const handleSeasonChange = (event: SelectChangeEvent<string>) => {
    setSelectedSeason(event.target.value);
    setStandings([]);
  };

  // Renderizar forma do time com ícones coloridos
  const renderForm = (form: string | null) => {
    if (!form) return null;
    
    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {form.split('').map((result, index) => {
          let bgColor = '#9e9e9e'; // Cor padrão para casos não mapeados
          let icon = '?';
          
          if (result === 'W') {
            bgColor = '#4caf50'; // Verde para vitória
            icon = '✓'; // Ícone de check
          } else if (result === 'D') {
            bgColor = '#ff9800'; // Laranja para empate
            icon = '='; 
          } else if (result === 'L') {
            bgColor = '#f44336'; // Vermelho para derrota
            icon = '✖'; // Ícone de X
          }
          
          return (
            <Tooltip key={index} title={result === 'W' ? 'Vitória' : result === 'D' ? 'Empate' : 'Derrota'}>
              <Box 
                sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  bgcolor: bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              >
                {icon}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  return (
    <PageContainer title="Classificação" description="Tabela de classificação do campeonato">
      <DashboardCard title="Classificação">
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            {/* Seletor de Liga */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="league-select-label">Liga</InputLabel>
              <Select
                labelId="league-select-label"
                id="league-select"
                value={selectedLeague}
                label="Liga"
                onChange={handleLeagueChange}
              >
                {leagues.map((league) => (
                  <MenuItem key={league.league_id} value={league.league_id}>
                    {league.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Seletor de Temporada */}
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="season-select-label">Temporada</InputLabel>
              <Select
                labelId="season-select-label"
                id="season-select"
                value={selectedSeason}
                label="Temporada"
                onChange={handleSeasonChange}
                disabled={!selectedLeague || seasons.length === 0}
              >
                {seasons.map((season) => (
                  <MenuItem key={season.season_year} value={season.season_year}>
                    {season.season_year} {season.is_current ? "(Atual)" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : standings.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ py: 5 }}>
              {selectedLeague && selectedSeason 
                ? "Nenhuma classificação encontrada para esta liga e temporada" 
                : "Selecione uma liga e temporada para ver a classificação"}
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
              <Table stickyHeader aria-label="tabela de classificação">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>
                      <Tooltip title="Posição">
                        <Typography variant="body2">#</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Time</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>
                      <Tooltip title="Jogos">
                        <Typography variant="body2">J</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>
                      <Tooltip title="Vitórias">
                        <Typography variant="body2">V</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>
                      <Tooltip title="Empates">
                        <Typography variant="body2">E</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>
                      <Tooltip title="Derrotas">
                        <Typography variant="body2">D</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>
                      <Tooltip title="Gols Marcados">
                        <Typography variant="body2">GM</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>
                      <Tooltip title="Gols Sofridos">
                        <Typography variant="body2">GS</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>
                      <Tooltip title="Saldo de Gols">
                        <Typography variant="body2">SG</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 50 }}>
                      <Tooltip title="Pontos">
                        <Typography variant="body2">Pts</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                      <Tooltip title="Últimos 5 jogos">
                        <Typography variant="body2">Forma</Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {standings.map((standing) => (
                    <TableRow 
                      key={standing.standing_id}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                      }}
                    >
                      <TableCell align="center">
                        {standing.rank}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {standing.team_logo && (
                            <Box 
                              component="img" 
                              src={standing.team_logo} 
                              alt={standing.team_name}
                              sx={{ width: 24, height: 24, objectFit: 'contain' }}
                            />
                          )}
                          <Typography variant="body2">{standing.team_name}</Typography>
                          {standing.status && (
                            <Tooltip title={standing.description || standing.status}>
                              <Chip 
                                label={standing.status} 
                                size="small" 
                                color={
                                  standing.status.includes("Promotion") ? "success" : 
                                  standing.status.includes("Relegation") ? "error" : "default"
                                }
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">{standing.played}</TableCell>
                      <TableCell align="center">{standing.win}</TableCell>
                      <TableCell align="center">{standing.draw}</TableCell>
                      <TableCell align="center">{standing.lose}</TableCell>
                      <TableCell align="center">{standing.goals_for}</TableCell>
                      <TableCell align="center">{standing.goals_against}</TableCell>
                      <TableCell align="center">{standing.goals_diff}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>{standing.points}</TableCell>
                      <TableCell align="center">
                        {renderForm(standing.form)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default ClassificacaoPage;
