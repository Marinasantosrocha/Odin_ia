import { NextRequest, NextResponse } from 'next/server';
import { HistoricalAnalyzer } from '@/utils/prediction/HistoricalAnalyzer';
import { redisCache } from '@/utils/cache/RedisCache';
import { MatchData, Prediction, AnalysisProgress } from '@/utils/prediction/types';
import { query } from '@/lib/db';

interface AnalyzeRequest {
  league_id: number;
  season_year: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { league_id: leagueId, season_year: seasonYear } = body;

    if (!leagueId || !seasonYear) {
      return NextResponse.json(
        { success: false, error: 'ID da liga e ano da temporada são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se já existe análise em cache
    const existingModel = await redisCache.getModel(leagueId, seasonYear);
    if (existingModel) {
      const existingPredictions = await redisCache.getAllPredictions(leagueId, seasonYear);
      return NextResponse.json({
        success: true,
        message: 'Análise já realizada (cache)',
        model: existingModel,
        predictions: existingPredictions,
        fromCache: true
      });
    }

    // Buscar todas as partidas da temporada
    const matchesResult = await query<MatchData>(`
      SELECT 
        f.fixture_id, 
        f.date, 
        f.status_long, 
        f.status_short,
        f.home_team_id,
        f.away_team_id,
        home.name AS home_team_name,
        away.name AS away_team_name,
        home.logo_url AS home_team_logo,
        away.logo_url AS away_team_logo,
        f.goals_home,
        f.goals_away,
        f.round AS round_id,
        COALESCE(fr.round_name, CONCAT('Rodada ', f.round)) AS round_name,
        COALESCE(fr.is_current, false) AS is_current_round,
        f.league_id,
        f.season_year
      FROM 
        fixtures f
      JOIN 
        teams home ON f.home_team_id = home.team_id
      JOIN 
        teams away ON f.away_team_id = away.team_id
      LEFT JOIN
        fixture_rounds fr ON f.round = fr.round_id 
        AND f.league_id = fr.league_id 
        AND CAST(f.season_year AS VARCHAR) = fr.season
      WHERE 
        f.league_id = $1 AND 
        f.season_year = $2
      ORDER BY 
        f.date ASC
    `, [leagueId, seasonYear]);

    if (!matchesResult.rows || matchesResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nenhuma partida encontrada para análise' },
        { status: 404 }
      );
    }

    // Buscar histórico adicional (temporadas anteriores para contexto)
    const historicalResult = await query<MatchData>(`
      SELECT 
        f.fixture_id, 
        f.date, 
        f.status_long, 
        f.status_short,
        f.home_team_id,
        f.away_team_id,
        home.name AS home_team_name,
        away.name AS away_team_name,
        home.logo_url AS home_team_logo,
        away.logo_url AS away_team_logo,
        f.goals_home,
        f.goals_away,
        f.round AS round_id,
        COALESCE(fr.round_name, CONCAT('Rodada ', f.round)) AS round_name,
        COALESCE(fr.is_current, false) AS is_current_round,
        f.league_id,
        f.season_year
      FROM 
        fixtures f
      JOIN 
        teams home ON f.home_team_id = home.team_id
      JOIN 
        teams away ON f.away_team_id = away.team_id
      LEFT JOIN
        fixture_rounds fr ON f.round = fr.round_id 
        AND f.league_id = fr.league_id 
        AND CAST(f.season_year AS VARCHAR) = fr.season
      WHERE 
        f.league_id = $1 AND 
        f.season_year < $2 AND
        f.season_year >= $3
      ORDER BY 
        f.date ASC
    `, [leagueId, seasonYear, seasonYear - 3]); // Últimas 3 temporadas para contexto

    // Combinar dados atuais com histórico
    const allMatches = [...(historicalResult.rows || []), ...matchesResult.rows];
    
    // Inicializar analisador
    const analyzer = new HistoricalAnalyzer();
    
    // Inicializar progresso
    let processedMatches = 0;
    const totalMatches = matchesResult.rows.length;
    
    // Função de callback para progresso
    const onProgress = async (prediction: Prediction, progress: number) => {
      processedMatches++;
      
      const progressData: AnalysisProgress = {
        total_matches: totalMatches,
        processed_matches: processedMatches,
        current_match: matchesResult.rows[processedMatches - 1] || null,
        predictions_made: processedMatches,
        current_accuracy: prediction.is_correct !== undefined ? 
          (processedMatches > 0 ? (prediction.is_correct ? 1 : 0) : 0) : 0,
        progress_percentage: progress
      };
      
      // Salvar progresso no cache
      await redisCache.storeAnalysisProgress(leagueId, seasonYear, progressData);
    };

    // Realizar análise cronológica
    const predictions = await analyzer.analyzeSeasonChronologically(
      leagueId,
      seasonYear,
      allMatches,
      onProgress
    );

    // Criar modelo baseado nos resultados
    const model = analyzer.createModel(leagueId, seasonYear, predictions, allMatches);
    
    // Salvar modelo no cache
    await redisCache.storeModel(leagueId, seasonYear, model);
    
    // Validar modelo
    const validation = analyzer.validateModel(predictions);

    return NextResponse.json({
      success: true,
      message: `Análise concluída para ${predictions.length} partidas`,
      model,
      validation,
      predictions,
      stats: {
        total_matches: predictions.length,
        finished_matches: predictions.filter(p => p.actual_result !== null).length,
        accuracy: validation.accuracy,
        correct_predictions: validation.correct_predictions
      }
    });

  } catch (error) {
    console.error('Erro na análise de predições:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao analisar predições',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
