export interface Signal {
  ticker: string;
  strategy: string;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  action: "buy" | "sell" | string; // 'buy', 'sell' 외 다른 액션이 있을 수 있다면 string으로 확장
  timestamp: string;
  probability: "High" | "Medium" | "Low" | string; // 확률 값 타입 정의
  result_description: string;
  report_summary: string;
  ai_model: string;
  senario: string; // 'scenario'의 오타로 보이나, API 응답 그대로 사용
  bad_things: string;
}

export interface SignalTickerInfo {
  symbol: string;
  name: string;
  price: number;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  volume: number;
  ticker_date: string; // API 응답에서는 'date'가 아닌 'ticker_date'로 되어있음
  created_at: string;
  updated_at: string | null;
}

export interface SignalResult {
  action: "up" | "down" | "stay" | string; // 결과 액션 타입 정의
  is_correct: boolean | null;
  price_diff: number;
}

export interface SignalData {
  signal: Signal;
  ticker: SignalTickerInfo;
  result: SignalResult;
}

export interface SignalAPIResponse {
  date: string;
  signals: SignalData[];
}
