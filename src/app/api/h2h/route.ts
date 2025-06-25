import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface H2HFixture {
  fixture_id: number;
  date: string;  // Corrigido: era fixture_date
  home_team_id: number;
  away_team_id: number;
  home_team_name: string;
  away_team_name: string;
  goals_home: number;
  goals_away: number;
  status_short: string;
}

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Obter e validar parâmetros obrigatórios
    const leagueId = searchParams.get('leagueId');
    const team1Id = searchParams.get('team1Id');
    const team2Id = searchParams.get('team2Id');
    const fixtureDate = searchParams.get('fixtureDate');
    
    // Verificar se todos os parâmetros obrigatórios estão presentes
    if (!team1Id || !team2Id || !fixtureDate) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios ausentes: team1Id, team2Id, fixtureDate' },
        { status: 400 }
      );
    }
    
    // Converter para números
    const leagueIdNum = parseInt(leagueId || '0', 10);
    const team1IdNum = parseInt(team1Id, 10);
    const team2IdNum = parseInt(team2Id, 10);
    
    if (isNaN(leagueIdNum) || isNaN(team1IdNum) || isNaN(team2IdNum)) {
      return NextResponse.json(
        { error: 'IDs fornecidos são inválidos' },
        { status: 400 }
      );
    }
    
    // Validar e formatar a data para o formato do PostgreSQL
    let formattedDate: string;
    try {
      // Verifica se a data já está no formato do banco de dados
      const dateRegex = /^\d{4}-\d{2}-\d{2}/;
      if (!dateRegex.test(fixtureDate)) {
        throw new Error('Formato de data inválido');
      }
      
      // Se a data não tiver hora, adiciona 00:00:00 para comparação
      if (!fixtureDate.includes(':')) {
        formattedDate = `${fixtureDate} 00:00:00-03`;
      } else {
        formattedDate = fixtureDate;
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Formato de data inválido. Use o formato YYYY-MM-DD' },
        { status: 400 }
      );
    }
    
    // Consulta SQL para buscar os últimos 5 confrontos entre os times
    // Excluindo a partida atual e considerando apenas partidas anteriores à data fornecida
    // Construir a consulta SQL dinamicamente para evitar problemas com o tipo de dados
    const queryText = `
      SELECT 
        f.fixture_id,
        f.date,
        f.home_team_id,
        f.away_team_id,
        ht.name as home_team_name,
        at.name as away_team_name,
        f.goals_home,
        f.goals_away,
        f.status_short
      FROM 
        fixtures f
      JOIN 
        teams ht ON f.home_team_id = ht.team_id
      JOIN 
        teams at ON f.away_team_id = at.team_id
      WHERE 
        f.league_id = $1
        AND (
          (f.home_team_id = $2 AND f.away_team_id = $3)
          OR 
          (f.home_team_id = $3 AND f.away_team_id = $2)
        )
        AND f.date < $4::timestamp with time zone
      ORDER BY 
        f.date DESC
      LIMIT 5`;

    console.log('Executando consulta H2H com parâmetros:', {
      leagueId: leagueIdNum,
      team1Id: team1IdNum,
      team2Id: team2IdNum,
      fixtureDate: formattedDate,
      query: queryText
    });

    console.log('Executando consulta SQL:', queryText);
    console.log('Parâmetros:', [leagueIdNum, team1IdNum, team2IdNum, formattedDate]);
    
    const result = await query<H2HFixture>(queryText, [
      leagueIdNum, 
      team1IdNum, 
      team2IdNum, 
      formattedDate
    ]);
    
    console.log('Resultado da consulta:', result.rows);
    
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error('Erro ao buscar dados H2H:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação H2H' },
      { status: 500 }
    );
  }
}
