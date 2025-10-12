/**
 * Ticker Lookup API Types
 */

export type MatchType = "exact_symbol" | "symbol_prefix" | "company_name";

export interface TickerMatch {
  symbol: string;
  name: string;
  exchange?: string;
  market_category?: string;
  is_etf?: boolean;
  match_type: MatchType;
}

export interface TickerLookupResponse {
  query: string;
  has_exact_symbol: boolean;
  matches: TickerMatch[];
}

export interface TickerLookupParams {
  query: string;
  limit?: number;
}
