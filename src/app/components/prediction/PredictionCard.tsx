import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Stack,
  Divider,
  Tooltip
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Help,
  TrendingUp,
  Home,
  SportsFootball
} from '@mui/icons-material';
import { Prediction } from '@/utils/prediction/types';

interface PredictionCardProps {
  prediction: Prediction;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  matchDate: string;
  compact?: boolean;
}

const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  homeTeamName,
  awayTeamName,
  homeTeamLogo,
  awayTeamLogo,
  matchDate,
  compact = false
}) => {
  const getResultColor = (result: string) => {
    switch (result) {
      case 'HOME': return '#1976d2';
      case 'AWAY': return '#d32f2f';
      case 'DRAW': return '#ed6c02';
      default: return '#757575';
    }
  };

  const getResultIcon = () => {
    if (prediction.actual_result === null) {
      return <Help color="disabled" />;
    }
    return prediction.is_correct ? 
      <CheckCircle sx={{ color: '#4caf50' }} /> : 
      <Cancel sx={{ color: '#f44336' }} />;
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'HOME': return homeTeamName;
      case 'AWAY': return awayTeamName;
      case 'DRAW': return 'Empate';
      default: return 'N/A';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (compact) {
    return (
      <Card variant="outlined" sx={{ mb: 1 }}>
        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {formatDate(matchDate)}
              </Typography>
              <Typography variant="body2" noWrap>
                {homeTeamName} vs {awayTeamName}
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={getResultText(prediction.predicted_result)}
                size="small"
                sx={{ 
                  bgcolor: getResultColor(prediction.predicted_result),
                  color: 'white',
                  fontSize: '0.7rem'
                }}
              />
              
              <Tooltip title={
                prediction.actual_result ? 
                  `${prediction.is_correct ? 'Correto' : 'Incorreto'} - Real: ${getResultText(prediction.actual_result)}` :
                  'Aguardando resultado'
              }>
                <Box>{getResultIcon()}</Box>
              </Tooltip>
              
              <Typography variant="caption" sx={{ minWidth: 35, textAlign: 'center' }}>
                {Math.round(prediction.confidence * 100)}%
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        {/* Header com times e data */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {homeTeamName} vs {awayTeamName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(matchDate)}
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1} alignItems="center">
            {getResultIcon()}
            <Typography variant="body2" color="text.secondary">
              {prediction.actual_result ? 
                `${prediction.is_correct ? 'Acertou' : 'Errou'}` : 
                'Pendente'
              }
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Predição */}
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Predição: <strong style={{ color: getResultColor(prediction.predicted_result) }}>
              {getResultText(prediction.predicted_result)}
            </strong>
          </Typography>
          
          {prediction.actual_result && (
            <Typography variant="body2" color="text.secondary">
              Resultado Real: <strong>{getResultText(prediction.actual_result)}</strong>
            </Typography>
          )}
        </Box>

        {/* Probabilidades */}
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>Probabilidades</Typography>
          
          <Stack spacing={1}>
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">
                  <Home sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  {homeTeamName}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {Math.round(prediction.probabilities.home_win * 100)}%
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={prediction.probabilities.home_win * 100}
                sx={{ height: 6, borderRadius: 3, bgcolor: '#e0e0e0' }}
              />
            </Box>

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">
                  <SportsFootball sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  Empate
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {Math.round(prediction.probabilities.draw * 100)}%
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={prediction.probabilities.draw * 100}
                sx={{ 
                  height: 6, 
                  borderRadius: 3, 
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': { bgcolor: '#ed6c02' }
                }}
              />
            </Box>

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">
                  <TrendingUp sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  {awayTeamName}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {Math.round(prediction.probabilities.away_win * 100)}%
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={prediction.probabilities.away_win * 100}
                sx={{ 
                  height: 6, 
                  borderRadius: 3, 
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': { bgcolor: '#d32f2f' }
                }}
              />
            </Box>
          </Stack>
        </Box>

        {/* Confiança e Fatores */}
        <Stack direction="row" spacing={2}>
          <Box flex={1}>
            <Typography variant="subtitle2" gutterBottom>
              Confiança: {Math.round(prediction.confidence * 100)}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={prediction.confidence * 100}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': { bgcolor: '#4caf50' }
              }}
            />
          </Box>
          
          <Box>
            <Typography variant="caption" color="text.secondary">
              Forma Casa: {Math.round(prediction.factors.home_form * 100)}%
            </Typography>
            <br />
            <Typography variant="caption" color="text.secondary">
              Forma Fora: {Math.round(prediction.factors.away_form * 100)}%
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
