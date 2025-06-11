export interface Signal {
  ticker: string;
  strategy?: string | null;
  entry_price?: number | null;
  stop_loss?: number | null;
  take_profit?: number | null;
  action?: string | null;
  timestamp?: string | null;
  probability?: string | null;
  result_description?: string | null;
  report_summary?: string | null;
  ai_model?: string | null;
  senario?: string | null;
  good_things?: string | null;
  bad_things?: string | null;
}

export interface SignalTickerInfo {
  symbol: string;
  name?: string | null;
  price?: number | null;
  open_price?: number | null;
  high_price?: number | null;
  low_price?: number | null;
  close_price?: number | null;
  volume?: number | null;
  ticker_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SignalResult {
  action: "up" | "down" | "unchanged" | "unknown";
  is_correct: boolean;
  price_diff: number;
}

export interface SignalData {
  signal: Signal;
  ticker?: SignalTickerInfo | null;
  result?: SignalResult | null;
}
export interface SignalAPIResponse {
  date: string;
  signals: SignalData[];
}
