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
import VirtualWallet from "./components/VirtualWallet";
import MetricsDashboard from "@/app/components/prediction/MetricsDashboard";
import { Prediction, ValidationResult, PredictionModel } from "@/utils/prediction/types";
import { SportsFootball } from "@mui/icons-material";

// Tipos
interface League {
  league_id: number;
  league_name: string;
  id: number;
  name: string;
}

interface Fixture {
  fixture_id: number;
  home_team_name: string;
  away_team_name: string;
  date: string;
  goals_home: number | null;
  goals_away: number | null;
  status_long: string;
  status_short: string;
  round_name: string;
}

interface SimulationBet {
  id: string;
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  matchName: string;
  betType: string;
  betOption: string;
  odd: number;
  amount: number;
  profit: number;
  result: 'win' | 'loss';
  betDate: Date;
  date: Date;
  isBasedOnPrediction: boolean;
}

interface WalletStats {
  totalBets: number;
  winningBets: number;
  totalProfit: number;
  winRate: number;
}

const BCrumb = [
  { to: "/", title: "Dashboard" },
  { title: "Simular Apostar" },
];

export default function SimularApostarPage() {
  // Estados básicos
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [seasons, setSeasons] = useState<number[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  const [loading, setLoading] = useState<{
    leagues: boolean;
    seasons: boolean;
    fixtures: boolean;
    predictions: boolean;
  }>({
    leagues: false,
    seasons: false,
    fixtures: false,
    predictions: false,
  });
  const [error, setError] = useState<string>("");

  // Estados da carteira virtual
  const [walletBalance, setWalletBalance] = useState<number>(1000); // Saldo inicial
  const [bets, setBets] = useState<SimulationBet[]>([]);
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

  // Handler para seleção de liga
  const handleLeagueChange = (event: SelectChangeEvent) => {
    setSelectedLeague(event.target.value);
    setSelectedSeason("");
    setSeasons([]);
    setFixtures([]);
  };

  // Handler para seleção de temporada
  const handleSeasonChange = (event: SelectChangeEvent) => {
    setSelectedSeason(event.target.value);
    setFixtures([]);
  };

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
        // Aceita tanto { data: [...] } quanto array direto
        let leaguesData = [];
        if (Array.isArray(responseData)) {
          leaguesData = responseData;
        } else if (Array.isArray(responseData.data)) {
          leaguesData = responseData.data;
        } else {
          leaguesData = [];
        }
        setLeagues(leaguesData);
      } catch (error: any) {
        console.error("Erro ao buscar ligas:", error);
        setError("Erro ao carregar ligas. Tente novamente.");
        setLeagues([]);
      } finally {
        setLoading((prev) => ({ ...prev, leagues: false }));
      }
    };

    fetchLeagues();
  }, []);

  // Buscar temporadas quando uma liga é selecionada
  useEffect(() => {
    if (!selectedLeague) return;

    const fetchSeasons = async () => {
      setLoading((prev) => ({ ...prev, seasons: true }));
      setError("");
      try {
        const response = await fetch(`/api/leagues/${selectedLeague}/seasons`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar temporadas: ${response.status}`);
        }
        const responseData = await response.json();
        let seasonsData = [];
        if (Array.isArray(responseData)) {
          seasonsData = responseData;
        } else if (Array.isArray(responseData.data)) {
          seasonsData = responseData.data;
        } else {
          seasonsData = [];
        }
        setSeasons(seasonsData);
      } catch (error: any) {
        console.error("Erro ao buscar temporadas:", error);
        setError("Erro ao carregar temporadas. Tente novamente.");
        setSeasons([]);
      } finally {
        setLoading((prev) => ({ ...prev, seasons: false }));
      }
    };

    fetchSeasons();
  }, [selectedLeague]);

  // Buscar fixtures quando liga e temporada são selecionadas
  useEffect(() => {
    if (!selectedLeague || !selectedSeason) return;
    const fetchFixtures = async () => {
      setLoading((prev) => ({ ...prev, fixtures: true }));
      setError("");
      try {
        const response = await fetch(`/api/leagues/${selectedLeague}/seasons/${selectedSeason}/fixtures`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar partidas: ${response.status}`);
        }
        const responseData = await response.json();
        let fixturesData = [];
        if (Array.isArray(responseData)) {
          fixturesData = responseData;
        } else if (Array.isArray(responseData.data)) {
          fixturesData = responseData.data;
        } else {
          fixturesData = [];
        }
        setFixtures(fixturesData);
      } catch (error: any) {
        console.error("Erro ao buscar partidas:", error);
        setError("Erro ao carregar partidas. Tente novamente.");
        setFixtures([]);
      } finally {
        setLoading((prev) => ({ ...prev, fixtures: false }));
      }
    };
    fetchFixtures();
  }, [selectedLeague, selectedSeason]);

  // Função para iniciar análise de predições
  const startPredictionAnalysis = async () => {
    if (!selectedLeague || !selectedSeason) return;

    setIsAnalyzing(true);
    setError("");

    try {
      // Iniciar análise
      const response = await fetch('/api/prediction/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          league_id: parseInt(selectedLeague),
          season_year: parseInt(selectedSeason),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na análise: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Aguardar alguns segundos e buscar resultados
        setTimeout(async () => {
          await fetchPredictions();
          await fetchValidationResults();
        }, 2000);
      } else {
        throw new Error(result.error || 'Erro desconhecido na análise');
      }
    } catch (error: any) {
      console.error("Erro na análise:", error);
      setError("Erro ao gerar predições. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Buscar predições
  const fetchPredictions = async () => {
    if (!selectedLeague || !selectedSeason) return;

    setLoading((prev) => ({ ...prev, predictions: true }));

    try {
      const response = await fetch(`/api/prediction/predictions?league_id=${selectedLeague}&season_year=${selectedSeason}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar predições: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setPredictions(result.data);
        setShowPredictions(true);
      }
    } catch (error: any) {
      console.error("Erro ao buscar predições:", error);
    } finally {
      setLoading((prev) => ({ ...prev, predictions: false }));
    }
  };

  // Buscar resultados de validação
  const fetchValidationResults = async () => {
    if (!selectedLeague || !selectedSeason) return;

    try {
      const response = await fetch(`/api/prediction/validation?league_id=${selectedLeague}&season_year=${selectedSeason}`);
      
      if (!response.ok) {
        return; // Validação é opcional
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setValidationResult(result.data);
      }
    } catch (error: any) {
      console.error("Erro ao buscar validação:", error);
      // Validação é opcional, não mostrar erro
    }
  };

  // Atualizar estatísticas da carteira
  useEffect(() => {
    const totalBets = bets.length;
    const winningBets = bets.filter(bet => bet.result === 'win').length;
    const totalProfit = bets.reduce((sum, bet) => sum + bet.profit, 0);
    const winRate = totalBets > 0 ? winningBets / totalBets : 0;

    setWalletStats({
      totalBets,
      winningBets,
      totalProfit,
      winRate,
    });
  }, [bets]);

  // Função para fazer apostas (implementação básica)
  const handleBet = (fixture: Fixture, betType: string, odd: string) => {
    const prediction = predictions.find(p => p.fixture_id === fixture.fixture_id);
    const existingBet = bets.find(bet => bet.fixtureId === fixture.fixture_id);
    
    if (existingBet) return;
    
    const betAmount = 50; // Valor fixo por simplicidade
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

    // Simular resultado da aposta baseado no resultado real
    const homeWins = fixture.goals_home !== null && fixture.goals_away !== null && fixture.goals_home > fixture.goals_away;
    const awayWins = fixture.goals_home !== null && fixture.goals_away !== null && fixture.goals_away > fixture.goals_home;
    const isDraw = fixture.goals_home !== null && fixture.goals_away !== null && fixture.goals_home === fixture.goals_away;

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

    const newBet: SimulationBet = {
      id: Date.now().toString(),
      fixtureId: fixture.fixture_id,
      homeTeam: fixture.home_team_name,
      awayTeam: fixture.away_team_name,
      matchName: `${fixture.home_team_name} vs ${fixture.away_team_name}`,
      betType: betType,
      betOption: betType === 'home' ? fixture.home_team_name : betType === 'away' ? fixture.away_team_name : 'Empate',
      odd: parseFloat(odd),
      amount: betAmount,
      profit,
      result,
      betDate: new Date(),
      date: new Date(),
      isBasedOnPrediction: followsPrediction || false,
    };

    setBets(prev => [...prev, newBet]);
    setWalletBalance(prev => prev + profit);

    if (followsPrediction) {
      setPredictionBasedBets(prev => prev + 1);
      if (result === 'win') {
        setPredictionBasedWins(prev => prev + 1);
      }
    }
  };

  return (
    <PageContainer title="Simular Apostar" description="Simule apostas com IA">
      <Breadcrumb title="Simular Apostar" items={BCrumb} />
      
      <Stack spacing={3}>
        {/* Carteira Virtual */}
        <VirtualWallet 
          balance={walletBalance}
          stats={walletStats}
          recentBets={bets.slice(-5).reverse()}
          predictionBasedBets={predictionBasedBets}
          predictionBasedWins={predictionBasedWins}
          onResetWallet={() => {
            setWalletBalance(1000);
            setBets([]);
            setPredictionBasedBets(0);
            setPredictionBasedWins(0);
          }}
        />

        {/* Filtros */}
        <Paper elevation={0} sx={{ p: 3 }}>
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
                  value={selectedLeague}
                  label="Liga"
                  onChange={handleLeagueChange}
                  disabled={loading.leagues}
                >
                  {leagues.map((league) => (
                    <MenuItem key={league.league_id} value={league.league_id.toString()}>
                      {league.league_name || league.name}
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
                disabled={!selectedLeague}
                error={!!error && error.includes("temporadas") && !loading.seasons}
              >
                <InputLabel id="season-select-label">Temporada</InputLabel>
                <Select
                  labelId="season-select-label"
                  value={selectedSeason}
                  label="Temporada"
                  onChange={handleSeasonChange}
                  disabled={loading.seasons}
                >
                  {seasons.map((season) => (
                    <MenuItem key={season} value={season.toString()}>
                      {season}
                    </MenuItem>
                  ))}
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

        {/* Sistema de Predição */}
        {selectedLeague && selectedSeason && (
          <Paper elevation={0} sx={{ p: 3 }}>
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
              
              {/* Mensagem sobre predições */}
              {showPredictions && predictions.length > 0 && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>{predictions.length} predições</strong> foram geradas e estão sendo exibidas na tabela abaixo. 
                    As apostas recomendadas pela IA são marcadas com ⭐ e destacadas em verde.
                  </Typography>
                </Alert>
              )}
            </Stack>
          </Paper>
        )}

        {/* Área Principal */}
        <Paper elevation={0} sx={{ p: 3 }}>
          {/* Mensagem de erro */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Mensagem instrutiva */}
          {!selectedLeague && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Selecione uma liga para começar
            </Alert>
          )}
          
          {selectedLeague && !selectedSeason && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Selecione uma temporada
            </Alert>
          )}

          {/* Loading de fixtures */}
          {loading.fixtures && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Stack spacing={2} alignItems="center">
                <CircularProgress size={48} />
                <Typography variant="body2" color="text.secondary">
                  Carregando partidas...
                </Typography>
              </Stack>
            </Box>
          )}

          {/* Tabela de jogos */}
          {fixtures.length > 0 && !loading.fixtures && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Partidas da Temporada {selectedSeason}
                </Typography>
                
                {/* Resumo das predições */}
                {predictions.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<SportsFootball />}
                      label={`${predictions.length} predições`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                    {validationResult && (
                      <>
                        <Chip
                          label={`${(validationResult.accuracy * 100).toFixed(1)}% precisão`}
                          color="success"
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          label={`${validationResult.correct_predictions}/${validationResult.total_matches} acertos`}
                          color="info"
                          variant="outlined"
                          size="small"
                        />
                      </>
                    )}
                  </Box>
                )}
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Time Casa</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Casa</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Empate</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Fora</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Time Visitante</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Resultado</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 140 }}>
                        <Stack spacing={0.5} alignItems="center">
                          <Typography variant="body2" fontWeight="bold">
                            Predição IA
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            (⭐ = Recomendado)
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fixtures.map((fixture, index) => {
                      // Lógica da predição seria implementada aqui
                      const prediction = predictions.find(p => p.fixture_id === fixture.fixture_id);
                      
                      // Simulação de resultado
                      const homeWins = fixture.goals_home !== null && fixture.goals_away !== null && fixture.goals_home > fixture.goals_away;
                      const awayWins = fixture.goals_home !== null && fixture.goals_away !== null && fixture.goals_away > fixture.goals_home;
                      const isDraw = fixture.goals_home !== null && fixture.goals_away !== null && fixture.goals_home === fixture.goals_away;
                      
                      // Gerar odds simuladas
                      const homeOdd = homeWins ? (1.5 + Math.random() * 0.8).toFixed(2) : (2.2 + Math.random() * 1.5).toFixed(2);
                      const drawOdd = isDraw ? (3.0 + Math.random() * 0.5).toFixed(2) : (3.2 + Math.random() * 1.0).toFixed(2);
                      const awayOdd = awayWins ? (1.5 + Math.random() * 0.8).toFixed(2) : (2.2 + Math.random() * 1.5).toFixed(2);
                      
                      const existingBet = bets.find(bet => bet.fixtureId === fixture.fixture_id) as SimulationBet | undefined;
                      
                      return (
                        <TableRow key={fixture.fixture_id}>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(fixture.date).toLocaleDateString('pt-BR')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {fixture.home_team_name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant={existingBet?.betOption === fixture.home_team_name ? "contained" : "outlined"}
                              color={existingBet?.betOption === fixture.home_team_name ? 
                                (existingBet.result === 'win' ? 'success' : 'error') : 
                                (prediction?.predicted_result === 'HOME' ? 'success' : 'primary')}
                              size="small"
                              disabled={!!existingBet}
                              sx={{ 
                                minWidth: '70px',
                                border: prediction?.predicted_result === 'HOME' ? '2px solid' : undefined,
                                fontWeight: prediction?.predicted_result === 'HOME' ? 'bold' : 'normal',
                                backgroundColor: prediction?.predicted_result === 'HOME' && !existingBet ? 'success.50' : undefined,
                                '&:hover': {
                                  backgroundColor: prediction?.predicted_result === 'HOME' ? 'success.100' : undefined
                                }
                              }}
                              startIcon={prediction?.predicted_result === 'HOME' ? '⭐' : undefined}
                              onClick={() => handleBet(fixture, 'home', homeOdd)}
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
                              disabled={!!existingBet}
                              sx={{ 
                                minWidth: '70px',
                                border: prediction?.predicted_result === 'DRAW' ? '2px solid' : undefined,
                                fontWeight: prediction?.predicted_result === 'DRAW' ? 'bold' : 'normal',
                                backgroundColor: prediction?.predicted_result === 'DRAW' && !existingBet ? 'success.50' : undefined,
                                '&:hover': {
                                  backgroundColor: prediction?.predicted_result === 'DRAW' ? 'success.100' : undefined
                                }
                              }}
                              startIcon={prediction?.predicted_result === 'DRAW' ? '⭐' : undefined}
                              onClick={() => handleBet(fixture, 'draw', drawOdd)}
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
                              disabled={!!existingBet}
                              sx={{ 
                                minWidth: '70px',
                                border: prediction?.predicted_result === 'AWAY' ? '2px solid' : undefined,
                                fontWeight: prediction?.predicted_result === 'AWAY' ? 'bold' : 'normal',
                                backgroundColor: prediction?.predicted_result === 'AWAY' && !existingBet ? 'success.50' : undefined,
                                '&:hover': {
                                  backgroundColor: prediction?.predicted_result === 'AWAY' ? 'success.100' : undefined
                                }
                              }}
                              startIcon={prediction?.predicted_result === 'AWAY' ? '⭐' : undefined}
                              onClick={() => handleBet(fixture, 'away', awayOdd)}
                            >
                              {awayOdd}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {fixture.away_team_name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {fixture.goals_home !== null && fixture.goals_away !== null ? (
                              <Chip 
                                label={`${fixture.goals_home} - ${fixture.goals_away}`}
                                size="small"
                                color={
                                  homeWins ? 'primary' : 
                                  awayWins ? 'secondary' : 
                                  'default'
                                }
                              />
                            ) : (
                              <Chip 
                                label={fixture.status_short}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {prediction ? (
                              <Stack spacing={1} alignItems="center" sx={{ minWidth: 120 }}>
                                {/* Resultado da predição */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip
                                    label={prediction.predicted_result === 'HOME' ? 'Casa' : 
                                          prediction.predicted_result === 'AWAY' ? 'Fora' : 'Empate'}
                                    size="small"
                                    color={
                                      prediction.is_correct === true ? 'success' :
                                      prediction.is_correct === false ? 'error' :
                                      'primary'
                                    }
                                    variant={prediction.is_correct !== undefined ? "filled" : "outlined"}
                                    sx={{ 
                                      fontWeight: 'bold',
                                      minWidth: 60
                                    }}
                                  />
                                  {/* Ícone de acerto/erro */}
                                  {prediction.is_correct === true && (
                                    <Box sx={{ color: 'success.main', fontSize: '16px' }}>✓</Box>
                                  )}
                                  {prediction.is_correct === false && (
                                    <Box sx={{ color: 'error.main', fontSize: '16px' }}>✗</Box>
                                  )}
                                </Box>
                                
                                {/* Confiança */}
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                  Confiança: {(prediction.confidence * 100).toFixed(0)}%
                                </Typography>
                                
                                {/* Status adicional */}
                                {fixture.goals_home !== null && fixture.goals_away !== null && (
                                  <Typography 
                                    variant="caption" 
                                    color={prediction.is_correct === true ? 'success.main' : 
                                           prediction.is_correct === false ? 'error.main' : 'text.secondary'}
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {prediction.is_correct === true ? 'Acertou!' : 
                                     prediction.is_correct === false ? 'Errou' : 'Pendente'}
                                  </Typography>
                                )}
                              </Stack>
                            ) : (
                              <Stack spacing={1} alignItems="center">
                                <Typography variant="caption" color="text.secondary">
                                  Sem predição
                                </Typography>
                                <SportsFootball sx={{ color: 'text.disabled', fontSize: 20 }} />
                              </Stack>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Stack>
    </PageContainer>
  );
}
