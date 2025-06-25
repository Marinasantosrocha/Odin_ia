import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// Obter a chave API do ambiente ou usar um fallback para desenvolvimento
const API_KEY = process.env.FOOTBALL_API_KEY || "734d7374035345551238fe5122013313";
const API_HOST = "v3.football.api-sports.io";

// Cache para armazenar temporariamente os dados de eventos e reduzir chamadas à API
let eventsCache: Record<string, {
  data: any;
  timestamp: number;
}> = {};

// Tempo de expiração do cache em milissegundos (2 minutos)
const CACHE_EXPIRATION = 120000;

interface FixtureEvent {
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
}

export async function GET(request: NextRequest) {
  try {
    // Obter o ID da partida
    const searchParams = request.nextUrl.searchParams;
    const fixtureId = searchParams.get('fixture');
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    if (!fixtureId) {
      return NextResponse.json(
        { error: "ID da partida é obrigatório", data: [] },
        { status: 400 }
      );
    }

    // Verificar se temos dados em cache válidos
    const now = Date.now();
    if (
      !forceRefresh &&
      eventsCache[fixtureId] &&
      now - eventsCache[fixtureId].timestamp < CACHE_EXPIRATION
    ) {
      // Retornar dados do cache
      return NextResponse.json({
        data: eventsCache[fixtureId].data,
        count: eventsCache[fixtureId].data.length,
        cached: true,
        cacheAge: Math.round((now - eventsCache[fixtureId].timestamp) / 1000)
      });
    }

    // Construir a URL da API
    const url = `https://v3.football.api-sports.io/fixtures/events?fixture=${fixtureId}`;

    // Obter o IP do cliente para logging
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';

    // Fazer a requisição para a API externa
    console.log(`[${new Date().toISOString()}] Buscando eventos da partida ${fixtureId} para IP ${clientIp}`);
    
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
        { message: "Nenhum evento encontrado para esta partida", data: [] },
        { status: 200 }
      );
    }

    // Atualizar o cache
    eventsCache[fixtureId] = {
      data: data.response,
      timestamp: now
    };

    // Processar e retornar os dados
    return NextResponse.json({
      data: data.response,
      count: data.results,
      cached: false
    });
  } catch (error) {
    console.error("Erro ao buscar eventos da partida:", error);
    
    // Se temos dados em cache para esta partida, retorná-los mesmo que estejam expirados
    const fixtureId = request.nextUrl.searchParams.get('fixture');
    if (fixtureId && eventsCache[fixtureId]) {
      return NextResponse.json({
        data: eventsCache[fixtureId].data,
        count: eventsCache[fixtureId].data.length,
        cached: true,
        stale: true,
        error: "Usando dados em cache devido a erro na API"
      });
    }
    
    return NextResponse.json(
      { error: "Erro ao buscar eventos da partida", data: [] },
      { status: 500 }
    );
  }
}
