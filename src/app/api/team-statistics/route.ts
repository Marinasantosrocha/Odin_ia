import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const leagueId = searchParams.get('leagueId');
    const teamIds = searchParams.get('teamIds')?.split(',');
    const date = searchParams.get('date');

    if (!leagueId || !teamIds || !date) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: leagueId, teamIds, date' },
        { status: 400 }
      );
    }
    
    // Validar e formatar a data para o formato do PostgreSQL
    let formattedDate: string;
    try {
      // Verifica se a data já está no formato do banco de dados
      const dateRegex = /^\d{4}-\d{2}-\d{2}/;
      if (!dateRegex.test(date)) {
        throw new Error('Formato de data inválido');
      }
      
      // Se a data não tiver hora, adiciona 00:00:00 para comparação
      if (!date.includes(':')) {
        formattedDate = `${date} 00:00:00-03`;
      } else {
        formattedDate = date;
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Formato de data inválido. Use o formato YYYY-MM-DD' },
        { status: 400 }
      );
    }
    
    console.log('Buscando estatísticas dos times com parâmetros:', {
      leagueId,
      teamIds,
      date: formattedDate
    });

    // Buscar estatísticas dos times na tabela team_statistics
    // para a data da partida ou a data mais próxima
    const queryText = `
      WITH team_stats AS (
        SELECT
          ts.team_id,
          t.name as team_name,
          ts.league_id,
          ts.season_year,
          ts.fixture_date,
          ts.form,
          ts.fixtures_played_home,
          ts.fixtures_played_away,
          ts.fixtures_played_total as jogos,
          ts.fixtures_wins_home,
          ts.fixtures_wins_away,
          ts.fixtures_wins_total as vitorias,
          ts.fixtures_draws_home,
          ts.fixtures_draws_away,
          ts.fixtures_draws_total as empates,
          ts.fixtures_loses_home,
          ts.fixtures_loses_away,
          ts.fixtures_loses_total as derrotas,
          ts.goals_for_total_home,
          ts.goals_for_total_away,
          ts.goals_for_total_total as gols_marcados,
          ts.goals_for_avg_home,
          ts.goals_for_avg_away,
          ts.goals_for_avg_total as media_gols_marcados,
          ts.goals_against_total_home,
          ts.goals_against_total_away,
          ts.goals_against_total_total as gols_sofridos,
          ts.goals_against_avg_home,
          ts.goals_against_avg_away,
          ts.goals_against_avg_total as media_gols_sofridos,
          ts.clean_sheet_total as clean_sheets,
          ts.failed_to_score_total as failed_to_score,
          ts.penalty_scored_total,
          ts.penalty_scored_percentage,
          ts.penalty_missed_total,
          ts.penalty_missed_percentage,
          ts.penalty_total,
          ts.most_used_formation,
          ts.biggest_win_home,
          ts.biggest_win_away,
          ts.biggest_lose_home,
          ts.biggest_lose_away,
          ts.biggest_goals_for_home,
          ts.biggest_goals_for_away,
          ts.biggest_goals_against_home,
          ts.biggest_goals_against_away,
          (ts.goals_for_total_total - ts.goals_against_total_total) as saldo_gols,
          (ts.fixtures_wins_total * 3 + ts.fixtures_draws_total) as pontos,
          -- Calcular a diferença em dias entre a data da partida e a data da estatística
          ABS(EXTRACT(EPOCH FROM ($2::timestamp with time zone - ts.fixture_date::timestamp with time zone)) / 86400) as dias_diferenca,
          -- Classificar as estatísticas por proximidade da data (mais próxima primeiro)
          -- e apenas para datas anteriores ou iguais à data da partida
          ROW_NUMBER() OVER (
            PARTITION BY ts.team_id 
            ORDER BY 
              CASE WHEN ts.fixture_date <= $2::timestamp with time zone::date THEN 0 ELSE 1 END, -- Priorizar datas anteriores ou iguais
              ABS(EXTRACT(EPOCH FROM ($2::timestamp with time zone - ts.fixture_date::timestamp with time zone)) / 86400) -- Ordenar pela proximidade da data
          ) as rank
        FROM
          team_statistics ts
        JOIN
          teams t ON ts.team_id = t.team_id
        WHERE
          ts.league_id = $1
          AND ts.team_id = ANY($3)
          -- Considerar apenas estatísticas até a data da partida
          AND ts.fixture_date <= $2::timestamp with time zone::date
      )
      -- Selecionar apenas a estatística mais próxima da data da partida para cada time
      SELECT
        team_id,
        team_name,
        jogos,
        vitorias,
        empates,
        derrotas,
        gols_marcados,
        gols_sofridos,
        saldo_gols,
        pontos,
        clean_sheets,
        failed_to_score,
        fixtures_played_home,
        fixtures_played_away,
        fixtures_wins_home,
        fixtures_wins_away,
        fixtures_draws_home,
        fixtures_draws_away,
        fixtures_loses_home,
        fixtures_loses_away,
        goals_for_total_home,
        goals_for_total_away,
        goals_against_total_home,
        goals_against_total_away,
        goals_for_avg_home,
        goals_for_avg_away,
        goals_against_avg_home,
        goals_against_avg_away,
        penalty_scored_total,
        penalty_scored_percentage,
        penalty_missed_total,
        penalty_missed_percentage,
        penalty_total,
        most_used_formation,
        biggest_win_home,
        biggest_win_away,
        biggest_lose_home,
        biggest_lose_away,
        biggest_goals_for_home,
        biggest_goals_for_away,
        biggest_goals_against_home,
        biggest_goals_against_away,
        media_gols_marcados,
        media_gols_sofridos,
        form as forma,
        fixture_date as data_estatistica,
        dias_diferenca
      FROM
        team_stats
      WHERE
        rank = 1
      ORDER BY
        pontos DESC;
    `;
    
    console.log('Executando consulta SQL:', queryText);
    console.log('Parâmetros:', [leagueId, formattedDate, teamIds]);
    
    const result = await query(queryText, [parseInt(leagueId), formattedDate, teamIds]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos times:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas dos times' },
      { status: 500 }
    );
  }
}