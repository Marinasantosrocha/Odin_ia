import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  Badge
} from '@mui/material';
import LiveMatchTable from './LiveMatchTable';

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
      const response = await fetch(`/api/live/events-api?fixture=${fixtureId}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar eventos: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data && Array.isArray(data.data)) {
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
      
      {/* Tabela única com todas as partidas */}
      <LiveMatchTable
        matches={liveMatches}
        matchEvents={eventsMap}
        onFetchEvents={fetchEvents}
      />
    </Box>
  );
};

export default LiveMatchesList;
