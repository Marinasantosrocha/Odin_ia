import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Tooltip,
  Avatar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface OddsDisplayProps {
  oddsData: any[] | null;
  loading: boolean;
  error: string | null;
  currentMatch: any;
}

const OddsDisplay: React.FC<OddsDisplayProps> = ({ oddsData, loading, error, currentMatch }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ ml: 2, mt: 1 }}>
          Carregando odds ao vivo...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Erro ao carregar odds: {error}
        </Typography>
      </Alert>
    );
  }

  if (!oddsData || oddsData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <AttachMoneyIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Odds não disponíveis para esta partida
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          As odds podem não estar disponíveis para partidas em andamento
        </Typography>
      </Box>
    );
  }

  // Função para renderizar as odds de um mercado específico
  const renderMarketOdds = (bet: any) => {
    if (!bet.values || bet.values.length === 0) return null;

    return (
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mb: 2,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          {bet.name}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {bet.values.map((value: any, index: number) => {
            let chipColor: any = 'default';
            let icon: React.ReactElement | undefined = undefined;
            
            // Definir cores e ícones baseados no valor
            if (bet.name === 'Match Winner') {
              if (value.value === '1') {
                chipColor = 'primary';
                icon = <EmojiEventsIcon sx={{ fontSize: 16 }} />;
              } else if (value.value === 'X') {
                chipColor = 'warning';
              } else if (value.value === '2') {
                chipColor = 'secondary';
                icon = <EmojiEventsIcon sx={{ fontSize: 16 }} />;
              }
            } else if (bet.name === 'Both Teams Score') {
              chipColor = value.value === 'Yes' ? 'success' : 'error';
            } else {
              chipColor = 'info';
            }

            return (
              <Box key={index} sx={{ flex: '1 1 calc(33.333% - 8px)', minWidth: '120px' }}>
                <Tooltip title={`${bet.name}: ${value.value}`}>
                  <Chip
                    icon={icon}
                    label={
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 0.5 }}>
                        <Typography variant="caption" fontWeight="bold">
                          {value.value}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {value.odd}
                        </Typography>
                      </Box>
                    }
                    color={chipColor}
                    variant="outlined"
                    sx={{ 
                      height: 'auto',
                      width: '100%',
                      '& .MuiChip-label': {
                        display: 'block',
                        width: '100%'
                      }
                    }}
                  />
                </Tooltip>
              </Box>
            );
          })}
        </Box>
      </Paper>
    );
  };

  // Função para obter o texto do valor da aposta
  const getBetValueText = (betName: string, value: string) => {
    if (betName === 'Match Winner') {
      if (value === '1') return currentMatch.teams.home.name;
      if (value === 'X') return 'Empate';
      if (value === '2') return currentMatch.teams.away.name;
    }
    return value;
  };

  return (
    <Box>
      {oddsData.map((oddsItem, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          {oddsItem.bookmakers && oddsItem.bookmakers.length > 0 ? (
            oddsItem.bookmakers.map((bookmaker: any, bmIndex: number) => (
              <Accordion key={bmIndex} defaultExpanded={bmIndex === 0}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: 'action.hover',
                    borderRadius: '4px 4px 0 0',
                    '&.Mui-expanded': {
                      backgroundColor: 'primary.lighter'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUpIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight="medium">
                      {bookmaker.bookmaker.name}
                    </Typography>
                    <Chip 
                      label={`${bookmaker.bets?.length || 0} mercados`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  <Stack spacing={2}>
                    {bookmaker.bets && bookmaker.bets.length > 0 ? (
                      bookmaker.bets.map((bet: any, betIndex: number) => (
                        <Box key={betIndex}>
                          {renderMarketOdds(bet)}
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Nenhum mercado disponível para este bookmaker
                      </Typography>
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Nenhum bookmaker disponível
            </Typography>
          )}
        </Box>
      ))}
      
      {oddsData.length > 0 && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
            📊 Odds fornecidas em tempo real pela API-Football
          </Typography>
          <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
            ⚠️ As odds podem variar conforme a partida progride
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OddsDisplay;
