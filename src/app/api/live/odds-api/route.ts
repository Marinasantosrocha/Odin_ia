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

    // Fazer requisição para a API-Football (odds/bookmakers)
    const apiUrl = `https://${API_HOST}/odds?fixture=${fixtureId}`;
    
    console.log('Buscando odds ao vivo para fixture:', fixtureId);
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
    
    console.log('Resposta da API-Football (odds):', {
      fixture: fixtureId,
      oddsCount: data.response?.length || 0,
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

    // Filtrar e formatar odds relevantes
    const relevantOdds = data.response.map((oddsData: any) => {
      // Filtrar apenas os mercados principais (Match Winner, Over/Under, etc.)
      const mainMarkets = oddsData.bookmakers?.map((bookmaker: any) => ({
        bookmaker: {
          id: bookmaker.id,
          name: bookmaker.name
        },
        bets: bookmaker.bets?.filter((bet: any) => 
          ['Match Winner', 'Over/Under', 'Both Teams Score', 'Asian Handicap'].includes(bet.name)
        ).map((bet: any) => ({
          name: bet.name,
          values: bet.values?.map((value: any) => ({
            value: value.value,
            odd: value.odd
          }))
        }))
      })).filter((bookmaker: any) => bookmaker.bets && bookmaker.bets.length > 0);

      return {
        fixture: oddsData.fixture,
        league: oddsData.league,
        teams: oddsData.teams,
        bookmakers: mainMarkets || []
      };
    }).filter((odds: any) => odds.bookmakers.length > 0);

    // Ordenar por número de bookmakers (mais opções primeiro)
    relevantOdds.sort((a: any, b: any) => {
      return (b.bookmakers?.length || 0) - (a.bookmakers?.length || 0);
    });

    return NextResponse.json({
      success: true,
      data: relevantOdds,
      meta: {
        fixture: fixtureId,
        bookmakersCount: relevantOdds.length > 0 ? relevantOdds[0].bookmakers?.length || 0 : 0,
        lastUpdate: new Date().toISOString(),
        source: 'api-football'
      }
    });

  } catch (error) {
    console.error('Erro ao buscar odds ao vivo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar odds' },
      { status: 500 }
    );
  }
}
