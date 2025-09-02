import { z } from "zod";
import {
  DateStringSchema,
  DateTimeStringSchema,
  PositiveNumberSchema,
} from "./common";

// ============================================================================
// Core Universe Types
// ============================================================================

export const UniverseItemSchema = z.object({
  symbol: z.string().regex(/^[A-Z]{1,5}$/, "심볼은 대문자 1-5자여야 합니다"),
  seq: z.number().min(1).max(20), // 1-20 순서
});

export const UniverseItemWithPriceSchema = UniverseItemSchema.extend({
  symbol: z.string(),
  company_name: z.string(),
  current_price: PositiveNumberSchema,
  previous_close: PositiveNumberSchema,
  change_percent: z.number(),
  change_direction: z.enum(["UP", "DOWN", "FLAT"]),
  formatted_change: z.string(), // '+2.01%' 형식
});

export const UniverseResponseSchema = z.object({
  trading_day: DateStringSchema,
  symbols: z.array(UniverseItemSchema),
  total_count: z.number(),
});

export const UniverseWithPricesResponseSchema = z.object({
  trading_day: DateStringSchema,
  symbols: z.array(UniverseItemWithPriceSchema),
  total_count: z.number(),
  last_updated: DateTimeStringSchema,
});

export type UniverseItem = z.infer<typeof UniverseItemSchema>;
export type UniverseItemWithPrice = z.infer<typeof UniverseItemWithPriceSchema>;
export type UniverseResponse = z.infer<typeof UniverseResponseSchema>;
export type UniverseWithPricesResponse = z.infer<
  typeof UniverseWithPricesResponseSchema
>;

// ============================================================================
// Extended Universe Types
// ============================================================================

export const UniverseItemExtendedSchema = UniverseItemWithPriceSchema.extend({
  market_cap: z.number().optional(),
  volume: z.number().optional(),
  pe_ratio: z.number().optional(),
  dividend_yield: z.number().optional(),
  sector: z.string().optional(),
  industry: z.string().optional(),
  exchange: z.string().optional(),
  is_active: z.boolean(),
  added_date: DateStringSchema,
  removed_date: DateStringSchema.optional(),
});

export const UniverseHistorySchema = z.object({
  trading_day: DateStringSchema,
  added_symbols: z.array(UniverseItemSchema),
  removed_symbols: z.array(UniverseItemSchema),
  total_changes: z.number(),
});

export const UniverseChangeSchema = z.object({
  symbol: z.string(),
  action: z.enum(["ADDED", "REMOVED", "REORDERED"]),
  old_seq: z.number().optional(),
  new_seq: z.number().optional(),
  reason: z.string().optional(),
  effective_date: DateStringSchema,
});

export type UniverseItemExtended = z.infer<typeof UniverseItemExtendedSchema>;
export type UniverseHistory = z.infer<typeof UniverseHistorySchema>;
export type UniverseChange = z.infer<typeof UniverseChangeSchema>;

// ============================================================================
// Universe Analytics Types
// ============================================================================

export const UniverseAnalyticsSchema = z.object({
  trading_day: DateStringSchema,
  total_symbols: z.number(),
  up_symbols: z.number(),
  down_symbols: z.number(),
  flat_symbols: z.number(),
  average_change_percent: z.number(),
  best_performer: z.object({
    symbol: z.string(),
    change_percent: z.number(),
    company_name: z.string(),
  }),
  worst_performer: z.object({
    symbol: z.string(),
    change_percent: z.number(),
    company_name: z.string(),
  }),
});

export const UniversePerformanceSchema = z.object({
  trading_day: DateStringSchema,
  total_symbols: z.number(),
  average_change_percent: z.number(),
  sector_performance: z.array(
    z.object({
      sector: z.string(),
      count: z.number(),
      average_change: z.number(),
      best_performer: z.object({
        symbol: z.string(),
        change_percent: z.number(),
        company_name: z.string(),
      }),
      worst_performer: z.object({
        symbol: z.string(),
        change_percent: z.number(),
        company_name: z.string(),
      }),
    }),
  ),
});

export type UniverseAnalytics = z.infer<typeof UniverseAnalyticsSchema>;
export type UniversePerformance = z.infer<typeof UniversePerformanceSchema>;

// ============================================================================
// Universe Comparison Types
// ============================================================================

export const UniverseComparisonSchema = z.object({
  base_date: DateStringSchema,
  compare_date: DateStringSchema,
  common_symbols: z.array(
    z.object({
      symbol: z.string(),
      company_name: z.string(),
      base_price: z.number(),
      compare_price: z.number(),
      price_change: z.number(),
      price_change_percent: z.number(),
    }),
  ),
  added_symbols: z.array(UniverseItemWithPriceSchema),
  removed_symbols: z.array(UniverseItemWithPriceSchema),
  total_changes: z.number(),
});

export type UniverseComparison = z.infer<typeof UniverseComparisonSchema>;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * 심볼 유효성 검사
 */
export const isValidSymbol = (symbol: string): boolean => {
  return /^[A-Z]{1,5}$/.test(symbol);
};

/**
 * 심볼 정규화 (대문자 변환)
 */
export const normalizeSymbol = (symbol: string): string => {
  return symbol.toUpperCase().trim();
};

/**
 * 변화율에 따른 색상 클래스 반환
 */
export const getChangeColor = (
  changeDirection: "UP" | "DOWN" | "FLAT",
): string => {
  switch (changeDirection) {
    case "UP":
      return "text-green-600";
    case "DOWN":
      return "text-red-600";
    case "FLAT":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
};

/**
 * 변화율에 따른 배경 색상 클래스 반환
 */
export const getChangeBgColor = (
  changeDirection: "UP" | "DOWN" | "FLAT",
): string => {
  switch (changeDirection) {
    case "UP":
      return "bg-green-100";
    case "DOWN":
      return "bg-red-100";
    case "FLAT":
      return "bg-gray-100";
    default:
      return "bg-gray-100";
  }
};

/**
 * 변화율에 따른 아이콘 반환
 */
export const getChangeIcon = (
  changeDirection: "UP" | "DOWN" | "FLAT",
): string => {
  switch (changeDirection) {
    case "UP":
      return "↗️";
    case "DOWN":
      return "↘️";
    case "FLAT":
      return "→";
    default:
      return "→";
  }
};

/**
 * 가격 포맷팅
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * 변화율 포맷팅
 */
export const formatChangePercent = (changePercent: number): string => {
  const sign = changePercent >= 0 ? "+" : "";
  return `${sign}${changePercent.toFixed(2)}%`;
};

/**
 * 거래량 포맷팅
 */
export const formatVolume = (volume: number): string => {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(2)}B`;
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(2)}M`;
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(2)}K`;
  }
  return volume.toString();
};

/**
 * 시가총액 포맷팅
 */
export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  }
  return `$${marketCap.toLocaleString()}`;
};

/**
 * 종목이 활성 상태인지 확인
 */
export const isActiveSymbol = (item: UniverseItemExtended): boolean => {
  return item.is_active && !item.removed_date;
};

/**
 * 종목이 새로 추가되었는지 확인
 */
export const isNewlyAdded = (
  item: UniverseItemExtended,
  tradingDay: string,
): boolean => {
  return item.added_date === tradingDay;
};

/**
 * 종목이 제거되었는지 확인
 */
export const isRemoved = (item: UniverseItemExtended): boolean => {
  return !!item.removed_date;
};

/**
 * 변화율에 따른 성과 등급 반환
 */
export const getPerformanceGrade = (changePercent: number): string => {
  if (changePercent >= 5) return "A+";
  if (changePercent >= 3) return "A";
  if (changePercent >= 1) return "B+";
  if (changePercent >= 0) return "B";
  if (changePercent >= -1) return "C+";
  if (changePercent >= -3) return "C";
  if (changePercent >= -5) return "D";
  return "F";
};

/**
 * 성과 등급에 따른 색상 반환
 */
export const getGradeColor = (grade: string): string => {
  switch (grade) {
    case "A+":
    case "A":
      return "text-green-600";
    case "B+":
    case "B":
      return "text-blue-600";
    case "C+":
    case "C":
      return "text-yellow-600";
    case "D":
      return "text-orange-600";
    case "F":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};
