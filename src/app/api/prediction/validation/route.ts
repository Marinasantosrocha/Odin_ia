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

    const finishedMatches = predictions.filter(p => p.actual_result !== null);
    const correctPredictions = predictions.filter(p => p.is_correct === true);
    
    const validationResult = {
      total_matches: predictions.length,
      finished_matches: finishedMatches.length,
      correct_predictions: correctPredictions.length,
      accuracy: finishedMatches.length > 0 ? correctPredictions.length / finishedMatches.length : 0,
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
