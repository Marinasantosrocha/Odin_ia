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
  Grid,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  Divider
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import type { SelectChangeEvent } from "@mui/material/Select";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import LiveMatchesList from "./components/LiveMatchesList";

// Tipos
interface League {
  league_id: number;
  name: string;
  logo_url?: string;
}

// Configuração de navegação
const BCrumb = [
  { to: "/", title: "Dashboard" },
  { title: "Ao Vivo" },
];

export default function Live() {
  // Estados
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Buscar ligas ao carregar o componente
  useEffect(() => {
    const fetchLeagues = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };
    
    fetchLeagues();
  }, []);

  // Marcar como montado no cliente para evitar erro de hidratação
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Manipulador de mudança de liga
  const handleLeagueChange = (event: SelectChangeEvent) => {
    setSelectedLeague(event.target.value);
    setLastUpdate(new Date());
  };

  // Função para formatar a data da última atualização
  const formatLastUpdate = () => {
    if (!isMounted) {
      return '--:--:--';
    }
    return lastUpdate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Função para atualizar manualmente os dados
  const handleRefresh = () => {
    setRefreshing(true);
    setLastUpdate(new Date());
    
    // Forçar a atualização dos dados da API adicionando o parâmetro refresh=true
    fetch('/api/live?refresh=true')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao atualizar dados: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Erro ao atualizar dados:', error);
        // Não exibir o erro para o usuário, apenas registrar no console
      })
      .finally(() => {
        // Simular um pequeno atraso para feedback visual
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
      });
  };

  return (
    <PageContainer title="Partidas Ao Vivo" description="Acompanhe as partidas em tempo real">
      <Box>
        <Breadcrumb title="Partidas Ao Vivo" items={BCrumb} />
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Partidas Ao Vivo</Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="caption" color="text.secondary" mr={1}>
                Última atualização: {formatLastUpdate()}
              </Typography>
              <Tooltip title="Atualizar dados">
                <IconButton 
                  size="small" 
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshIcon 
                    fontSize="small" 
                    sx={{ 
                      animation: refreshing ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': {
                        '0%': {
                          transform: 'rotate(0deg)',
                        },
                        '100%': {
                          transform: 'rotate(360deg)',
                        },
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
            <Box>
              <FormControl fullWidth size="small">
                <InputLabel id="league-select-label">Liga</InputLabel>
                <Select
                  labelId="league-select-label"
                  id="league-select"
                  value={selectedLeague}
                  label="Liga"
                  onChange={handleLeagueChange}
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Todas as ligas</em>
                  </MenuItem>
                  {leagues.map((league) => (
                    <MenuItem key={league.league_id} value={league.league_id.toString()}>
                      {league.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box mt={3}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Os dados são atualizados automaticamente a cada 60 segundos. Você também pode atualizar manualmente clicando no botão de atualização.
              <Box display="flex" alignItems="center" mt={1} justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Última atualização: {formatLastUpdate()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Clique nos cards das partidas para ver os eventos detalhados.
                </Typography>
              </Box>
            </Alert>
            
            <LiveMatchesList 
              selectedLeague={selectedLeague ? parseInt(selectedLeague, 10) : null} 
            />
          </Box>
        </Paper>
      </Box>
    </PageContainer>
  );
}
