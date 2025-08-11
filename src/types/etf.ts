export interface ETFPortfolioChange {
  ticker: string;
  company_name: string;
  action: "ADDED" | "REDUCED";
  shares: number;
  value: number;
  percentage: number;
  change_reason: string;
}

export interface ETFPortfolioData {
  etf_ticker: string;
  etf_name: string;
  analysis_date: string;
  total_value: number;
  changes: ETFPortfolioChange[];
  summary: string;
  market_impact: string;
}

export interface ETFAnalysisGetResponse {
  etf_portfolios: ETFPortfolioData[];
}

export interface ETFAnalysisGetRequest {
  target_date?: string;
  etf_tickers?: string;
  limit?: number;
  sort_by?: "date" | "etf_name" | "total_value";
  sort_order?: "asc" | "desc";
}

export interface ETFAnalysisPostRequest {
  etf_tickers: string[];
  target_date?: string;
}