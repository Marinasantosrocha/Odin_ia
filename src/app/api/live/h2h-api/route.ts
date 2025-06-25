import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const team1Id = searchParams.get('team1');
    const team2Id = searchParams.get('team2');
    
    if (!team1Id || !team2Id) {
      return NextResponse.json(
        { error: 'Parâmetros team1 e team2 são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se os IDs dos times são válidos
    if (isNaN(parseInt(team1Id)) || isNaN(parseInt(team2Id))) {
      return NextResponse.json(
        { error: 'IDs dos times devem ser números válidos' },
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

    // Fazer requisição para a API-Football (H2H endpoint)
    const apiUrl = `https://${API_HOST}/fixtures/headtohead?h2h=${team1Id}-${team2Id}`;
    
    console.log('Buscando H2H ao vivo para times:', team1Id, 'vs', team2Id);
    console.log('URL da API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    });

    if (!response.ok) {
      console.error('Erro na resposta da API-Football:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Erro na API externa: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Resposta da API-Football (H2H):', {
      teams: `${team1Id} vs ${team2Id}`,
      matchesCount: data.response?.length || 0,
      rateLimit: {
        remaining: response.headers.get('x-ratelimit-requests-remaining'),
        limit: response.headers.get('x-ratelimit-requests-limit')
      }
    });

    // Verificar se há dados na resposta
    if (!data.response) {
      return NextResponse.json(
        { error: 'Formato de resposta inválido da API externa' },
        { status: 500 }
      );
    }

    // Filtrar apenas partidas finalizadas para o histórico
    const finishedMatches = data.response.filter((match: any) => {
      return match.fixture?.status?.short === 'FT' || 
             match.fixture?.status?.short === 'AET' || 
             match.fixture?.status?.short === 'PEN';
    });

    // Ordenar por data (mais recentes primeiro) e limitar aos últimos 5
    const recentMatches = finishedMatches
      .sort((a: any, b: any) => {
        const dateA = new Date(a.fixture?.date || 0).getTime();
        const dateB = new Date(b.fixture?.date || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: recentMatches,
      meta: {
        teams: `${team1Id} vs ${team2Id}`,
        matchesCount: recentMatches.length,
        totalMatches: data.response?.length || 0,
        lastUpdate: new Date().toISOString(),
        source: 'api-football'
      }
    });

  } catch (error) {
    console.error('Erro ao buscar H2H ao vivo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar H2H' },
      { status: 500 }
    );
  }
}
