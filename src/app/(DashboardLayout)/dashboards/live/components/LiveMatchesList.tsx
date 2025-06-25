import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LiveMatchCard from './LiveMatchCard';

interface LiveFixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number | null;
      name: string | null;
      city: string | null;
    };
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
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
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
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

interface FixtureEvent {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number;
    name: string;
  };
  assist: {
    id: number | null;
    name: string | null;
  };
  type: string;
  detail: string;
  comments: string | null;
}

interface LiveMatchesListProps {
  selectedLeague?: number | null;
}

const LiveMatchesList: React.FC<LiveMatchesListProps> = ({ selectedLeague }) => {
  const [liveMatches, setLiveMatches] = useState<LiveFixture[]>([]);
  const [eventsMap, setEventsMap] = useState<Record<number, FixtureEvent[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLeagues, setExpandedLeagues] = useState<Record<number, boolean>>({});

  // Função para buscar partidas ao vivo
  const fetchLiveMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = '/api/live';
      if (selectedLeague) {
        url += `?league=${selectedLeague}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar partidas ao vivo: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setLiveMatches(data.data);
        
        // Inicializa o estado de expansão para cada liga
        try {
          // Garante que todos os itens em data.data são do tipo LiveFixture
          const validMatches = data.data.filter((match: any) => 
            match && match.league && typeof match.league.id === 'number'
          );
          
          // Extrai os IDs de liga únicos de forma segura
          const leagueIds: number[] = [];
          validMatches.forEach((match: any) => {
            if (match && match.league && typeof match.league.id === 'number' && !leagueIds.includes(match.league.id)) {
              leagueIds.push(match.league.id);
            }
          });
          
          // Cria o objeto de estado inicial
          const initialExpandedState: Record<number, boolean> = {};
          leagueIds.forEach(id => {
            initialExpandedState[id] = true;
          });
          
          // Atualiza o estado
          setExpandedLeagues(initialExpandedState);
        } catch (err) {
          console.error("Erro ao processar dados das ligas:", err);
          // Em caso de erro, define um objeto vazio
          setExpandedLeagues({});
        }
      } else {
        setLiveMatches([]);
      }
    } catch (error) {
      console.error("Erro ao buscar partidas ao vivo:", error);
      setError("Não foi possível carregar as partidas ao vivo. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar eventos de uma partida específica
  const fetchEvents = async (fixtureId: number) => {
    try {
      const response = await fetch(`/api/live/events?fixture=${fixtureId}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar eventos: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setEventsMap(prev => ({
          ...prev,
          [fixtureId]: data.data
        }));
      }
    } catch (error) {
      console.error(`Erro ao buscar eventos para a partida ${fixtureId}:`, error);
    }
  };

  // Efeito para buscar partidas ao vivo quando o componente é montado ou quando a liga selecionada muda
  useEffect(() => {
    fetchLiveMatches();
    
    // Configurar intervalo para atualizar os dados a cada 60 segundos
    const intervalId = setInterval(() => {
      fetchLiveMatches();
    }, 60000);
    
    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [selectedLeague]);

  // Função para agrupar partidas por liga
  const groupMatchesByLeague = (matches: LiveFixture[]) => {
    try {
      const grouped: Record<number, { league: LiveFixture['league'], matches: LiveFixture[] }> = {};
      
      // Filtra partidas inválidas
      const validMatches = matches.filter(match => 
        match && match.league && typeof match.league.id === 'number'
      );
      
      validMatches.forEach(match => {
        const leagueId = match.league.id;
        
        if (!grouped[leagueId]) {
          grouped[leagueId] = {
            league: match.league,
            matches: []
          };
        }
        
        grouped[leagueId].matches.push(match);
      });
      
      return Object.values(grouped);
    } catch (error) {
      console.error("Erro ao agrupar partidas por liga:", error);
      return []; // Retorna array vazio em caso de erro
    }
  };

  // Função para alternar a expansão de uma liga
  const toggleLeagueExpansion = (leagueId: number) => {
    setExpandedLeagues(prev => ({
      ...prev,
      [leagueId]: !prev[leagueId]
    }));
  };

  // Renderizar o conteúdo com base no estado de carregamento e erro
  if (loading && liveMatches.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (liveMatches.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Não há partidas ao vivo no momento.
      </Alert>
    );
  }

  const groupedMatches = groupMatchesByLeague(liveMatches);

  return (
    <Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Badge 
            badgeContent="Atualizando..." 
            color="primary"
            sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem', height: 'auto', padding: '0 6px' } }}
          >
            <CircularProgress size={20} />
          </Badge>
        </Box>
      )}
      
      {groupedMatches.map(({ league, matches }) => (
        <Accordion 
          key={league.id}
          expanded={expandedLeagues[league.id] || false}
          onChange={() => toggleLeagueExpansion(league.id)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Avatar src={league.logo} alt={league.name} sx={{ width: 32, height: 32, mr: 2 }} />
              <Box>
                <Typography variant="subtitle1">{league.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {league.country} • {matches.length} {matches.length === 1 ? 'partida' : 'partidas'} ao vivo
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {matches.map((match) => (
                <LiveMatchCard 
                  key={match.fixture.id} 
                  match={match} 
                  events={eventsMap[match.fixture.id]} 
                  onFetchEvents={fetchEvents}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default LiveMatchesList;
