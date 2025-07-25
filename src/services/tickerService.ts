import {
  Ticker,
  TickerCreate,
  TickerUpdate,
  TickerMultiDateQuery,
  TickerChangeResponse,
  GetWeeklyPriceMovementParams,
  WeeklyPriceMovementResponse,
  StockData,
  TickerOrderByRequest,
} from "../types/ticker";
import api from "./api";

export const tickerService = {
  // 1. 티커 ID로 조회
  getTickerById: async (tickerId: number): Promise<Ticker> => {
    const response = await api.get<Ticker>(`/tickers/${tickerId}`);
    return response.data;
  },

  // 2. 심볼로 티커 조회
  getTickerBySymbol: async (symbol: string): Promise<Ticker[]> => {
    const response = await api.get<Ticker[]>(`/tickers/symbol/${symbol}`);
    return response.data;
  },

  // 3. 모든 티커 조회
  getAllTickers: async (): Promise<Ticker[]> => {
    const response = await api.get<Ticker[]>("/tickers/");
    return response.data;
  },

  // 4. 새 티커 생성
  createTicker: async (tickerData: TickerCreate): Promise<Ticker> => {
    const response = await api.post<Ticker>("/tickers/", tickerData);
    return response.data;
  },

  // 5. 티커 정보 업데이트
  updateTicker: async (
    tickerId: number,
    tickerData: TickerUpdate,
  ): Promise<Ticker> => {
    const response = await api.put<Ticker>(`/tickers/${tickerId}`, tickerData);
    return response.data;
  },

  // 6. 티커 삭제
  deleteTicker: async (tickerId: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/tickers/${tickerId}`,
    );
    return response.data;
  },

  // 7. 특정 날짜의 티커 정보 조회
  getTickerByDate: async (symbol: string, date: string): Promise<Ticker> => {
    const response = await api.get<Ticker>("/tickers/by-date", {
      params: { symbol, date },
    });
    return response.data;
  },

  // 8. 날짜별 변화율 조회
  getTickerChanges: async (
    query: TickerMultiDateQuery,
  ): Promise<TickerChangeResponse[]> => {
    const response = await api.post<TickerChangeResponse[]>(
      "/tickers/changes",
      query,
    );
    return response.data;
  },

  getWeeklyPriceMovement: async ({
    tickers,
    reference_date,
    direction,
  }: GetWeeklyPriceMovementParams): Promise<WeeklyPriceMovementResponse> => {
    const params: {
      tickers?: string;
      reference_date?: string;
      direction?: "up" | "down";
    } = {};

    if (tickers) {
      params.tickers = tickers;
    }
    if (reference_date) {
      params.reference_date = reference_date;
    }
    if (direction) {
      params.direction = direction;
    }

    const response = await api.get<WeeklyPriceMovementResponse>(
      "/tickers/weekly/price-movement",
      { params },
    );
    return response.data;
  },

  getPopularStocks: async ({
    ...params
  }: TickerOrderByRequest): Promise<StockData[]> => {
    try {
      const response = await api.get<StockData[]>("/tickers/order-by/date", {
        params,
      });

      // API 응답 데이터를 UI에 맞게 변환
      return response.data;
    } catch (error) {
      console.error("인기 주식 정보를 가져오는 중 오류 발생:", error);
      return [];
    }
  },
};
