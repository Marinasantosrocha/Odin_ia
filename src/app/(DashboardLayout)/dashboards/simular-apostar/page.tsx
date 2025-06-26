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
  Alert,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import VirtualWallet from "./components/VirtualWallet";
// import SimulationMatchTable from "./components/SimulationMatchTable";

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

interface Bet {
  id: string;
  fixtureId: number;
  matchName: string;
  betType: string;
  betOption: string;
  odd: number;
  amount: number;
  result?: 'win' | 'loss';
  profit?: number;
  date: Date;
}

interface WalletStats {
  totalBets: number;
  winningBets: number;
  totalProfit: number;
  winRate: number;
}

// Configuração de navegação
const BCrumb = [
  { to: "/", title: "Dashboard" },
  { title: "Simular Apostar" },
];

export default function SimularApostar() {
  // Estados principais
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [seasons, setSeasons] = useState<number[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  // Estados de carregamento
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

  // Estados da carteira virtual
  const [walletBalance, setWalletBalance] = useState<number>(1000); // Saldo inicial
  const [bets, setBets] = useState<Bet[]>([]);
  const [walletStats, setWalletStats] = useState<WalletStats>({
    totalBets: 0,
    winningBets: 0,
    totalProfit: 0,
    winRate: 0,
  });

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
        
        if (responseData.data && Array.isArray(responseData.data)) {
          setLeagues(responseData.data);
        } else {
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
        
        if (responseData.data && Array.isArray(responseData.data)) {
          setSeasons(responseData.data);
        } else {
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

  // Buscar jogos históricos finalizados para simulação
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
        
        if (responseData.data && Array.isArray(responseData.data)) {
          // Filtrar apenas jogos finalizados para simulação
          const finishedFixtures = responseData.data.filter(
            (fixture: Fixture) => fixture.status_short === 'FT'
          );
          setFixtures(finishedFixtures);
        } else {
          const fixturesData = Array.isArray(responseData) ? responseData : 
                             (responseData.data ? responseData.data : []);
          const finishedFixtures = fixturesData.filter(
            (fixture: Fixture) => fixture.status_short === 'FT'
          );
          setFixtures(finishedFixtures);
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

  // Atualizar estatísticas da carteira
  useEffect(() => {
    if (bets.length === 0) {
      setWalletStats({
        totalBets: 0,
        winningBets: 0,
        totalProfit: 0,
        winRate: 0,
      });
      return;
    }

    const totalBets = bets.length;
    const winningBets = bets.filter(bet => bet.result === 'win').length;
    const totalProfit = bets.reduce((sum, bet) => sum + (bet.profit || 0), 0);
    const winRate = totalBets > 0 ? (winningBets / totalBets) * 100 : 0;

    setWalletStats({
      totalBets,
      winningBets,
      totalProfit,
      winRate,
    });
  }, [bets]);

  // Handlers para os eventos de seleção
  const handleLeagueChange = (event: SelectChangeEvent<string>) => {
    setSelectedLeague(event.target.value);
    setSelectedSeason("");
    setFixtures([]);
  };
  
  const handleSeasonChange = (event: SelectChangeEvent<string>) => {
    setSelectedSeason(event.target.value);
  };

  // Função para processar uma aposta
  const processBet = (
    fixtureId: number,
    matchName: string,
    betType: string,
    betOption: string,
    odd: number,
    amount: number,
    isWinningBet: boolean
  ) => {
    if (amount > walletBalance) {
      return false; // Não há saldo suficiente
    }

    const profit = isWinningBet ? (amount * odd) - amount : -amount;
    const newBet: Bet = {
      id: `bet_${Date.now()}_${Math.random()}`,
      fixtureId,
      matchName,
      betType,
      betOption,
      odd,
      amount,
      result: isWinningBet ? 'win' : 'loss',
      profit,
      date: new Date(),
    };

    setBets(prev => [newBet, ...prev]);
    setWalletBalance(prev => prev + profit);
    
    return true;
  };

  return (
    <PageContainer title="Simular Apostar" description="Simulador de Apostas com Carteira Virtual">
      <Breadcrumb title="Simular Apostar" items={BCrumb} />
      
      <Grid container spacing={3}>
        {/* Linha 1: Carteira Virtual */}
        <Grid size={12}>
          <VirtualWallet 
            balance={walletBalance}
            stats={walletStats}
            recentBets={bets.slice(0, 5)}
            onResetWallet={() => {
              setWalletBalance(1000);
              setBets([]);
            }}
          />
        </Grid>

        {/* Linha 2: Filtros */}
        <Grid size={12}>
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
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
          </Paper>
        </Grid>

        {/* Linha 2: Área Principal */}
        <Grid size={12}>
          <Paper elevation={0} sx={{ p: 3 }}>
            
            {/* Mensagem de erro */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {/* Mensagem instrutiva */}
            {(!selectedLeague || !selectedSeason) && !error && (
              <Box sx={{ mt: 5, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body1">
                  Selecione uma liga e uma temporada para simular apostas em jogos históricos.
                </Typography>
              </Box>
            )}
            
            {/* Tabela de jogos para simulação */}
            {selectedLeague && selectedSeason && !error && (
              <Box sx={{ mt: 3 }}>
                {loading.fixtures ? (
                  <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </Box>
                ) : fixtures.length === 0 ? (
                  <Alert severity="info">
                    Nenhum jogo finalizado encontrado para simulação.
                  </Alert>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Data</TableCell>
                          <TableCell>Partida</TableCell>
                          <TableCell align="center">Resultado</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fixtures.slice(0, 10).map((fixture) => (
                          <TableRow key={fixture.fixture_id} hover>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(fixture.date).toLocaleDateString('pt-BR')}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {fixture.home_team_name} vs {fixture.away_team_name}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              {fixture.goals_home !== null && fixture.goals_away !== null ? (
                                <Chip 
                                  label={`${fixture.goals_home} - ${fixture.goals_away}`}
                                  size="small"
                                  color="primary"
                                />
                              ) : (
                                <Typography variant="body2" color="text.secondary">-</Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
