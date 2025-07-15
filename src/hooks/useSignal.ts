import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  GetWeeklyActionCountParams,
  SignalAPIResponse,
  WeeklyActionCountResponse,
  Signal,
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
 * 특정 날짜의 시그널 데이터를 가져오는 커스텀 훅
 * @param date 조회할 날짜 (YYYY-MM-DD 형식)
 * @param options React Query 옵션 (예: enabled)
 */
export const useSignalDataByDate = (
  date: string,
  options?: Omit<
    UseQueryOptions<SignalAPIResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<SignalAPIResponse, Error>({
    queryKey: [...SIGNAL_KEYS.listByDate(date)],
    queryFn: () => signalApiService.getSignalsByDate(date),
    ...options,
    enabled: !!date && (options?.enabled === undefined || options.enabled),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 데이터 사용
  });
};

/**
 * 심볼과 날짜로 시그널 데이터를 가져오는 커스텀 훅
 */

export const useSignalDataByNameAndDate = (
  symbols: string[],
  date: string,
  strategy_type?: string | null,
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
    ],
    queryFn: () =>
      signalApiService.getSignalByNameAndDate(
        symbols,
        date,
        strategy_type,
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
    UseQueryOptions<Signal[], Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<Signal[], Error>({
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
