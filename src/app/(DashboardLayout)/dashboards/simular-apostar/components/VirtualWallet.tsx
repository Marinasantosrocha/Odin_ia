import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

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
}

interface WalletStats {
  totalBets: number;
  winningBets: number;
  totalProfit: number;
  winRate: number;
}

interface VirtualWalletProps {
  balance: number;
  stats: WalletStats;
  recentBets: Bet[];
  onResetWallet: () => void;
}

const VirtualWallet: React.FC<VirtualWalletProps> = ({
  balance,
  stats,
  recentBets,
  onResetWallet,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Layout Horizontal */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr',
          sm: 'auto 1fr auto auto',
          md: 'auto 1fr auto auto auto'
        },
        gap: 3,
        alignItems: 'center',
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        
        {/* Cabeçalho com Saldo */}
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content' }}>
          <WalletIcon color="primary" sx={{ mr: 1 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold" noWrap>
              {formatCurrency(balance)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Saldo disponível
            </Typography>
          </Box>
        </Box>

        {/* Estatísticas */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, 
          gap: 2,
          minWidth: 0
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              {stats.totalBets}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Apostas
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              {stats.winningBets}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Ganhas
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              fontWeight="bold"
              color={stats.totalProfit >= 0 ? 'success.main' : 'error.main'}
            >
              {formatCurrency(stats.totalProfit)}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Lucro
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              {stats.winRate.toFixed(0)}%
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Taxa
            </Typography>
          </Box>
        </Box>

        {/* Última Aposta */}
        <Box sx={{ minWidth: 'fit-content', display: { xs: 'none', md: 'block' } }}>
          {recentBets.length > 0 ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                fontWeight="bold"
                color={recentBets[0].result === 'win' ? 'success.main' : 'error.main'}
              >
                {formatCurrency(recentBets[0].profit || 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                Última aposta
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                -
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                Última aposta
              </Typography>
            </Box>
          )}
        </Box>

        {/* Botão Reset */}
        <Box sx={{ minWidth: 'fit-content' }}>
          <Tooltip title="Resetar carteira">
            <IconButton onClick={onResetWallet} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      
      {/* Apostas Recentes - Seção colapsível para mobile */}
      {recentBets.length > 0 && (
        <Box sx={{ mt: 2, display: { xs: 'block', md: 'none' } }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Apostas Recentes
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 2 }
          }}>
            {recentBets.slice(0, 3).map((bet) => (
              <Box 
                key={bet.id}
                sx={{ 
                  minWidth: 120,
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  textAlign: 'center'
                }}
              >
                <Typography 
                  variant="caption" 
                  fontWeight="bold"
                  color={bet.result === 'win' ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(bet.profit || 0)}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary" noWrap>
                  {bet.betOption}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VirtualWallet;
