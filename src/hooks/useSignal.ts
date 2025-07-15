import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import {
  GetWeeklyActionCountParams,
  SignalAPIResponse,
  WeeklyActionCountResponse,
} from "../types/signal";
import { signalApiService } from "@/services/signalService";

export const SIGNAL_KEYS = {
  all: ["signals"] as const,
  lists: () => [...SIGNAL_KEYS.all, "list"] as const,
  listByDate: (date: string) => [...SIGNAL_KEYS.lists(), { date }] as const,
  weeklyActionCount: (params: GetWeeklyActionCountParams) =>
    [...SIGNAL_KEYS.all, "weeklyActionCount", params] as const,
};

/**
 * 특정 날짜의 시그널 데이터를 가져오는 커스텀 훅 (무한 스크롤 지원)
 * @param date 조회할 날짜 (YYYY-MM-DD 형식)
 * @param pageSize 페이지당 항목 수
 * @param options React Query 옵션 (예: enabled)
 */
export const useInfiniteSignalDataByDate = (
  date: string,
  pageSize: number = 20,
  options?: Omit<
    UseInfiniteQueryOptions<SignalAPIResponse, Error>,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >,
) => {
  return useInfiniteQuery({
    queryKey: [...SIGNAL_KEYS.listByDate(date), pageSize],
    queryFn: ({ pageParam = 0 }) =>
      signalApiService.getSignalsByDate(date, pageParam as number, pageSize),
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination?.has_next) return undefined;
      return lastPage.pagination.page + 1;
    },
    initialPageParam: 0,
    ...options,
    enabled: !!date && (options?.enabled === undefined || options.enabled),
  });
};

/**
 * 특정 날짜의 시그널 데이터를 가져오는 커스텀 훅 (기존 페이지네이션)
 * @param date 조회할 날짜 (YYYY-MM-DD 형식)
 * @param page 현재 페이지 번호
 * @param pageSize 페이지당 항목 수
 * @param options React Query 옵션 (예: enabled)
 */
export const useSignalDataByDate = (
  date: string,
  page: number = 1,
  pageSize: number = 20,
  options?: Omit<
    UseQueryOptions<SignalAPIResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<SignalAPIResponse, Error>({
    queryKey: [...SIGNAL_KEYS.listByDate(date), { page, pageSize }],
    queryFn: () => signalApiService.getSignalsByDate(date, page, pageSize),
    ...options,
    enabled: !!date && (options?.enabled === undefined || options.enabled),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 데이터 사용
  });
};

/**
 * 심볼과 날짜로 시그널 데이터를 가져오는 커스텀 훅 (무한 스크롤 지원)
 */
export const useInfiniteSignalDataByNameAndDate = (
  symbols: string[],
  date: string,
  strategy_type?: string | null,
  pageSize: number = 20,
  options?: Omit<
    UseInfiniteQueryOptions<SignalAPIResponse, Error>,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >,
) => {
  return useInfiniteQuery({
    queryKey: [
      ...SIGNAL_KEYS.all,
      "byNameAndDate",
      symbols.join(","),
      date,
      strategy_type,
      { pageSize },
    ],
    queryFn: ({ pageParam = 1 }) =>
      signalApiService.getSignalByNameAndDate(
        symbols,
        date,
        strategy_type,
        pageParam as number,
        pageSize,
      ),
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination?.has_next) return undefined;
      return lastPage.pagination.page + 1;
    },
    initialPageParam: 1,
    ...options,
    enabled: !!date && (options?.enabled === undefined || options.enabled),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 데이터 사용
  });
};

export const useSignalDataByNameAndDate = (
  symbols: string[],
  date: string,
  strategy_type?: string | null,
  page: number = 1,
  pageSize: number = 20,
  options?: Omit<
    UseQueryOptions<SignalAPIResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<SignalAPIResponse, Error>({
    queryKey: [
      ...SIGNAL_KEYS.all,
      "byNameAndDate",
      symbols.join(","),
      date,
      strategy_type,
      { page, pageSize },
    ],
    queryFn: () =>
      signalApiService.getSignalByNameAndDate(
        symbols,
        date,
        strategy_type,
        page,
        pageSize,
      ),
    ...options,
    enabled: !!date && (options?.enabled === undefined || options.enabled),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 데이터 사용
  });
};

export const useWeeklyActionCount = (
  params: GetWeeklyActionCountParams,
  options?: Omit<
    UseQueryOptions<WeeklyActionCountResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<WeeklyActionCountResponse, Error>({
    queryKey: SIGNAL_KEYS.weeklyActionCount(params),
    queryFn: () => signalApiService.getWeeklyActionCount(params),
    ...options,
    enabled:
      !!params.action && (options?.enabled === undefined || options.enabled),
  });
};

export const useTranslatedSignalDataByTickerAndDate = (
  ticker: string,
  date: string,
  strategy_type?: string | null,
  options?: Omit<
    UseQueryOptions<SignalAPIResponse["data"][0]["signal"][], Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<SignalAPIResponse["data"][0]["signal"][], Error>({
    queryKey: [
      ...SIGNAL_KEYS.all,
      "translatedByTickerAndDate",
      ticker,
      date,
      strategy_type,
    ],
    queryFn: () =>
      signalApiService.getTranslatedSignalDataByTickerAndDate(
        ticker,
        date,
        strategy_type,
      ),
    ...options,
    enabled: !!date && (options?.enabled === undefined || options.enabled),
  });
};
