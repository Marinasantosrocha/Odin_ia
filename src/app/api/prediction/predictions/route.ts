import { NextRequest, NextResponse } from 'next/server';
import { redisCache } from '@/utils/cache/RedisCache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const leagueId = searchParams.get('league_id');
    const seasonYear = searchParams.get('season_year');
    const fixtureId = searchParams.get('fixture_id');

    if (fixtureId) {
      // Buscar predição específica por fixture ID
      const prediction = await redisCache.getPrediction(parseInt(fixtureId));
      
      if (!prediction) {
        return NextResponse.json(
          { success: false, error: 'Predição não encontrada' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        prediction
      });
    }

    if (!leagueId || !seasonYear) {
      return NextResponse.json(
        { success: false, error: 'ID da liga e ano da temporada são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar todas as predições da liga/temporada
    const predictions = await redisCache.getAllPredictions(
      parseInt(leagueId), 
      parseInt(seasonYear)
    );

    // Buscar modelo associado
    const model = await redisCache.getModel(
      parseInt(leagueId), 
      parseInt(seasonYear)
    );

    return NextResponse.json({
      success: true,
      data: predictions,
      model,
      count: predictions.length
    });

  } catch (error) {
    console.error('Erro ao buscar predições:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao buscar predições',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
