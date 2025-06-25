import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// Obter a chave API do ambiente ou usar um fallback para desenvolvimento
const API_KEY = process.env.FOOTBALL_API_KEY || "734d7374035345551238fe5122013313";
const API_HOST = "v3.football.api-sports.io";

// Cache para armazenar temporariamente os dados e reduzir chamadas à API
let liveMatchesCache: {
  data: any;
  timestamp: number;
  params: string;
} | null = null;

// Tempo de expiração do cache em milissegundos (30 segundos)
const CACHE_EXPIRATION = 30000;

interface LiveFixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number | null;
      name: string | null;
      city: string | null;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
  events?: Array<{
    time: {
      elapsed: number;
      extra: number | null;
    };
    team: {
      id: number;
      name: string;
      logo: string;
    };
    player: {
      id: number;
      name: string;
    };
    assist: {
      id: number | null;
      name: string | null;
    };
    type: string;
    detail: string;
    comments: string | null;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    // Parâmetros opcionais
    const searchParams = request.nextUrl.searchParams;
    const leagueId = searchParams.get('league');
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    // Criar uma string de parâmetros para identificar o cache
    const paramsString = `league=${leagueId || ''}`;
    
    // Verificar se temos dados em cache válidos
    const now = Date.now();
    if (
      !forceRefresh &&
      liveMatchesCache &&
      liveMatchesCache.params === paramsString &&
      now - liveMatchesCache.timestamp < CACHE_EXPIRATION
    ) {
      // Retornar dados do cache
      return NextResponse.json({
        data: liveMatchesCache.data,
        count: liveMatchesCache.data.length,
        cached: true,
        cacheAge: Math.round((now - liveMatchesCache.timestamp) / 1000)
      });
    }
    
    // Construir a URL da API
    let url = 'https://v3.football.api-sports.io/fixtures?live=all';
    
    // Adicionar filtro de liga se fornecido
    if (leagueId) {
      url += `&league=${leagueId}`;
    }

    // Obter o IP do cliente para logging
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';

    // Fazer a requisição para a API externa
    console.log(`[${new Date().toISOString()}] Buscando partidas ao vivo para IP ${clientIp}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST
      },
      next: { revalidate: 60 } // Usar o cache do Next.js por 60 segundos
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na API (${response.status}): ${errorText}`);
      throw new Error(`Erro na API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Verificar se a resposta contém os dados esperados
    if (!data || !data.response) {
      return NextResponse.json(
        { message: "Nenhuma partida ao vivo encontrada", data: [] },
        { status: 200 }
      );
    }

    // Atualizar o cache
    liveMatchesCache = {
      data: data.response,
      timestamp: now,
      params: paramsString
    };

    // Processar e retornar os dados
    return NextResponse.json({
      data: data.response,
      count: data.results,
      parameters: data.parameters,
      cached: false
    });
  } catch (error) {
    console.error("Erro ao buscar partidas ao vivo:", error);
    
    // Se temos dados em cache, retorná-los mesmo que estejam expirados
    // em caso de falha na API
    if (liveMatchesCache) {
      return NextResponse.json({
        data: liveMatchesCache.data,
        count: liveMatchesCache.data.length,
        cached: true,
        stale: true,
        error: "Usando dados em cache devido a erro na API"
      });
    }
    
    return NextResponse.json(
      { error: "Erro ao buscar partidas ao vivo", data: [] },
      { status: 500 }
    );
  }
}
