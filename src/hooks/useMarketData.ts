import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { marketDataService } from "@/services/marketDataService";
import {
  AnalystPriceTargetsParams,
  AnalystPriceTargetsResponse,
  ETFFlowsParams,
  ETFFlowsResponse,
  ETFPortfolioParams,
  ETFPortfolioResponse,
  InsiderTrendsParams,
  InsiderTrendsResponse,
  LiquidityParams,
  LiquidityResponse,
  MarketBreadthParams,
  MarketBreadthResponse,
} from "@/types/market-data";

// ============================================================================
// Query Keys
// ============================================================================

export const MARKET_DATA_KEYS = {
  all: ["marketData"] as const,
  analystPriceTargets: (params: AnalystPriceTargetsParams) =>
    [...MARKET_DATA_KEYS.all, "analystPriceTargets", params] as const,
  etfFlows: (params: ETFFlowsParams) =>
    [...MARKET_DATA_KEYS.all, "etfFlows", params] as const,
  liquidity: (params: LiquidityParams) =>
    [...MARKET_DATA_KEYS.all, "liquidity", params] as const,
  marketBreadth: (params: MarketBreadthParams) =>
    [...MARKET_DATA_KEYS.all, "marketBreadth", params] as const,
  insiderTrends: (params: InsiderTrendsParams) =>
    [...MARKET_DATA_KEYS.all, "insiderTrends", params] as const,
  etfPortfolio: (params: ETFPortfolioParams) =>
    [...MARKET_DATA_KEYS.all, "etfPortfolio", params] as const,
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * 애널리스트 목표가 조회 훅
 */
export const useAnalystPriceTargets = (
  params: AnalystPriceTargetsParams = {},
  options?: Omit<
    UseQueryOptions<AnalystPriceTargetsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<AnalystPriceTargetsResponse, Error>({
    queryKey: MARKET_DATA_KEYS.analystPriceTargets(params),
    queryFn: () => marketDataService.getAnalystPriceTargets(params),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    ...options,
  });
};

/**
 * ETF 자금 흐름 조회 훅
 */
export const useETFFlows = (
  params: ETFFlowsParams = {},
  options?: Omit<
    UseQueryOptions<ETFFlowsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<ETFFlowsResponse, Error>({
    queryKey: MARKET_DATA_KEYS.etfFlows(params),
    queryFn: () => marketDataService.getETFFlows(params),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    ...options,
  });
};

/**
 * 유동성 지표 조회 훅
 */
export const useLiquidity = (
  params: LiquidityParams = {},
  options?: Omit<
    UseQueryOptions<LiquidityResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<LiquidityResponse, Error>({
    queryKey: MARKET_DATA_KEYS.liquidity(params),
    queryFn: () => marketDataService.getLiquidity(params),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    ...options,
  });
};

/**
 * 시장 폭 지표 조회 훅
 */
export const useMarketBreadth = (
  params: MarketBreadthParams = {},
  options?: Omit<
    UseQueryOptions<MarketBreadthResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<MarketBreadthResponse, Error>({
    queryKey: MARKET_DATA_KEYS.marketBreadth(params),
    queryFn: () => marketDataService.getMarketBreadth(params),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    ...options,
  });
};

/**
 * 내부자 거래 트렌드 조회 훅
 */
export const useInsiderTrends = (
  params: InsiderTrendsParams = {},
  options?: Omit<
    UseQueryOptions<InsiderTrendsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<InsiderTrendsResponse, Error>({
    queryKey: MARKET_DATA_KEYS.insiderTrends(params),
    queryFn: () => marketDataService.getInsiderTrends(params),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    ...options,
  });
};

/**
 * ETF 포트폴리오 변동 조회 훅
 */
export const useETFPortfolio = (
  params: ETFPortfolioParams = {},
  options?: Omit<
    UseQueryOptions<ETFPortfolioResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<ETFPortfolioResponse, Error>({
    queryKey: MARKET_DATA_KEYS.etfPortfolio(params),
    queryFn: () => marketDataService.getETFPortfolio(params),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    ...options,
  });
};
