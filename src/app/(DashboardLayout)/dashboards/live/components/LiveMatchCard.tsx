import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Collapse,
  Stack,
  Paper,
  Badge,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsIcon from '@mui/icons-material/Sports';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import H2HDisplay from './H2HDisplay';
import OddsDisplay from './OddsDisplay';

interface LiveMatchCardProps {
  match: {
    fixture: {
      id: number;
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
      round: string;
    };
    teams: {
      home: {
        id: number;
        name: string;
        logo: string;
      };
      away: {
        id: number;
        name: string;
        logo: string;
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
    };
  };
  events?: Array<{
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
  }>;
  onFetchEvents: (fixtureId: number) => void;
}

const LiveMatchCard: React.FC<LiveMatchCardProps> = ({ match, events, onFetchEvents }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [h2hData, setH2hData] = useState<any[] | null>(null);
  const [h2hLoading, setH2hLoading] = useState(false);
  const [h2hError, setH2hError] = useState<string | null>(null);
  const [oddsData, setOddsData] = useState<any[] | null>(null);
  const [oddsLoading, setOddsLoading] = useState(false);
  const [oddsError, setOddsError] = useState<string | null>(null);

  const handleExpandClick = () => {
    if (!expanded) {
      onFetchEvents(match.fixture.id);
    }
    setExpanded(!expanded);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    
    // Buscar H2H quando a aba for selecionada
    if (newValue === 1 && !h2hData && !h2hLoading) {
      fetchH2HData();
    }
    
    // Buscar odds quando a aba for selecionada
    if (newValue === 2 && !oddsData && !oddsLoading) {
      fetchOddsData();
    }
  };

  const fetchH2HData = async () => {
    setH2hLoading(true);
    setH2hError(null);
    
    try {
      const response = await fetch(`/api/live/h2h-api?team1=${match.teams.home.id}&team2=${match.teams.away.id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar H2H: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setH2hData(data.data);
      } else {
        setH2hError('Dados de H2H não disponíveis');
      }
    } catch (error) {
      console.error('Erro ao buscar H2H:', error);
      setH2hError('Erro ao carregar histórico de confrontos');
    } finally {
      setH2hLoading(false);
    }
  };

  const fetchOddsData = async () => {
    setOddsLoading(true);
    setOddsError(null);
    
    try {
      const response = await fetch(`/api/live/odds-api?fixture=${match.fixture.id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar odds: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setOddsData(data.data);
      } else {
        setOddsError('Odds não disponíveis para esta partida');
      }
    } catch (error) {
      console.error('Erro ao buscar odds:', error);
      setOddsError('Erro ao carregar odds da partida');
    } finally {
      setOddsLoading(false);
    }
  };

  // Função para determinar a cor do chip de status
  const getStatusColor = (status: string) => {
    switch (status) {
      case '1H':
        return 'success';
      case 'HT':
        return 'warning';
      case '2H':
        return 'success';
      case 'ET':
        return 'error';
      case 'BT':
        return 'warning';
      case 'P':
        return 'error';
      case 'SUSP':
        return 'error';
      case 'INT':
        return 'error';
      case 'FT':
        return 'default';
      default:
        return 'default';
    }
  };
  
  // Função para obter a descrição completa do status
  const getStatusDescription = (status: string) => {
    switch (status) {
      case '1H':
        return 'Primeiro Tempo';
      case 'HT':
        return 'Intervalo';
      case '2H':
        return 'Segundo Tempo';
      case 'ET':
        return 'Prorrogação';
      case 'BT':
        return 'Intervalo da Prorrogação';
      case 'P':
        return 'Pênaltis';
      case 'SUSP':
        return 'Partida Suspensa';
      case 'INT':
        return 'Partida Interrompida';
      case 'FT':
        return 'Partida Finalizada';
      case 'AET':
        return 'Finalizada após Prorrogação';
      case 'PEN':
        return 'Finalizada após Pênaltis';
      case 'CANC':
        return 'Partida Cancelada';
      case 'ABD':
        return 'Partida Abandonada';
      case 'AWD':
        return 'Decisão Técnica';
      case 'WO':
        return 'WO';
      case 'LIVE':
        return 'Ao Vivo';
      default:
        return status;
    }
  };

  // Função para renderizar o ícone do evento com tooltip
  const renderEventIcon = (type: string, detail: string) => {
    let icon;
    let tooltipText = '';
    
    if (type === 'Goal') {
      icon = <SportsSoccerIcon color="success" />;
      tooltipText = detail === 'Normal Goal' ? 'Gol' : 
                  detail === 'Own Goal' ? 'Gol Contra' : 
                  detail === 'Penalty' ? 'Gol de Pênalti' : 
                  'Gol';
    } else if (type === 'Card') {
      if (detail === 'Yellow Card') {
        icon = <CardGiftcardIcon sx={{ color: '#FFC107' }} />;
        tooltipText = 'Cartão Amarelo';
      } else {
        icon = <CardGiftcardIcon sx={{ color: '#F44336' }} />;
        tooltipText = 'Cartão Vermelho';
      }
    } else if (type === 'subst') {
      icon = <SubdirectoryArrowRightIcon color="info" />;
      tooltipText = 'Substituição';
    } else {
      icon = <SportsIcon />;
      tooltipText = type;
    }
    
    return (
      <Tooltip title={tooltipText}>
        <Box sx={{ cursor: 'help' }}>{icon}</Box>
      </Tooltip>
    );
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        position: 'relative',
        borderLeft: '5px solid',
        borderLeftColor: `${getStatusColor(match.fixture.status.short) === 'success' ? 'success.main' : 
                          getStatusColor(match.fixture.status.short) === 'warning' ? 'warning.main' : 
                          getStatusColor(match.fixture.status.short) === 'error' ? 'error.main' : 
                          'grey.400'}`
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Cabeçalho com informações da liga */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar 
            src={match.league.logo} 
            alt={match.league.name} 
            sx={{ width: 24, height: 24, mr: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            {match.league.name} • {match.league.country} • {match.league.round}
          </Typography>
        </Box>

        {/* Conteúdo principal com times e placar */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '5fr 2fr 5fr', gap: 1, alignItems: 'center' }}>
          {/* Time da casa */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Typography variant="body1" fontWeight="medium" textAlign="right" mr={1}>
              {match.teams.home.name}
            </Typography>
            <Avatar 
              src={match.teams.home.logo} 
              alt={match.teams.home.name} 
              sx={{ width: 32, height: 32 }}
            />
          </Box>

          {/* Placar */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {match.goals && typeof match.goals.home !== 'undefined' ? match.goals.home : 0} - 
              {match.goals && typeof match.goals.away !== 'undefined' ? match.goals.away : 0}
            </Typography>
            
            {match.score && match.score.halftime && 
             match.score.halftime.home !== null && 
             match.score.halftime.away !== null && (
              <Typography variant="caption" color="text.secondary">
                HT: {match.score.halftime.home} - {match.score.halftime.away}
              </Typography>
            )}
            
            <Tooltip title={match.fixture && match.fixture.status ? getStatusDescription(match.fixture.status.short) : 'Status desconhecido'}>
              <Chip 
                label={match.fixture && match.fixture.status && match.fixture.status.elapsed ? 
                  `${match.fixture.status.elapsed}'` : 
                  (match.fixture && match.fixture.status ? match.fixture.status.short : 'LIVE')} 
                size="small" 
                color={match.fixture && match.fixture.status ? getStatusColor(match.fixture.status.short) as any : 'default'}
                sx={{ 
                  position: 'absolute', 
                  top: -20, 
                  minWidth: 45,
                  height: 20,
                  '& .MuiChip-label': {
                    px: 1,
                    fontSize: '0.625rem',
                  },
                  cursor: 'help'
                }}
              />
            </Tooltip>
          </Box>

          {/* Time visitante */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={match.teams.away.logo} 
              alt={match.teams.away.name} 
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Typography variant="body1" fontWeight="medium">
              {match.teams.away.name}
            </Typography>
          </Box>
        </Box>

        {/* Botão para expandir/recolher */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <IconButton 
            onClick={handleExpandClick}
            size="small"
            sx={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
          >
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
      </CardContent>

      {/* Conteúdo expandido com abas */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Box sx={{ width: '100%' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            centered
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label="Eventos" 
              sx={{ minHeight: 48 }}
            />
            <Tab 
              label="H2H" 
              sx={{ minHeight: 48 }}
            />
            <Tab 
              label="Odds" 
              sx={{ minHeight: 48 }}
            />
          </Tabs>
          
          <CardContent>
            {/* Aba de Eventos */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Eventos da Partida
                </Typography>
                
                {events && events.length > 0 ? (
                  <Stack spacing={1}>
                    {events.map((event, index) => (
                      <Paper 
                        key={index} 
                        elevation={0} 
                        sx={{ 
                          p: 1, 
                          backgroundColor: 'background.default',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Badge 
                          badgeContent={`${event.time.elapsed}'${event.time.extra ? '+' + event.time.extra : ''}`} 
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          {renderEventIcon(event.type, event.detail)}
                        </Badge>
                        
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="body2">
                            <strong>{event.player.name}</strong> 
                            {event.type === 'Goal' && ' ⚽ marcou um gol'}
                            {event.type === 'Card' && event.detail === 'Yellow Card' && ' recebeu cartão amarelo'}
                            {event.type === 'Card' && event.detail === 'Red Card' && ' recebeu cartão vermelho'}
                            {event.type === 'subst' && ' substituído'}
                          </Typography>
                          
                          {event.assist && event.assist.name && (
                            <Typography variant="caption" color="text.secondary">
                              Assistência: {event.assist.name}
                            </Typography>
                          )}
                          
                          {event.type === 'subst' && (
                            <Typography variant="caption" color="text.secondary">
                              Entrou: {event.assist?.name || 'Jogador não informado'}
                            </Typography>
                          )}
                        </Box>
                        
                        <Box sx={{ ml: 'auto' }}>
                          <Avatar 
                            src={event.team.logo} 
                            alt={event.team.name} 
                            sx={{ width: 20, height: 20 }}
                          />
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Nenhum evento registrado para esta partida.
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Aba de H2H */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Histórico de Confrontos
                </Typography>
                
                <H2HDisplay
                  h2hData={h2hData}
                  loading={h2hLoading}
                  error={h2hError}
                  currentMatch={match}
                />
              </Box>
            )}
            
            {/* Aba de Odds */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Odds da Partida
                </Typography>
                
                <OddsDisplay
                  oddsData={oddsData}
                  loading={oddsLoading}
                  error={oddsError}
                  currentMatch={match}
                />
              </Box>
            )}
          </CardContent>
        </Box>
      </Collapse>
    </Card>
  );
};

export default LiveMatchCard;
