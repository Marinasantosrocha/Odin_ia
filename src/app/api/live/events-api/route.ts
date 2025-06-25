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
    const apiUrl = `https://${API_HOST}/fixtures/events?fixture=${fixtureId}`;
    
    console.log('Buscando eventos ao vivo para fixture:', fixtureId);
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
    
    console.log('Resposta da API-Football (eventos):', {
      fixture: fixtureId,
      eventsCount: data.response?.length || 0,
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

    // Filtrar e formatar eventos relevantes
    const relevantEvents = data.response.filter((event: any) => {
      return event.type && ['Goal', 'Card', 'subst', 'Var'].includes(event.type);
    });

    // Ordenar eventos por tempo (mais recentes primeiro)
    relevantEvents.sort((a: any, b: any) => {
      const timeA = (a.time?.elapsed || 0) + (a.time?.extra || 0);
      const timeB = (b.time?.elapsed || 0) + (b.time?.extra || 0);
      return timeB - timeA;
    });

    return NextResponse.json({
      success: true,
      data: relevantEvents,
      meta: {
        fixture: fixtureId,
        eventsCount: relevantEvents.length,
        lastUpdate: new Date().toISOString(),
        source: 'api-football'
      }
    });

  } catch (error) {
    console.error('Erro ao buscar eventos ao vivo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar eventos' },
      { status: 500 }
    );
  }
}
