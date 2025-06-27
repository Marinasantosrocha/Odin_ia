import { NextRequest, NextResponse } from 'next/server';
import { redisCache } from '@/utils/cache/RedisCache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const leagueId = searchParams.get('league_id');
    const seasonYear = searchParams.get('season_year');

    if (!leagueId || !seasonYear) {
      return NextResponse.json(
        { success: false, error: 'ID da liga e ano da temporada são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar modelo que contém as informações de validação
    const model = await redisCache.getModel(
      parseInt(leagueId), 
      parseInt(seasonYear)
    );

    if (!model) {
      return NextResponse.json(
        { success: false, error: 'Nenhum modelo de predição encontrado' },
        { status: 404 }
      );
    }

    // Buscar predições para calcular validação
    const predictions = await redisCache.getAllPredictions(
      parseInt(leagueId), 
      parseInt(seasonYear)
    );

    console.log(`Total predictions found: ${predictions.length}`);
    
    // Filtrar partidas que já têm resultado definido (não nulas)
    const finishedMatches = predictions.filter(p => p.actual_result !== null && p.actual_result !== undefined);
    const correctPredictions = finishedMatches.filter(p => p.is_correct === true);
    
    console.log(`Finished matches: ${finishedMatches.length}`);
    console.log(`Correct predictions: ${correctPredictions.length}`);
    
    // Calcular precisão por tipo de resultado
    const homeWinPredictions = finishedMatches.filter(p => p.predicted_result === 'HOME');
    const drawPredictions = finishedMatches.filter(p => p.predicted_result === 'DRAW');
    const awayWinPredictions = finishedMatches.filter(p => p.predicted_result === 'AWAY');
    
    console.log(`Home win predictions: ${homeWinPredictions.length}`);
    console.log(`Draw predictions: ${drawPredictions.length}`);
    console.log(`Away win predictions: ${awayWinPredictions.length}`);
    
    const homeWinCorrect = homeWinPredictions.filter(p => p.is_correct === true);
    const drawCorrect = drawPredictions.filter(p => p.is_correct === true);
    const awayWinCorrect = awayWinPredictions.filter(p => p.is_correct === true);
    
    const precision_by_outcome = {
      home_win: homeWinPredictions.length > 0 ? homeWinCorrect.length / homeWinPredictions.length : 0,
      draw: drawPredictions.length > 0 ? drawCorrect.length / drawPredictions.length : 0,
      away_win: awayWinPredictions.length > 0 ? awayWinCorrect.length / awayWinPredictions.length : 0
    };
    
    console.log(`Precision by outcome:`, precision_by_outcome);
    
    // Calcular correlação de confiança (média da confiança das predições corretas)
    const correctPredictionsWithConfidence = correctPredictions.filter(p => p.confidence !== undefined && p.confidence !== null);
    const confidence_correlation = correctPredictionsWithConfidence.length > 0 
      ? correctPredictionsWithConfidence.reduce((sum, p) => sum + p.confidence, 0) / correctPredictionsWithConfidence.length 
      : 0;
    
    const validationResult = {
      total_matches: predictions.length,
      finished_matches: finishedMatches.length,
      correct_predictions: correctPredictions.length,
      accuracy: finishedMatches.length > 0 ? correctPredictions.length / finishedMatches.length : 0,
      precision_by_outcome,
      confidence_correlation,
      model_created_at: model.created_at,
      league_id: parseInt(leagueId),
      season_year: parseInt(seasonYear)
    };

    return NextResponse.json({
      success: true,
      data: validationResult
    });

  } catch (error) {
    console.error('Erro ao buscar validação:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao buscar validação',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
