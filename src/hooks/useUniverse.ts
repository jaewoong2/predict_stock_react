import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { universeService } from "../services/universeService";
import {
  UniverseResponse,
  UniverseWithPricesResponse,
  UniverseItem,
  UniverseItemExtended,
  UniverseHistory,
  UniverseChange,
  UniverseAnalytics,
  UniversePerformance,
  UniverseComparison,
} from "../types/universe";

// ============================================================================
// Query Keys
// ============================================================================

export const UNIVERSE_KEYS = {
  all: ["universe"] as const,
  today: () => [...UNIVERSE_KEYS.all, "today"] as const,
  todayWithPrices: () =>
    [...UNIVERSE_KEYS.all, "today", "with-prices"] as const,
  byDate: (date: string) => [...UNIVERSE_KEYS.all, "date", date] as const,
  byDateWithPrices: (date: string) =>
    [...UNIVERSE_KEYS.all, "date", date, "with-prices"] as const,
  history: (startDate: string, endDate: string) =>
    [...UNIVERSE_KEYS.all, "history", startDate, endDate] as const,
  changes: (date: string) => [...UNIVERSE_KEYS.all, "changes", date] as const,
  extended: (date?: string) =>
    [...UNIVERSE_KEYS.all, "extended", date] as const,
  active: (date?: string) => [...UNIVERSE_KEYS.all, "active", date] as const,
  analytics: (date?: string) =>
    [...UNIVERSE_KEYS.all, "analytics", date] as const,
  performance: (date?: string) =>
    [...UNIVERSE_KEYS.all, "performance", date] as const,
  filtered: (filter: any, sort?: any, date?: string) =>
    [...UNIVERSE_KEYS.all, "filtered", filter, sort, date] as const,
  search: (search: any) => [...UNIVERSE_KEYS.all, "search", search] as const,
  symbol: (symbol: string, date?: string) =>
    [...UNIVERSE_KEYS.all, "symbol", symbol, date] as const,
  comparison: (date1: string, date2: string) =>
    [...UNIVERSE_KEYS.all, "comparison", date1, date2] as const,
} as const;

// ============================================================================
// Core Universe Hooks
// ============================================================================

/**
 * 오늘의 종목 조회 훅
 */
export const useTodayUniverse = (
  options?: Omit<
    UseQueryOptions<UniverseResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: UNIVERSE_KEYS.today(),
    queryFn: universeService.getTodayUniverse,
    staleTime: 5 * 60 * 1000, // 5분
    ...options,
  });
};

/**
 * 가격 정보 포함 오늘의 종목 조회 훅
 */
export const useTodayUniverseWithPrices = (
  options?: Omit<
    UseQueryOptions<UniverseWithPricesResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: UNIVERSE_KEYS.todayWithPrices(),
    queryFn: universeService.getTodayUniverseWithPrices,
    staleTime: 30 * 1000, // 30초
    refetchInterval: 30 * 1000, // 30초마다 갱신
    ...options,
  });
};

// ============================================================================
// Historical Universe Hooks
// ============================================================================

/**
 * 특정 날짜의 종목 조회 훅
 */
export const useUniverseByDate = (
  date: string,
  options?: Omit<
    UseQueryOptions<UniverseResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: UNIVERSE_KEYS.byDate(date),
    queryFn: () => universeService.getUniverseByDate(date),
    enabled: !!date,
    staleTime: 10 * 60 * 1000, // 10분
    ...options,
  });
};

/**
 * 특정 날짜의 가격 정보 포함 종목 조회 훅
 */
export const useUniverseWithPricesByDate = (
  date: string,
  options?: Omit<
    UseQueryOptions<UniverseWithPricesResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: UNIVERSE_KEYS.byDateWithPrices(date),
    queryFn: () => universeService.getUniverseWithPricesByDate(date),
    enabled: !!date,
    staleTime: 5 * 60 * 1000, // 5분
    ...options,
  });
};

/**
 * 기간별 종목 이력 조회 훅
 */
export const useUniverseHistory = (
  startDate: string,
  endDate: string,
  options?: Omit<
    UseQueryOptions<UniverseHistory[], Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: UNIVERSE_KEYS.history(startDate, endDate),
    queryFn: () => universeService.getUniverseHistory(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 30 * 60 * 1000, // 30분
    ...options,
  });
};

/**
 * 종목 변경 이력 조회 훅
 */
export const useUniverseChanges = (
  date: string,
  options?: Omit<
    UseQueryOptions<UniverseChange[], Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: UNIVERSE_KEYS.changes(date),
    queryFn: () => universeService.getUniverseChanges(date),
    enabled: !!date,
    staleTime: 60 * 60 * 1000, // 1시간
    ...options,
  });
};

// ============================================================================
// Extended Universe Hooks
// ============================================================================

/**
 * 확장 정보 포함 종목 조회 훅
 */
export const useExtendedUniverse = (
  date?: string,
  options?: Omit<
    UseQueryOptions<UniverseItemExtended[], Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: UNIVERSE_KEYS.extended(date),
    queryFn: () => universeService.getExtendedUniverse(date),
    staleTime: 5 * 60 * 1000, // 5분
    ...options,
  });
};

/**
 * 활성 종목만 조회 훅
 */
export const useActiveUniverse = (
  date?: string,
  options?: Omit<
    UseQueryOptions<UniverseItemExtended[], Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: UNIVERSE_KEYS.active(date),
    queryFn: () => universeService.getActiveUniverse(date),
    staleTime: 5 * 60 * 1000, // 5분
    ...options,
  });
};

// ============================================================================
// Analytics Hooks
// ============================================================================

/**
 * 유니버스 분석 데이터 조회 훅
 */
export const useUniverseAnalytics = (
  date?: string,
  options?: Omit<
    UseQueryOptions<UniverseAnalytics, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: UNIVERSE_KEYS.analytics(date),
    queryFn: () => universeService.getUniverseAnalytics(date),
    staleTime: 10 * 60 * 1000, // 10분
    ...options,
  });
};

/**
 * 유니버스 성과 데이터 조회 훅
 */
export const useUniversePerformance = (
  date?: string,
  options?: Omit<
    UseQueryOptions<UniversePerformance, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: UNIVERSE_KEYS.performance(date),
    queryFn: () => universeService.getUniversePerformance(date),
    staleTime: 10 * 60 * 1000, // 10분
    ...options,
  });
};

// ============================================================================
// Individual Symbol Hooks
// ============================================================================

/**
 * 특정 종목 정보 조회 훅
 */
export const useSymbolInfo = (
  symbol: string,
  date?: string,
  options?: Omit<UseQueryOptions<UniverseItem, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: UNIVERSE_KEYS.symbol(symbol, date),
    queryFn: () => universeService.getSymbolInfo(symbol, date),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5분
    ...options,
  });
};

// ============================================================================
// Comparison Hooks
// ============================================================================

/**
 * 유니버스 비교 훅
 */
export const useUniverseComparison = (
  date1: string,
  date2: string,
  options?: Omit<
    UseQueryOptions<UniverseComparison, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: UNIVERSE_KEYS.comparison(date1, date2),
    queryFn: () => universeService.compareUniverses(date1, date2),
    enabled: !!date1 && !!date2,
    staleTime: 10 * 60 * 1000, // 10분
    ...options,
  });
};

// ============================================================================
// Management Hooks (Admin Only)
// ============================================================================

/**
 * 종목 순서 변경 훅 (관리자용)
 */
export const useReorderUniverse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reorders,
      date,
    }: {
      reorders: Array<{ symbol: string; new_seq: number }>;
      date?: string;
    }) => universeService.reorderUniverse(reorders, date),
    onSuccess: (_, { date }) => {
      // 관련 쿼리 무효화
      if (date) {
        queryClient.invalidateQueries({ queryKey: UNIVERSE_KEYS.byDate(date) });
        queryClient.invalidateQueries({
          queryKey: UNIVERSE_KEYS.byDateWithPrices(date),
        });
      } else {
        queryClient.invalidateQueries({ queryKey: UNIVERSE_KEYS.today() });
        queryClient.invalidateQueries({
          queryKey: UNIVERSE_KEYS.todayWithPrices(),
        });
      }
    },
  });
};

/**
 * 유니버스 일괄 업데이트 훅 (관리자용)
 */
export const useUpdateUniverse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      updates,
      date,
    }: {
      updates: {
        adds?: Array<{ symbol: string; seq: number }>;
        removes?: string[];
        reorders?: Array<{ symbol: string; new_seq: number }>;
      };
      date?: string;
    }) => universeService.updateUniverse(updates, date),
    onSuccess: (_, { date }) => {
      // 관련 쿼리 무효화
      if (date) {
        queryClient.invalidateQueries({ queryKey: UNIVERSE_KEYS.byDate(date) });
        queryClient.invalidateQueries({
          queryKey: UNIVERSE_KEYS.byDateWithPrices(date),
        });
      } else {
        queryClient.invalidateQueries({ queryKey: UNIVERSE_KEYS.today() });
        queryClient.invalidateQueries({
          queryKey: UNIVERSE_KEYS.todayWithPrices(),
        });
      }
    },
  });
};
