import { NextRequest, NextResponse } from 'next/server';
import { redisCache } from '@/utils/cache/RedisCache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const leagueId = searchParams.get('leagueId');
    const seasonYear = searchParams.get('seasonYear');

    if (!leagueId || !seasonYear) {
      return NextResponse.json(
        { error: 'ID da liga e ano da temporada são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar progresso da análise
    const progress = await redisCache.getAnalysisProgress(
      parseInt(leagueId), 
      parseInt(seasonYear)
    );

    if (!progress) {
      return NextResponse.json({
        success: true,
        progress: null,
        message: 'Nenhuma análise em progresso'
      });
    }

    return NextResponse.json({
      success: true,
      progress
    });

  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao buscar progresso',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
