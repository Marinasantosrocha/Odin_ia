"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Popover,
  Paper
} from "@mui/material";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

interface Standing {
  standing_id: number;
  league_id: number;
  season_year: number;
  team_id: number;
  team_name: string;
  team_logo: string;
  rank: number;
  points: number;
  goals_diff: number;
  group_name: string | null;
  form: string | null;
  status: string | null;
  description: string | null;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals_for: number;
  goals_against: number;
  last_update: string | null;
}

interface StandingsTooltipProps {
  leagueId: number;
  seasonYear: string;
  teamIds?: number[]; // IDs dos times para destacar
}

const StandingsTooltip: React.FC<StandingsTooltipProps> = ({ leagueId, seasonYear, teamIds = [] }) => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    
    // Só carrega os dados quando o popover é aberto
    if (!standings.length && !loading) {
      fetchStandings();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'standings-popover' : undefined;

  const fetchStandings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/leagues/${leagueId}/seasons/${seasonYear}/standings`);
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        setStandings(data.data);
      }
      setLoading(false);
    } catch (error) {
      setError('Erro ao carregar classificação');
      console.error('Erro ao carregar classificação:', error);
      setLoading(false);
    }
  };

  // Renderizar forma do time com ícones coloridos
  const renderForm = (form: string | null) => {
    if (!form) return null;
    
    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {form.split('').map((result, index) => {
          let bgColor = '#9e9e9e'; // Cor padrão para casos não mapeados
          let icon = '?';
          
          if (result === 'W') {
            bgColor = '#4caf50'; // Verde para vitória
            icon = '✓'; // Ícone de check
          } else if (result === 'D') {
            bgColor = '#ff9800'; // Laranja para empate
            icon = '='; 
          } else if (result === 'L') {
            bgColor = '#f44336'; // Vermelho para derrota
            icon = '✖'; // Ícone de X
          }
          
          return (
            <Tooltip key={index} title={result === 'W' ? 'Vitória' : result === 'D' ? 'Empate' : 'Derrota'}>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  borderRadius: '50%', 
                  bgcolor: bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '10px'
                }}
              >
                {icon}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  return (
    <>
      <Tooltip title="Ver tabela de classificação">
        <IconButton 
          aria-describedby={id} 
          onClick={handleClick}
          size="small"
          sx={{ 
            color: 'primary.main',
            bgcolor: 'rgba(25, 118, 210, 0.08)',
            '&:hover': {
              bgcolor: 'rgba(25, 118, 210, 0.15)',
            }
          }}
        >
          <LeaderboardIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          '& .MuiPopover-paper': {
            width: 'auto',
            maxWidth: '90vw',
            maxHeight: '80vh',
          }
        }}
      >
        <Paper sx={{ p: 2, maxWidth: 700 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Tabela de Classificação
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px" width="100%">
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : standings.length === 0 ? (
            <Typography variant="body2" align="center" sx={{ py: 3 }}>
              Nenhuma classificação encontrada para esta liga e temporada
            </Typography>
          ) : (
            <TableContainer sx={{ maxHeight: '60vh' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 40, p: 1 }}>
                      <Tooltip title="Posição">
                        <Typography variant="caption">#</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 150, p: 1 }}>Time</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 40, p: 1 }}>
                      <Tooltip title="Jogos">
                        <Typography variant="caption">J</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 40, p: 1 }}>
                      <Tooltip title="Vitórias">
                        <Typography variant="caption">V</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 40, p: 1 }}>
                      <Tooltip title="Empates">
                        <Typography variant="caption">E</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 40, p: 1 }}>
                      <Tooltip title="Derrotas">
                        <Typography variant="caption">D</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 40, p: 1 }}>
                      <Tooltip title="Gols Marcados">
                        <Typography variant="caption">GM</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 40, p: 1 }}>
                      <Tooltip title="Gols Sofridos">
                        <Typography variant="caption">GS</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 40, p: 1 }}>
                      <Tooltip title="Saldo de Gols">
                        <Typography variant="caption">SG</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: 40, p: 1 }}>
                      <Tooltip title="Pontos">
                        <Typography variant="caption">Pts</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 100, p: 1 }}>
                      <Tooltip title="Últimos 5 jogos">
                        <Typography variant="caption">Forma</Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {standings.map((standing) => (
                    <TableRow 
                      key={standing.standing_id}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                        backgroundColor: teamIds.includes(standing.team_id) ? 'rgba(25, 118, 210, 0.08)' : undefined,
                        fontWeight: teamIds.includes(standing.team_id) ? 'bold' : 'normal'
                      }}
                    >
                      <TableCell align="center" sx={{ p: 1 }}>
                        <Typography variant="caption">{standing.rank}</Typography>
                      </TableCell>
                      <TableCell sx={{ p: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {standing.team_logo && (
                            <Box 
                              component="img" 
                              src={standing.team_logo} 
                              alt={standing.team_name}
                              sx={{ width: 20, height: 20, objectFit: 'contain' }}
                            />
                          )}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: teamIds.includes(standing.team_id) ? 'bold' : 'normal',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {standing.team_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ p: 1 }}>
                        <Typography variant="caption">{standing.played}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ p: 1 }}>
                        <Typography variant="caption">{standing.win}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ p: 1 }}>
                        <Typography variant="caption">{standing.draw}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ p: 1 }}>
                        <Typography variant="caption">{standing.lose}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ p: 1 }}>
                        <Typography variant="caption">{standing.goals_for}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ p: 1 }}>
                        <Typography variant="caption">{standing.goals_against}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ p: 1 }}>
                        <Typography variant="caption">{standing.goals_diff}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ p: 1, fontWeight: 'medium' }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{standing.points}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ p: 1 }}>
                        {renderForm(standing.form)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Popover>
    </>
  );
};

export default StandingsTooltip;
