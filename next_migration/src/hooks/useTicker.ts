import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  TickerCreate,
  TickerUpdate,
  TickerMultiDateQuery,
  GetWeeklyPriceMovementParams,
  WeeklyPriceMovementResponse,
} from "../types/ticker";
import { tickerService } from "../services/tickerService";

// 쿼리 키 상수
export const TICKER_KEYS = {
  all: ["tickers"] as const,
  lists: () => [...TICKER_KEYS.all, "list"] as const,
  list: (filters: string) => [...TICKER_KEYS.lists(), { filters }] as const,
  details: () => [...TICKER_KEYS.all, "detail"] as const,
  detail: (id: number) => [...TICKER_KEYS.details(), id] as const,
  bySymbol: (symbol: string) =>
    [...TICKER_KEYS.details(), "symbol", symbol] as const,
  byDate: (symbol: string, date: string) =>
    [...TICKER_KEYS.details(), "date", symbol, date] as const,
  weeklyPriceMovement: (params: GetWeeklyPriceMovementParams) =>
    [...TICKER_KEYS.all, "weeklyPriceMovement", params] as const,
};

// Custom Hooks
export const useTickers = () => {
  return useQuery({
    queryKey: TICKER_KEYS.lists(),
    queryFn: tickerService.getAllTickers,
  });
};

export const useTickerById = (tickerId: number) => {
  return useQuery({
    queryKey: TICKER_KEYS.detail(tickerId),
    queryFn: () => tickerService.getTickerById(tickerId),
    enabled: !!tickerId, // ID가 있을 때만 쿼리 실행
  });
};

export const useTickerBySymbol = (symbol: string) => {
  return useQuery({
    queryKey: TICKER_KEYS.bySymbol(symbol),
    queryFn: () => tickerService.getTickerBySymbol(symbol),
    enabled: !!symbol, // 심볼이 있을 때만 쿼리 실행
  });
};

export const useTickerByDate = (symbol: string, date: string) => {
  return useQuery({
    queryKey: TICKER_KEYS.byDate(symbol, date),
    queryFn: () => tickerService.getTickerByDate(symbol, date),
    enabled: !!symbol && !!date, // 심볼과 날짜가 모두 있을 때만 쿼리 실행
  });
};

export const useTickerChanges = (query: TickerMultiDateQuery | undefined) => {
  return useQuery({
    queryKey: [
      ...TICKER_KEYS.details(),
      "changes",
      query?.symbol,
      query?.dates,
    ],
    queryFn: () => tickerService.getTickerChanges(query!),
    enabled: !!query && !!query.symbol && query.dates.length > 0, // 필수 데이터가 있을 때만 쿼리 실행
  });
};

// Mutation Hooks
export const useCreateTicker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTicker: TickerCreate) =>
      tickerService.createTicker(newTicker),
    onSuccess: () => {
      // 성공 시 티커 목록 쿼리 무효화 (새로고침)
      queryClient.invalidateQueries({ queryKey: TICKER_KEYS.lists() });
    },
  });
};

export const useUpdateTicker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tickerId,
      tickerData,
    }: {
      tickerId: number;
      tickerData: TickerUpdate;
    }) => tickerService.updateTicker(tickerId, tickerData),
    onSuccess: (updatedTicker) => {
      // 성공 시 해당 티커와 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: TICKER_KEYS.detail(updatedTicker.id),
      });
      queryClient.invalidateQueries({ queryKey: TICKER_KEYS.lists() });
    },
  });
};

export const useDeleteTicker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tickerId: number) => tickerService.deleteTicker(tickerId),
    onSuccess: (_, tickerId) => {
      // 성공 시 해당 티커와 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: TICKER_KEYS.detail(tickerId) });
      queryClient.invalidateQueries({ queryKey: TICKER_KEYS.lists() });
    },
  });
};

export const useWeeklyPriceMovement = (
  params: GetWeeklyPriceMovementParams,
  options?: Omit<
    UseQueryOptions<WeeklyPriceMovementResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<WeeklyPriceMovementResponse, Error>({
    queryKey: TICKER_KEYS.weeklyPriceMovement(params),
    queryFn: () => tickerService.getWeeklyPriceMovement(params),
    ...options,
    enabled:
      !!params.direction && (options?.enabled === undefined || options.enabled),
  });
};
