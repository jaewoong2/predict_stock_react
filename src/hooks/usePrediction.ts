import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { predictionService } from "../services/predictionService";
import {
  Prediction,
  PredictionCreate,
  PredictionUpdate,
  PredictionHistoryParams,
} from "../types/prediction";

// ============================================================================
// Query Keys
// ============================================================================

export const PREDICTION_KEYS = {
  all: ["predictions"] as const,
  history: (params?: PredictionHistoryParams) =>
    [...PREDICTION_KEYS.all, "history", params] as const,
  forDay: (tradingDay: string) =>
    [...PREDICTION_KEYS.all, "day", tradingDay] as const,
  remaining: (tradingDay: string) =>
    [...PREDICTION_KEYS.all, "remaining", tradingDay] as const,
} as const;

// ============================================================================
// Prediction Mutation Hooks
// ============================================================================

/**
 * 예측 제출 훅
 */
export const useSubmitPrediction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      symbol,
      choice,
    }: {
      symbol: string;
      choice: PredictionCreate["choice"];
    }) => predictionService.submitPrediction(symbol, choice),
    onSuccess: () => {
      // 관련 데이터 무효화
      queryClient.invalidateQueries({ queryKey: PREDICTION_KEYS.all });
    },
  });
};

/**
 * 예측 수정 훅
 */
export const useUpdatePrediction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      predictionId,
      choice,
    }: {
      predictionId: number;
      choice: PredictionUpdate["choice"];
    }) => predictionService.updatePrediction(predictionId, choice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PREDICTION_KEYS.all });
    },
  });
};

/**
 * 예측 취소 훅
 */
export const useCancelPrediction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (predictionId: number) =>
      predictionService.cancelPrediction(predictionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PREDICTION_KEYS.all });
    },
  });
};

// ============================================================================
// Prediction Query Hooks
// ============================================================================

/**
 * 예측 이력 조회 훅 (무한 스크롤)
 */
export const usePredictionHistory = (params?: PredictionHistoryParams) => {
  return useInfiniteQuery({
    queryKey: PREDICTION_KEYS.history(params),
    queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
      predictionService.getPredictionHistory({
        ...params,
        offset: pageParam as number,
      }),
    getNextPageParam: (lastPage: Prediction[], allPages) => {
      const limit = params?.limit || 50;
      return Array.isArray(lastPage) && lastPage.length === limit
        ? allPages.length * limit
        : undefined;
    },
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000, // 2분
  });
};

/**
 * 특정 날짜 예측 조회 훅
 */
export const usePredictionsForDay = (tradingDay: string) => {
  return useQuery({
    queryKey: PREDICTION_KEYS.forDay(tradingDay),
    queryFn: () => predictionService.getUserPredictionsForDay(tradingDay),
    enabled: !!tradingDay,
    staleTime: 30 * 1000, // 30초
  });
};

/**
 * 남은 예측 슬롯 조회 훅
 */
export const useRemainingPredictions = (tradingDay: string) => {
  return useQuery({
    queryKey: PREDICTION_KEYS.remaining(tradingDay),
    queryFn: () => predictionService.getRemainingPredictions(tradingDay),
    enabled: !!tradingDay,
    refetchInterval: 30 * 1000, // 30초마다 갱신
  });
};
