import React from 'react';
import { Box, Tooltip } from '@mui/material';

interface TeamFormProps {
  form: string; // Ex: "WWLDW"
  teamName: string;
}

const TeamForm: React.FC<TeamFormProps> = ({ form, teamName }) => {
  if (!form || form === '') {
    return (
      <Box sx={{ display: 'flex', gap: 0.3, justifyContent: 'center' }}>
        <span style={{ color: '#666', fontSize: '12px' }}>-</span>
      </Box>
    );
  }

  // Converter string de form em array de resultados
  const results = form.split('').slice(-5); // Últimos 5 jogos

  const getResultColor = (result: string) => {
    switch (result.toUpperCase()) {
      case 'W': return '#4CAF50'; // Verde para vitória
      case 'L': return '#F44336'; // Vermelho para derrota
      case 'D': return '#FF9800'; // Laranja para empate
      default: return '#9E9E9E'; // Cinza para indefinido
    }
  };

  const getResultText = (result: string) => {
    switch (result.toUpperCase()) {
      case 'W': return 'Vitória';
      case 'L': return 'Derrota';
      case 'D': return 'Empate';
      default: return 'Indefinido';
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 0.3, justifyContent: 'center' }}>
      {results.map((result, index) => (
        <Tooltip 
          key={index} 
          title={`${teamName} - ${getResultText(result)} (${index + 1}º jogo mais recente)`}
          arrow
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: getResultColor(result),
              cursor: 'help',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
};

interface LastGamesDisplayProps {
  homeTeam: {
    id: number;
    name: string;
    form?: string;
  };
  awayTeam: {
    id: number;
    name: string;
    form?: string;
  };
}

const LastGamesDisplay: React.FC<LastGamesDisplayProps> = ({ homeTeam, awayTeam }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 0.5 }}>
      {/* Últimos jogos do time da casa */}
      <TeamForm form={homeTeam.form || ''} teamName={homeTeam.name} />
      
      {/* Últimos jogos do time visitante */}
      <TeamForm form={awayTeam.form || ''} teamName={awayTeam.name} />
    </Box>
  );
};

export default LastGamesDisplay;
