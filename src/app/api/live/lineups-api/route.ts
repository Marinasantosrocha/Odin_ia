import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fixtureId = searchParams.get('fixture');
    
    if (!fixtureId) {
      return NextResponse.json(
        { error: 'Parâmetro fixture é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o fixture ID é válido
    if (isNaN(parseInt(fixtureId))) {
      return NextResponse.json(
        { error: 'Fixture ID deve ser um número válido' },
        { status: 400 }
      );
    }

    // Configuração da API-Football
    const API_KEY = process.env.FOOTBALL_API_KEY || "734d7374035345551238fe5122013313";
    const API_HOST = 'v3.football.api-sports.io';
    
    if (!API_KEY) {
      console.error('FOOTBALL_API_KEY não configurada');
      return NextResponse.json(
        { error: 'Configuração da API não encontrada' },
        { status: 500 }
      );
    }

    // Fazer requisição para a API-Football
    const apiUrl = `https://${API_HOST}/fixtures/lineups?fixture=${fixtureId}`;
    
    console.log('Buscando escalações para fixture:', fixtureId);
    console.log('URL da API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
      signal: AbortSignal.timeout(10000), // Timeout de 10s
    });

    if (!response.ok) {
      console.error('Erro na resposta da API-Football:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Erro na API externa: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Resposta da API-Football (escalações):', {
      fixture: fixtureId,
      teamsCount: data.response?.length || 0,
      rateLimit: {
        remaining: response.headers.get('x-ratelimit-requests-remaining'),
        limit: response.headers.get('x-ratelimit-requests-limit')
      }
    });

    // Verificar se há dados na resposta
    if (!data.response || !Array.isArray(data.response)) {
      return NextResponse.json(
        { error: 'Formato de resposta inválido da API externa' },
        { status: 500 }
      );
    }

    // Processar dados das escalações
    const processedLineups = data.response.map((lineup: any) => {
      // Processar titulares
      const startXI = lineup.startXI?.map((player: any) => ({
        player: {
          id: player.player?.id,
          name: player.player?.name,
          number: player.player?.number,
          pos: player.player?.pos,
          grid: player.player?.grid,
        }
      })) || [];

      // Processar reservas
      const substitutes = lineup.substitutes?.map((player: any) => ({
        player: {
          id: player.player?.id,
          name: player.player?.name,
          number: player.player?.number,
          pos: player.player?.pos,
        }
      })) || [];

      return {
        team: {
          id: lineup.team?.id,
          name: lineup.team?.name,
          logo: lineup.team?.logo,
          colors: lineup.team?.colors
        },
        formation: lineup.formation,
        startXI,
        substitutes,
        coach: {
          id: lineup.coach?.id,
          name: lineup.coach?.name,
          photo: lineup.coach?.photo
        }
      };
    });

    return NextResponse.json({
      success: true,
      data: processedLineups,
      meta: {
        fixture: fixtureId,
        teamsCount: processedLineups.length,
        lastUpdate: new Date().toISOString(),
        source: 'api-football'
      }
    });

  } catch (error) {
    console.error('Erro ao buscar escalações:', error);
    
    // Verificar se é timeout
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Timeout na API externa - tente novamente' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar escalações' },
      { status: 500 }
    );
  }
}
