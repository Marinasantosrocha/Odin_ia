import { NextRequest, NextResponse } from 'next/server';

// Cache simples em memória para classificações
const standingsCache = new Map<string, { data: any; timestamp: number }>();
// Cache para respostas negativas (404) - evita requisições repetidas
const failedStandingsCache = new Map<string, number>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos
const FAILED_CACHE_DURATION = 60 * 60 * 1000; // 1 hora para falhas

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get('league');
    const season = searchParams.get('season') || new Date().getFullYear().toString();
    
    if (!leagueId) {
      return NextResponse.json(
        { error: 'Parâmetro league é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o league ID é válido
    if (isNaN(parseInt(leagueId))) {
      return NextResponse.json(
        { error: 'League ID deve ser um número válido' },
        { status: 400 }
      );
    }

    // Verificar cache de falhas primeiro
    const cacheKey = `${leagueId}-${season}`;
    const failedTimestamp = failedStandingsCache.get(cacheKey);
    if (failedTimestamp && (Date.now() - failedTimestamp) < FAILED_CACHE_DURATION) {
      console.log('Liga já conhecida como sem dados:', leagueId, 'temporada:', season);
      return NextResponse.json(
        { error: 'Classificação não disponível para esta liga/temporada' },
        { status: 404 }
      );
    }

    // Verificar cache
    const cached = standingsCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('Retornando classificação do cache para liga:', leagueId);
      return NextResponse.json({
        success: true,
        data: cached.data,
        meta: {
          league: leagueId,
          season,
          source: 'cache',
          lastUpdate: new Date(cached.timestamp).toISOString()
        }
      });
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
    const apiUrl = `https://${API_HOST}/standings?league=${leagueId}&season=${season}`;
    
    console.log('Buscando classificação para liga:', leagueId, 'temporada:', season);
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
    
    console.log('Resposta da API-Football (classificação):', {
      league: leagueId,
      season,
      standingsCount: data.response?.length || 0,
      rateLimit: {
        remaining: response.headers.get('x-ratelimit-requests-remaining'),
        limit: response.headers.get('x-ratelimit-requests-limit')
      }
    });

    // Verificar se há dados na resposta
    if (!data.response || !Array.isArray(data.response) || data.response.length === 0) {
      // Cachear a falha para evitar requisições repetidas
      failedStandingsCache.set(cacheKey, Date.now());
      console.log('Classificação não encontrada, cacheando falha para liga:', leagueId, 'temporada:', season);
      
      return NextResponse.json(
        { error: 'Classificação não disponível para esta liga/temporada' },
        { status: 404 }
      );
    }

    // Processar dados da classificação para extrair informações dos times
    const leagueStandings = data.response[0]; // Primeira (e geralmente única) classificação
    
    if (!leagueStandings.league || !leagueStandings.league.standings || !leagueStandings.league.standings[0]) {
      return NextResponse.json(
        { error: 'Formato de classificação inválido' },
        { status: 500 }
      );
    }

    const teams = leagueStandings.league.standings[0]; // Times da classificação
    
    // Extrair informações relevantes de cada time
    const processedTeams = teams.map((team: any) => ({
      teamId: team.team?.id,
      teamName: team.team?.name,
      teamLogo: team.team?.logo,
      form: team.form || '', // String com últimos 5 jogos (ex: "WWLDW")
      position: team.rank,
      points: team.points,
      played: team.all?.played || 0,
      wins: team.all?.win || 0,
      draws: team.all?.draw || 0,
      losses: team.all?.lose || 0
    }));

    // Salvar no cache
    standingsCache.set(cacheKey, {
      data: processedTeams,
      timestamp: Date.now()
    });

    return NextResponse.json({
      success: true,
      data: processedTeams,
      meta: {
        league: leagueId,
        season,
        teamsCount: processedTeams.length,
        lastUpdate: new Date().toISOString(),
        source: 'api-football'
      }
    });

  } catch (error) {
    console.error('Erro ao buscar classificação:', error);
    
    // Verificar se é timeout
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Timeout na API externa - tente novamente' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar classificação' },
      { status: 500 }
    );
  }
}
