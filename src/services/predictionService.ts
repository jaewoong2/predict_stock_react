import { oxApi } from "./api";
import {
  Prediction,
  PredictionCreate,
  PredictionUpdate,
  PredictionHistoryParams,
  PredictionSubmitResponse,
  PredictionHistoryResponse,
  RemainingPredictionsResponse,
  DayPredictionsResponse,
  PredictionStats,
  DailyPredictionStats,
  PredictionValidation,
  PredictionAnalytics,
  PredictionTrend,
  PredictionChoice,
  normalizeSymbol,
  isValidSymbol,
  PredictionsForDayResponse,
} from "../types/prediction";
import {
  PAGINATION_LIMITS,
  PaginationParams,
  validatePaginationParams,
} from "../types/common";

export const predictionService = {
  // ============================================================================
  // Core Prediction Operations
  // ============================================================================

  /**
   * 예측 제출
   */
  submitPrediction: async (
    symbol: string,
    choice: PredictionCreate["choice"],
  ): Promise<PredictionSubmitResponse> => {
    const response = await oxApi.postWithBaseResponse<PredictionSubmitResponse>(`/predictions/${symbol.toUpperCase()}`, { choice });
    return response;
  },

  /**
   * 예측 수정
   */
  updatePrediction: async (
    predictionId: number,
    choice: PredictionUpdate["choice"],
  ): Promise<Prediction> => {
    const response = await oxApi.putWithBaseResponse<{
      prediction: Prediction;
    }>(`/predictions/${predictionId}`, { choice });
    return response.prediction;
  },

  // ============================================================================
  // Prediction Queries
  // ============================================================================

  /**
   * 특정 날짜 예측 조회
   */
  getUserPredictionsForDay: async (
    tradingDay: string,
  ): Promise<PredictionsForDayResponse> => {
    const response = await oxApi.getWithBaseResponse<{
      result: PredictionsForDayResponse;
    }>(`/predictions/day/${tradingDay}`);

    return response.result;
  },

  /**
   * 남은 예측 슬롯 조회
   */
  getRemainingPredictions: async (tradingDay: string): Promise<number> => {
    const response = await oxApi.getWithBaseResponse<{
      remaining_predictions: number;
    }>(`/predictions/remaining/${tradingDay}`);
    return response.remaining_predictions;
  },

  /**
   * 예측 이력 조회 (페이지네이션)
   */
  getPredictionHistory: async (
    params?: PredictionHistoryParams,
  ): Promise<Prediction[]> => {
    const validatedParams = validatePaginationParams(
      params || {},
      PAGINATION_LIMITS.PREDICTIONS_HISTORY,
    );

    const queryString = new URLSearchParams({
      limit: (
        validatedParams.limit || PAGINATION_LIMITS.PREDICTIONS_HISTORY.default
      ).toString(),
      offset: (validatedParams.offset || 0).toString(),
    });

    const response = await oxApi.getWithBaseResponse<{
      history: Prediction[];
    }>(`/predictions/history?${queryString}`);

    if (response.history) {
      return response.history;
    }

    return [];
  },

  // ============================================================================
  // Prediction Statistics
  // ============================================================================

  /**
   * 일별 예측 통계 조회
   */
  getDailyPredictionStats: async (
    startDate: string,
    endDate: string,
  ): Promise<DailyPredictionStats[]> => {
    const response = await oxApi.get<DailyPredictionStats[]>(
      "/predictions/stats/daily",
      {
        params: { start_date: startDate, end_date: endDate },
      },
    );
    return response.data;
  },

  /**
   * 특정 종목 예측 분석 조회
   */
  getPredictionAnalytics: async (
    symbol: string,
  ): Promise<PredictionAnalytics> => {
    const normalizedSymbol = normalizeSymbol(symbol);
    const response = await oxApi.get<PredictionAnalytics>(
      `/predictions/analytics/${normalizedSymbol}`,
    );
    return response.data;
  },

  /**
   * 예측 트렌드 조회
   */
  getPredictionTrends: async (
    days: number = 30,
  ): Promise<PredictionTrend[]> => {
    const response = await oxApi.get<PredictionTrend[]>("/predictions/trends", {
      params: { days },
    });
    return response.data;
  },

  // ============================================================================
  // Prediction Validation
  // ============================================================================

  /**
   * 예측 가능 여부 확인
   */
  canPredictNow: async (tradingDay?: string): Promise<PredictionValidation> => {
    const url = tradingDay
      ? `/predictions/validate?trading_day=${tradingDay}`
      : "/predictions/validate";

    const response = await oxApi.get<PredictionValidation>(url);
    return response.data;
  },

  /**
   * 특정 종목 예측 가능 여부 확인
   */
  canPredictSymbol: async (
    symbol: string,
    tradingDay?: string,
  ): Promise<PredictionValidation> => {
    const normalizedSymbol = normalizeSymbol(symbol);
    const params = tradingDay ? { trading_day: tradingDay } : {};

    const response = await oxApi.get<PredictionValidation>(
      `/predictions/validate/${normalizedSymbol}`,
      {
        params,
      },
    );
    return response.data;
  },

  // ============================================================================
  // Batch Operations
  // ============================================================================

  /**
   * 여러 종목 예측 제출
   */
  submitMultiplePredictions: async (
    predictions: Array<{ symbol: string; choice: PredictionChoice }>,
  ): Promise<Prediction[]> => {
    const normalizedPredictions = predictions.map((pred) => ({
      symbol: normalizeSymbol(pred.symbol),
      choice: pred.choice,
    }));

    const response = await oxApi.post<{ predictions: Prediction[] }>(
      "/predictions/batch",
      { predictions: normalizedPredictions },
    );
    return response.data.predictions;
  },

  /**
   * 예측 일괄 취소
   */
  cancelMultiplePredictions: async (
    predictionIds: number[],
  ): Promise<Prediction[]> => {
    const response = await oxApi.delete<{ predictions: Prediction[] }>(
      "/predictions/batch",
      {
        body: JSON.stringify({ prediction_ids: predictionIds }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.predictions;
  },

  // ============================================================================
  // Advanced Queries
  // ============================================================================

  /**
   * 정답 예측 조회
   */
  getCorrectPredictions: async (
    params?: PredictionHistoryParams,
  ): Promise<Prediction[]> => {
    const validatedParams = validatePaginationParams(
      params || {},
      PAGINATION_LIMITS.PREDICTIONS_HISTORY,
    );

    const queryParams = {
      ...validatedParams,
      status: "CORRECT",
    };

    const response = await oxApi.get<PredictionHistoryResponse>(
      "/predictions/history",
      {
        params: queryParams,
      },
    );
    return response.data.history;
  },

  /**
   * 특정 종목 예측 이력 조회
   */
  getPredictionsBySymbol: async (
    symbol: string,
    params?: PredictionHistoryParams,
  ): Promise<Prediction[]> => {
    const normalizedSymbol = normalizeSymbol(symbol);
    const validatedParams = validatePaginationParams(
      params || {},
      PAGINATION_LIMITS.PREDICTIONS_HISTORY,
    );

    const queryParams = {
      ...validatedParams,
      symbol: normalizedSymbol,
    };

    const response = await oxApi.get<PredictionHistoryResponse>(
      "/predictions/history",
      {
        params: queryParams,
      },
    );
    return response.data.history;
  },

  /**
   * 포인트 획득 예측 조회
   */
  getProfitablePredictions: async (
    params?: PredictionHistoryParams,
  ): Promise<Prediction[]> => {
    const validatedParams = validatePaginationParams(
      params || {},
      PAGINATION_LIMITS.PREDICTIONS_HISTORY,
    );

    const queryParams = {
      ...validatedParams,
      has_points: true,
    };

    const response = await oxApi.get<PredictionHistoryResponse>(
      "/predictions/history",
      {
        params: queryParams,
      },
    );
    return response.data.history;
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * 예측 데이터 검증
 */
export const validatePredictionData = (data: PredictionCreate): boolean => {
  return (
    isValidSymbol(data.symbol) &&
    Object.values(PredictionChoice).includes(data.choice)
  );
};

/**
 * 예측 ID 목록에서 유효한 ID만 필터링
 */
export const filterValidPredictionIds = (
  ids: (number | string)[],
): number[] => {
  return ids
    .map((id) => (typeof id === "string" ? parseInt(id, 10) : id))
    .filter((id) => !isNaN(id) && id > 0);
};

/**
 * 예측 데이터 정규화
 */
export const normalizePredictionData = (
  data: PredictionCreate,
): PredictionCreate => {
  return {
    symbol: normalizeSymbol(data.symbol),
    choice: data.choice,
  };
};

/**
 * 예측 결과 요약 생성
 */
export const createPredictionSummary = (
  predictions: Prediction[],
): {
  total: number;
  correct: number;
  incorrect: number;
  void: number;
  accuracy: number;
  totalPoints: number;
} => {
  const total = predictions.length;
  const correct = predictions.filter((p) => p.status === "CORRECT").length;
  const incorrect = predictions.filter((p) => p.status === "INCORRECT").length;
  const void_count = predictions.filter((p) => p.status === "VOID").length;
  const accuracy = total > 0 ? (correct / total) * 100 : 0;
  const totalPoints = predictions.reduce(
    (sum, p) => sum + (p.points_earned || 0),
    0,
  );

  return {
    total,
    correct,
    incorrect,
    void: void_count,
    accuracy,
    totalPoints,
  };
};
