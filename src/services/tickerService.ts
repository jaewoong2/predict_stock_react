import axios from "axios";
import {
  Ticker,
  TickerCreate,
  TickerUpdate,
  TickerMultiDateQuery,
  TickerChangeResponse,
} from "../types/ticker";

// API 기본 URL 설정
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    tickerData: TickerUpdate
  ): Promise<Ticker> => {
    const response = await api.put<Ticker>(`/tickers/${tickerId}`, tickerData);
    return response.data;
  },

  // 6. 티커 삭제
  deleteTicker: async (tickerId: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/tickers/${tickerId}`
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
    query: TickerMultiDateQuery
  ): Promise<TickerChangeResponse[]> => {
    const response = await api.post<TickerChangeResponse[]>(
      "/tickers/changes",
      query
    );
    return response.data;
  },
};
