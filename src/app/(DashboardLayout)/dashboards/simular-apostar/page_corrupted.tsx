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
  Button,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
imp            </Paper>
          </Box>
        )}

        {/* Área Principal */}
        <Box>rtualWallet from "./components/VirtualWallet";
import PredictionCard from "@/app/components/prediction/PredictionCard";
import MetricsDashboard from "@/app/components/prediction/MetricsDashboard";
import { Prediction, ValidationResult, PredictionModel } from "@/utils/prediction/types";
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
  followedPrediction?: boolean;
  predictionConfidence?: number;
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
  const [predictionBasedBets, setPredictionBasedBets] = useState<number>(0);
  const [predictionBasedWins, setPredictionBasedWins] = useState<number>(0);

  // Estados do sistema de predição
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [predictionModel, setPredictionModel] = useState<PredictionModel | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showPredictions, setShowPredictions] = useState<boolean>(false);

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

  // Carreagar predições existentes quando liga/temporada mudam
  useEffect(() => {
    const loadPredictions = async () => {
      if (!selectedLeague || !selectedSeason) {
        setPredictions([]);
        setPredictionModel(null);
        setValidationResult(null);
        return;
      }

      try {
        const response = await fetch(
          `/api/prediction/predictions?leagueId=${selectedLeague}&seasonYear=${selectedSeason}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setPredictions(data.predictions || []);
            setPredictionModel(data.model || null);
            
            // Se temos predições, calcular validação básica
            if (data.predictions && data.predictions.length > 0) {
              const finishedPredictions = data.predictions.filter((p: Prediction) => p.actual_result !== null);
              const correctPredictions = finishedPredictions.filter((p: Prediction) => p.is_correct === true).length;
              const accuracy = finishedPredictions.length > 0 ? correctPredictions / finishedPredictions.length : 0;
              
              setValidationResult({
                total_matches: finishedPredictions.length,
                correct_predictions: correctPredictions,
                accuracy,
                precision_by_outcome: {
                  home_win: 0, // Simplificado para esta versão
                  draw: 0,
                  away_win: 0
                },
                confidence_correlation: accuracy
              });
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar predições:', error);
      }
    };

    loadPredictions();
  }, [selectedLeague, selectedSeason]);

  // Função para iniciar análise de predições
  const startPredictionAnalysis = async () => {
    if (!selectedLeague || !selectedSeason) {
      setError('Selecione uma liga e temporada primeiro');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/prediction/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leagueId: parseInt(selectedLeague),
          seasonYear: parseInt(selectedSeason),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPredictions(data.predictions || []);
        setPredictionModel(data.model || null);
        setValidationResult(data.validation || null);
        setShowPredictions(true);
      } else {
        setError(data.error || 'Erro ao analisar predições');
      }
    } catch (error) {
      console.error('Erro na análise:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Função para buscar predição de uma partida específica
  const getPredictionForFixture = (fixtureId: number): Prediction | undefined => {
    return predictions.find(p => p.fixture_id === fixtureId);
  };

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
      
      <Box sx={{ p: 3 }}>
        {/* Carteira Virtual */}
        <Box sx={{ mb: 3 }}>
          <VirtualWallet 
            balance={walletBalance}
            stats={walletStats}
            recentBets={bets.slice(0, 5)}
            predictionBasedBets={predictionBasedBets}
            predictionBasedWins={predictionBasedWins}
            onResetWallet={() => {
              setWalletBalance(1000);
              setBets([]);
              setPredictionBasedBets(0);
              setPredictionBasedWins(0);
            }}
          />
        </Box>

        {/* Filtros */}
        <Box sx={{ mb: 3 }}>
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
        </Box>

        {/* Sistema de Predição */}
        {selectedLeague && selectedSeason && (
          <Box sx={{ mb: 3 }}>
            <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Sistema de Predição</Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={startPredictionAnalysis}
                      disabled={isAnalyzing || !selectedLeague || !selectedSeason}
                      startIcon={isAnalyzing ? <CircularProgress size={20} /> : null}
                    >
                      {isAnalyzing ? 'Analisando...' : 'Gerar Predições'}
                    </Button>
                    {predictions.length > 0 && (
                      <Button
                        variant="outlined"
                        onClick={() => setShowPredictions(!showPredictions)}
                      >
                        {showPredictions ? 'Ocultar Predições' : 'Mostrar Predições'}
                      </Button>
                    )}
                  </Stack>
                </Box>
                
                {/* Dashboard de Métricas */}
                {validationResult && (
                  <MetricsDashboard 
                    validationResult={validationResult}
                    accuracy={validationResult.accuracy}
                    totalPredictions={validationResult.total_matches}
                    correctPredictions={validationResult.correct_predictions}
                  />
                )}
                
                {/* Predições */}
                {showPredictions && predictions.length > 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Predições Geradas ({predictions.length} partidas)
                    </Typography>
                    <Grid container spacing={2}>
                      {predictions.slice(0, 6).map((prediction) => (
                        <Grid key={prediction.fixture_id} item xs={12} md={6} lg={4}>
                          <PredictionCard 
                            prediction={prediction}
                            homeTeamName={fixtures.find(f => f.fixture_id === prediction.fixture_id)?.home_team_name || 'Time Casa'}
                            awayTeamName={fixtures.find(f => f.fixture_id === prediction.fixture_id)?.away_team_name || 'Time Visitante'}
                            matchDate={fixtures.find(f => f.fixture_id === prediction.fixture_id)?.date || new Date().toISOString()}
                            compact={true}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    {predictions.length > 6 && (
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          E mais {predictions.length - 6} predições...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>
        )}

        {/* Linha 4: Área Principal */}
        <Grid xs={12}>
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
                          <TableCell align="center">Casa</TableCell>
                          <TableCell align="center">Empate</TableCell>
                          <TableCell align="center">Fora</TableCell>
                          <TableCell align="center">Resultado</TableCell>
                          <TableCell align="center">Predição</TableCell>
                          <TableCell align="center">Aposta</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fixtures.slice(0, 10).map((fixture) => {
                          // Buscar predição para esta partida
                          const prediction = getPredictionForFixture(fixture.fixture_id);
                          
                          // Simular odds baseadas no resultado histórico
                          const homeWins = fixture.goals_home && fixture.goals_away && fixture.goals_home > fixture.goals_away;
                          const awayWins = fixture.goals_home && fixture.goals_away && fixture.goals_away > fixture.goals_home;
                          const isDraw = fixture.goals_home && fixture.goals_away && fixture.goals_home === fixture.goals_away;
                          
                          // Gerar odds simuladas (invertidas com base no resultado para parecer realistas)
                          const homeOdd = homeWins ? (1.5 + Math.random() * 0.8).toFixed(2) : (2.2 + Math.random() * 1.5).toFixed(2);
                          const drawOdd = isDraw ? (3.0 + Math.random() * 0.5).toFixed(2) : (3.2 + Math.random() * 1.0).toFixed(2);
                          const awayOdd = awayWins ? (1.5 + Math.random() * 0.8).toFixed(2) : (2.2 + Math.random() * 1.5).toFixed(2);
                          
                          // Verificar se já apostou nesse jogo
                          const existingBet = bets.find(bet => bet.fixtureId === fixture.fixture_id);
                          
                          const handleBet = (betType: string, odd: string) => {
                            if (existingBet) return;
                            
                            const betAmount = 50; // Valor fixo por agora
                            if (walletBalance < betAmount) {
                              alert('Saldo insuficiente!');
                              return;
                            }
                            
                            // Verificar se segue predição
                            const followsPrediction = prediction && (
                              (betType === 'home' && prediction.predicted_result === 'HOME') ||
                              (betType === 'draw' && prediction.predicted_result === 'DRAW') ||
                              (betType === 'away' && prediction.predicted_result === 'AWAY')
                            );
                            
                            // Determinar resultado da aposta
                            let result: 'win' | 'loss' = 'loss';
                            let profit = -betAmount;
                            
                            if (betType === 'home' && homeWins) {
                              result = 'win';
                              profit = betAmount * (parseFloat(odd) - 1);
                            } else if (betType === 'draw' && isDraw) {
                              result = 'win';
                              profit = betAmount * (parseFloat(odd) - 1);
                            } else if (betType === 'away' && awayWins) {
                              result = 'win';
                              profit = betAmount * (parseFloat(odd) - 1);
                            }
                            
                            // Criar nova aposta
                            const newBet: Bet = {
                              id: Date.now().toString(),
                              fixtureId: fixture.fixture_id,
                              matchName: `${fixture.home_team_name} vs ${fixture.away_team_name}`,
                              betType: 'match_winner',
                              betOption: betType === 'home' ? fixture.home_team_name : betType === 'away' ? fixture.away_team_name : 'Empate',
                              odd: parseFloat(odd),
                              amount: betAmount,
                              result,
                              profit,
                              date: new Date(),
                              followedPrediction: followsPrediction,
                              predictionConfidence: prediction?.confidence
                            };
                            
                            setBets(prev => [newBet, ...prev]);
                            setWalletBalance(prev => prev + profit);
                            
                            // Atualizar estatísticas de predição
                            if (followsPrediction) {
                              setPredictionBasedBets(prev => prev + 1);
                              if (result === 'win') {
                                setPredictionBasedWins(prev => prev + 1);
                              }
                            }
                          };
                          
                          // Função para determinar a cor da predição baseada na confiança
                          const getPredictionColor = (confidence: number) => {
                            if (confidence >= 0.7) return 'success';
                            if (confidence >= 0.5) return 'warning';
                            return 'info';
                          };
                          
                          return (
                            <TableRow key={fixture.fixture_id} hover>
                              <TableCell>
                                <Typography variant="body2">
                                  {new Date(fixture.date).toLocaleDateString('pt-BR')}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" fontWeight="medium">
                                    {fixture.home_team_name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    vs
                                  </Typography>
                                  <Typography variant="body2" fontWeight="medium">
                                    {fixture.away_team_name}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  variant={existingBet?.betOption === fixture.home_team_name ? "contained" : "outlined"}
                                  color={existingBet?.betOption === fixture.home_team_name ? 
                                    (existingBet.result === 'win' ? 'success' : 'error') : 
                                    (prediction?.predicted_result === 'HOME' ? 'success' : 'primary')}
                                  size="small"
                                  onClick={() => handleBet('home', homeOdd)}
                                  disabled={!!existingBet}
                                  sx={{ 
                                    minWidth: '60px',
                                    border: prediction?.predicted_result === 'HOME' ? '2px solid' : undefined,
                                    fontWeight: prediction?.predicted_result === 'HOME' ? 'bold' : 'normal'
                                  }}
                                  endIcon={prediction?.predicted_result === 'HOME' ? '⭐' : undefined}
                                >
                                  {homeOdd}
                                </Button>
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  variant={existingBet?.betOption === 'Empate' ? "contained" : "outlined"}
                                  color={existingBet?.betOption === 'Empate' ? 
                                    (existingBet.result === 'win' ? 'success' : 'error') : 
                                    (prediction?.predicted_result === 'DRAW' ? 'success' : 'primary')}
                                  size="small"
                                  onClick={() => handleBet('draw', drawOdd)}
                                  disabled={!!existingBet}
                                  sx={{ 
                                    minWidth: '60px',
                                    border: prediction?.predicted_result === 'DRAW' ? '2px solid' : undefined,
                                    fontWeight: prediction?.predicted_result === 'DRAW' ? 'bold' : 'normal'
                                  }}
                                  endIcon={prediction?.predicted_result === 'DRAW' ? '⭐' : undefined}
                                >
                                  {drawOdd}
                                </Button>
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  variant={existingBet?.betOption === fixture.away_team_name ? "contained" : "outlined"}
                                  color={existingBet?.betOption === fixture.away_team_name ? 
                                    (existingBet.result === 'win' ? 'success' : 'error') : 
                                    (prediction?.predicted_result === 'AWAY' ? 'success' : 'primary')}
                                  size="small"
                                  onClick={() => handleBet('away', awayOdd)}
                                  disabled={!!existingBet}
                                  sx={{ 
                                    minWidth: '60px',
                                    border: prediction?.predicted_result === 'AWAY' ? '2px solid' : undefined,
                                    fontWeight: prediction?.predicted_result === 'AWAY' ? 'bold' : 'normal'
                                  }}
                                  endIcon={prediction?.predicted_result === 'AWAY' ? '⭐' : undefined}
                                >
                                  {awayOdd}
                                </Button>
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
                              <TableCell align="center">
                                {prediction ? (
                                  <Stack spacing={1} alignItems="center">
                                    <Chip
                                      label={prediction.predicted_result === 'HOME' ? 'Casa' : 
                                            prediction.predicted_result === 'AWAY' ? 'Fora' : 'Empate'}
                                      size="small"
                                      color={getPredictionColor(prediction.confidence)}
                                      variant={prediction.is_correct === true ? "filled" : "outlined"}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      {(prediction.confidence * 100).toFixed(0)}%
                                    </Typography>
                                    {prediction.is_correct !== null && (
                                      <Chip
                                        label={prediction.is_correct ? "✓" : "✗"}
                                        size="small"
                                        color={prediction.is_correct ? "success" : "error"}
                                      />
                                    )}
                                  </Stack>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    Sem predição
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {existingBet && (
                                  <Chip
                                    label={`${existingBet.result === 'win' ? '+' : '-'}R$ ${Math.abs(existingBet.profit || 0).toFixed(2)}`}
                                    size="small"
                                    color={existingBet.result === 'win' ? 'success' : 'error'}
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </PageContainer>
  );
}
