// ============================================================================
// Analyst Price Targets
// ============================================================================

export type AnalystAction = "UP" | "DOWN" | "INIT" | "DROP";

export interface AnalystPriceTargetItem {
  ticker: string;
  action: AnalystAction;
  broker: string;
  broker_rating: string;
  old_pt: number | null;
  new_pt: number | null;
  consensus: number | null;
  upside_pct: number | null;
  rationale: string;
  sources: string[];
  source_details: {
    name: string;
    url: string;
  }[];
  impact_score: number;
  date: string;
  published_at: string;
}

export interface AnalystPriceTargetsResponse {
  items: AnalystPriceTargetItem[];
  total_count: number;
  filtered_count: number;
  actual_date: string;
  is_exact_date_match: boolean;
  request_params: {
    target_date: string;
    tickers: string | null;
    action: string | null;
    limit: number | null;
    sort_by: string | null;
    sort_order: string;
  };
}

export interface AnalystPriceTargetsParams {
  target_date?: string;
  tickers?: string[];
  action?: AnalystAction;
  limit?: number;
  sort_by?: "impact" | "date";
  sort_order?: "asc" | "desc";
}

// ============================================================================
// ETF Flows
// ============================================================================

export interface ETFFlowItem {
  ticker: string;
  name: string;
  net_flow: number;
  flow_1w: number | null;
  volume_change: number | null;
  sector: string;
  themes: string[];
  sector_inferred: boolean;
  evidence: string;
  source: string;
  source_details: {
    name: string;
    url: string;
  }[];
}

export interface ETFFlowsResponse {
  items: ETFFlowItem[];
  total_count: number;
  filtered_count: number;
  actual_date: string;
  is_exact_date_match: boolean;
  request_params: {
    target_date: string;
    provider: string | null;
    sector_only: boolean;
    tickers: string | null;
  };
}

export interface ETFFlowsParams {
  target_date?: string;
  provider?: string;
  sector_only?: boolean;
  tickers?: string[];
}

// ============================================================================
// Liquidity
// ============================================================================

export interface LiquidityDataPoint {
  date: string;
  m2: number | null;
  rrp: number | null;
}

export interface LiquidityResponse {
  series_m2: LiquidityDataPoint[];
  series_rrp: LiquidityDataPoint[];
  commentary: string;
  window: string;
  sources: {
    name: string;
    url: string;
  }[];
}

export interface LiquidityParams {
  target_date?: string;
}

// ============================================================================
// Market Breadth
// ============================================================================

export interface MarketBreadthDataPoint {
  date: string;
  vix: number | null;
  advancers: number | null;
  decliners: number | null;
  new_highs: number | null;
  new_lows: number | null;
  trin: number | null;
}

export interface MarketBreadthResponse {
  series: MarketBreadthDataPoint[];
  commentary: string;
  sources: {
    name: string;
    url: string;
  }[];
}

export interface MarketBreadthParams {
  target_date?: string;
}

// ============================================================================
// Insider Trends
// ============================================================================

export type InsiderAction = "BUY" | "SELL";

export interface InsiderTrendItem {
  ticker: string;
  action: InsiderAction;
  insider_name: string;
  insider_title: string;
  shares: number;
  value: number;
  price: number;
  date: string;
  filing_date: string;
  transaction_type: string;
  sources: string[];
  source_details: {
    name: string;
    url: string;
  }[];
  sentiment_score: number;
}

export interface InsiderTrendsResponse {
  items: InsiderTrendItem[];
  total_count: number;
  filtered_count: number;
  actual_date: string;
  is_exact_date_match: boolean;
  request_params: {
    target_date: string;
    tickers: string | null;
    action: string | null;
    limit: number | null;
    sort_by: string | null;
    sort_order: string;
  };
}

export interface InsiderTrendsParams {
  target_date?: string;
  tickers?: string[];
  action?: InsiderAction;
  limit?: number;
  sort_by?: "date" | "value";
  sort_order?: "asc" | "desc";
}

// ============================================================================
// ETF Portfolio
// ============================================================================

export interface ETFPortfolioChange {
  etf_ticker: string;
  etf_name: string;
  holding_ticker: string;
  holding_name: string;
  change_type: "ADD" | "REMOVE" | "INCREASE" | "DECREASE";
  shares_change: number | null;
  value_change: number | null;
  weight_change: number | null;
  date: string;
  sources: string[];
  source_details: {
    name: string;
    url: string;
  }[];
}

export interface ETFPortfolioResponse {
  items: ETFPortfolioChange[];
  total_count: number;
  filtered_count: number;
  actual_date: string;
  is_exact_date_match: boolean;
  request_params: {
    target_date: string;
    etf_tickers: string | null;
  };
}

export interface ETFPortfolioParams {
  target_date?: string;
  etf_tickers?: string[];
}
