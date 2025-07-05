export interface Ticker {
  id: number;
  symbol: string;
  name: string;
  price: number;
  open_price?: number;
  high_price?: number;
  low_price?: number;
  close_price?: number;
  volume?: number;
  date: string;
}

export type TickerCreate = Omit<Ticker, "id">;

export type TickerUpdate = Partial<TickerCreate>;

export interface TickerMultiDateQuery {
  symbol: string;
  dates: string[]; // 'YYYY-MM-DD' 형식
}

export interface TickerChangeResponse {
  symbol: string;
  date: string;
  price: number;
  change_percentage: number;
  // 추가 필요한 정보들
}

export interface WeeklyPriceMovement {
  ticker: string;
  count: number[];
  date: string[];
}

export interface WeeklyPriceMovementResponse {
  tickers: WeeklyPriceMovement[];
}

export interface GetWeeklyPriceMovementParams {
  tickers?: string;
  reference_date?: string;
  direction: "up" | "down";
}

export interface TickerOrderByRequest {
  target_date?: string; // 'YYYY-MM-DD' 형식
  direction?: "asc" | "desc";
  field?: "close_change" | "volume_change";
  limit?: number;
}

export interface StockData {
  date: string;
  symbol: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  volume: number;
  open_change: number;
  close_change: number;
  price_change: number;
  volume_change: number;
}
