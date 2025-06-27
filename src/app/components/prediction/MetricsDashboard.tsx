import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  CheckCircle,
  Sports
} from '@mui/icons-material';
import { ValidationResult, PredictionModel } from '@/utils/prediction/types';

interface MetricsDashboardProps {
  validationResult: ValidationResult;
  accuracy: number;
  totalPredictions: number;
  correctPredictions: number;
  validation?: ValidationResult;
  model?: PredictionModel | null;
}

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  validationResult,
  accuracy,
  totalPredictions,
  correctPredictions,
  validation,
  model
}) => {
  // Use validationResult se fornecido, senão use validation para retrocompatibilidade
  const resultData = validationResult || validation;
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.6) return '#4caf50'; // Verde
    if (accuracy >= 0.5) return '#ff9800'; // Laranja
    return '#f44336'; // Vermelho
  };

  const getAccuracyLabel = (accuracy: number) => {
    if (accuracy >= 0.6) return 'Excelente';
    if (accuracy >= 0.5) return 'Bom';
    if (accuracy >= 0.4) return 'Regular';
    return 'Baixo';
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <Analytics color="primary" />
          <Typography variant="h6">Métricas de Performance</Typography>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Precisão Geral */}
          <Box flex={1}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight="bold" 
                sx={{ color: getAccuracyColor(resultData?.accuracy || 0) }}>
                {Math.round((resultData?.accuracy || 0) * 100)}%
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Precisão Geral
              </Typography>
              <Chip 
                label={getAccuracyLabel(resultData?.accuracy || 0)}
                size="small"
                sx={{ 
                  bgcolor: getAccuracyColor(resultData?.accuracy || 0),
                  color: 'white'
                }}
              />
            </Box>
          </Box>

          {/* Partidas Analisadas */}
          <Box flex={1}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="primary">
                {totalPredictions || resultData?.total_matches || 0}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Partidas Analisadas
              </Typography>
              <Typography variant="body2" color="success.main">
                <CheckCircle sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                {correctPredictions || resultData?.correct_predictions || 0} acertos
              </Typography>
            </Box>
          </Box>

          {/* Correlação de Confiança */}
          <Box flex={1}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="secondary">
                {Math.round((resultData?.confidence_correlation || 0) * 100)}%
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Correlação Confiança
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Qualidade das predições
              </Typography>
            </Box>
          </Box>

          {/* Status do Modelo */}
          <Box flex={1}>
            <Box textAlign="center">
              <Sports color="info" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Status do Modelo
              </Typography>
              <Chip 
                label={model ? 'Ativo' : 'Inativo'}
                size="small"
                color={model ? 'success' : 'default'}
              />
            </Box>
          </Box>
        </Stack>

        {/* Precisão por Tipo de Resultado */}
        <Box mt={4}>
          <Typography variant="subtitle1" gutterBottom>
            Precisão por Tipo de Resultado
          </Typography>
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Box flex={1}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Vitória em Casa</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {Math.round((resultData?.precision_by_outcome?.home_win || 0) * 100)}%
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={(resultData?.precision_by_outcome?.home_win || 0) * 100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': { bgcolor: '#1976d2' }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {resultData?.precision_by_outcome?.home_win !== undefined ? 
                    `Baseado em dados reais` : 
                    'Dados não disponíveis'
                  }
                </Typography>
              </Box>
            </Box>

            <Box flex={1}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Empate</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {Math.round((resultData?.precision_by_outcome?.draw || 0) * 100)}%
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={(resultData?.precision_by_outcome?.draw || 0) * 100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': { bgcolor: '#ed6c02' }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {resultData?.precision_by_outcome?.draw !== undefined ? 
                    `Baseado em dados reais` : 
                    'Dados não disponíveis'
                  }
                </Typography>
              </Box>
            </Box>

            <Box flex={1}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Vitória Fora</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {Math.round((resultData?.precision_by_outcome?.away_win || 0) * 100)}%
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={(resultData?.precision_by_outcome?.away_win || 0) * 100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': { bgcolor: '#d32f2f' }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {resultData?.precision_by_outcome?.away_win !== undefined ? 
                    `Baseado em dados reais` : 
                    'Dados não disponíveis'
                  }
                </Typography>
              </Box>
            </Box>
          </Stack>
          
          {/* Informação adicional sobre os dados */}
          {(!resultData?.precision_by_outcome || 
            (resultData.precision_by_outcome.home_win === 0 && 
             resultData.precision_by_outcome.draw === 0 && 
             resultData.precision_by_outcome.away_win === 0)) && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
              <Typography variant="caption" color="warning.main">
                ⚠️ Os dados de precisão por tipo de resultado serão calculados após a conclusão das partidas analisadas.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Informações do Modelo */}
        {model && (
          <Box mt={4}>
            <Typography variant="subtitle1" gutterBottom>
              Informações do Modelo
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">Liga</Typography>
                <Typography variant="body2" fontWeight="bold">{model.league_id}</Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">Temporada</Typography>
                <Typography variant="body2" fontWeight="bold">{model.season_year}</Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">Taxa de Vitória Casa</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {Math.round(model.patterns.home_win_rate * 100)}%
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">Gols/Partida</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {model.patterns.avg_goals_per_match.toFixed(1)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsDashboard;
