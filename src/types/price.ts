import { z } from "zod";

// Zod 스키마 정의
export const StockPriceSchema = z.object({
  symbol: z.string(),
  current_price: z.union([z.number(), z.string().transform(Number)]),
  previous_close: z.union([z.number(), z.string().transform(Number)]),
  change: z.union([z.number(), z.string().transform(Number)]),
  change_percent: z.union([z.number(), z.string().transform(Number)]),
  volume: z.number(),
  market_status: z.string(),
  last_updated: z.string(),
});

export const CurrentPriceResponseSchema = z.object({
  price: StockPriceSchema,
});

export const EODPriceSchema = z.object({
  symbol: z.string(),
  trading_date: z.string(),
  close_price: z.union([z.number(), z.string().transform(Number)]),
  previous_close: z.union([z.number(), z.string().transform(Number)]),
  change: z.union([z.number(), z.string().transform(Number)]),
  change_percent: z.union([z.number(), z.string().transform(Number)]),
  high: z.union([z.number(), z.string().transform(Number)]),
  low: z.union([z.number(), z.string().transform(Number)]),
  open_price: z.union([z.number(), z.string().transform(Number)]),
  volume: z.number(),
  fetched_at: z.string(),
});

export const EODPriceResponseSchema = z.object({
  eod_price: EODPriceSchema,
});

// 타입 추출
export type StockPrice = z.infer<typeof StockPriceSchema>;
export type CurrentPriceResponse = z.infer<typeof CurrentPriceResponseSchema>;
export type EODPrice = z.infer<typeof EODPriceSchema>;
export type EODPriceResponse = z.infer<typeof EODPriceResponseSchema>;

// 기존 인터페이스는 호환성을 위해 유지하되 deprecated로 표시
/** @deprecated Use StockPrice type instead */
export interface StockPriceInterface {
  symbol: string;
  current_price: number;
  previous_close: number;
  change: number;
  change_percent: number;
  volume: number;
  market_status: string;
  last_updated: string;
}

// 나머지 인터페이스들 (아직 Zod로 마이그레이션 안된 것들)
export interface UniversePriceEntry {
  symbol: string;
  current_price: number;
  previous_close: number;
  change: number;
  change_percent: number;
  volume: number;
  last_updated: string;
  [key: string]: unknown;
}

export interface UniversePricesPayload {
  trading_day: string;
  symbols: UniversePriceEntry[];
  [key: string]: unknown;
}

export interface UniversePricesResponse {
  universe_prices: UniversePricesPayload;
}

export interface SettlementPriceData {
  symbol: string;
  trading_day: string;
  settlement_price: number;
  base_price: number;
  price_change: number;
  change_percent: number;
  can_settle: boolean;
  void_reason?: string | null;
}

export interface SettlementValidationResponse {
  settlement_data: SettlementPriceData[];
}

export type PricePredictionOutcome = "CORRECT" | "INCORRECT";

export interface PriceComparisonResult {
  symbol: string;
  trading_day: string;
  current_price: number;
  base_price: number;
  price_change: number;
  change_percent: number;
  prediction_result: PricePredictionOutcome;
  prediction_id?: number;
  base_price_source?: string;
}

export interface PriceComparisonResponse {
  comparison: PriceComparisonResult;
}

export interface EODCollectionDetail {
  symbol: string;
  success: boolean;
  error_message?: string | null;
  eod_price?: EODPrice;
}

export interface EODCollectionResult {
  trading_day: string;
  total_symbols: number;
  successful_collections: number;
  failed_collections: number;
  collection_details: EODCollectionDetail[];
}

export interface EODCollectionResponse extends EODCollectionResult {}
