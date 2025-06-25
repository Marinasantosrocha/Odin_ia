import { NextRequest, NextResponse } from "next/server";
import { query } from '@/lib/db';

interface FixtureOdd {
  odd_id: number;
  fixture_id: number;
  bookmaker_id: number;
  bookmaker_name: string;
  bet_id: number;
  bet_name: string;
  option_value: string;
  odd_value: number;
  api_last_update: string | null;
  etl_load_date: string | null;
}

export async function GET(
  request: NextRequest,
  context: { params: { fixtureId: string } }
) {
  try {
    const { fixtureId } = context.params;
    const fixtureIdInt = parseInt(fixtureId, 10);

    if (isNaN(fixtureIdInt)) {
      return NextResponse.json(
        { error: "ID da partida inválido" },
        { status: 400 }
      );
    }

    // Parâmetros opcionais
    const searchParams = request.nextUrl.searchParams;
    const bookmakerIdParam = searchParams.get('bookmaker_id');
    const betIdParam = searchParams.get('bet_id');

    // Construir a consulta SQL
    let queryText = `
      SELECT 
        odd_id,
        fixture_id,
        bookmaker_id,
        bookmaker_name,
        bet_id,
        bet_name,
        option_value,
        odd_value,
        api_last_update,
        etl_load_date
      FROM 
        fixture_odds
      WHERE 
        fixture_id = $1
    `;

    const queryParams = [fixtureIdInt];
    let paramIndex = 2;

    // Adicionar filtros opcionais
    if (bookmakerIdParam) {
      const bookmakerId = parseInt(bookmakerIdParam, 10);
      if (!isNaN(bookmakerId)) {
        queryText += ` AND bookmaker_id = $${paramIndex}`;
        queryParams.push(bookmakerId);
        paramIndex++;
      }
    }

    if (betIdParam) {
      const betId = parseInt(betIdParam, 10);
      if (!isNaN(betId)) {
        queryText += ` AND bet_id = $${paramIndex}`;
        queryParams.push(betId);
        paramIndex++;
      }
    }

    // Ordenar resultados
    queryText += ` ORDER BY bookmaker_name, bet_name, option_value`;

    // Executar a consulta
    const result = await query<FixtureOdd>(queryText, queryParams);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Nenhuma odd encontrada para esta partida" },
        { status: 200 }
      );
    }

    // Agrupar odds por bookmaker e tipo de aposta
    const groupedOdds: Record<string, Record<string, any>> = {};
    
    result.rows.forEach(odd => {
      // Inicializar bookmaker se não existir
      if (!groupedOdds[odd.bookmaker_name]) {
        groupedOdds[odd.bookmaker_name] = {
          bookmaker_id: odd.bookmaker_id,
          bookmaker_name: odd.bookmaker_name,
          bets: {}
        };
      }
      
      // Inicializar tipo de aposta se não existir
      if (!groupedOdds[odd.bookmaker_name].bets[odd.bet_name]) {
        groupedOdds[odd.bookmaker_name].bets[odd.bet_name] = {
          bet_id: odd.bet_id,
          bet_name: odd.bet_name,
          options: []
        };
      }
      
      // Adicionar opção à aposta
      groupedOdds[odd.bookmaker_name].bets[odd.bet_name].options.push({
        option_value: odd.option_value,
        odd_value: odd.odd_value
      });
    });

    // Converter para array para facilitar o uso no frontend
    const bookmakers = Object.values(groupedOdds).map(bookmaker => {
      return {
        ...bookmaker,
        bets: Object.values(bookmaker.bets)
      };
    });

    return NextResponse.json({
      data: result.rows,
      bookmakers: bookmakers
    });
  } catch (error) {
    console.error("Erro ao buscar odds:", error);
    return NextResponse.json(
      { error: "Erro ao buscar odds da partida" },
      { status: 500 }
    );
  }
}
