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
