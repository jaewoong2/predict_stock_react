import { useQuery, UseQueryOptions } from "@tanstack/react-query";
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
 * 특정 날짜의 시그널 데이터를 가져오는 커스텀 훅
 * @param date 조회할 날짜 (YYYY-MM-DD 형식)
 * @param options React Query 옵션 (예: enabled)
 */
export const useSignalDataByDate = (
  date: string,
  options?: Omit<
    UseQueryOptions<SignalAPIResponse, Error>,
    "queryKey" | "queryFn"
  > // React Query 옵션 타입
) => {
  return useQuery<SignalAPIResponse, Error>({
    queryKey: SIGNAL_KEYS.listByDate(date),
    queryFn: () => signalApiService.getSignalsByDate(date),
    ...options,
    enabled: !!date && (options?.enabled === undefined || options.enabled), // 날짜가 있고, enabled 옵션이 true일 때만 실행
  });
};

export const useSignalDataByNameAndDate = (
  symbols: string[],
  date: string,
  strategy_type?: string | null,
  options?: Omit<
    UseQueryOptions<SignalAPIResponse, Error>,
    "queryKey" | "queryFn"
  > // React Query 옵션 타입
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
      signalApiService.getSignalByNameAndDate(symbols, date, strategy_type),
    ...options,
    enabled: !!date && (options?.enabled === undefined || options.enabled), // 심볼과 날짜가 모두 있고, enabled 옵션이 true일 때만 실행
  });
};

export const useWeeklyActionCount = (
  params: GetWeeklyActionCountParams,
  options?: Omit<
    UseQueryOptions<WeeklyActionCountResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<WeeklyActionCountResponse, Error>({
    queryKey: SIGNAL_KEYS.weeklyActionCount(params),
    queryFn: () => signalApiService.getWeeklyActionCount(params),
    ...options,
    enabled:
      !!params.action && (options?.enabled === undefined || options.enabled),
  });
};
