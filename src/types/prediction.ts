import { z } from "zod";
import {
  DateStringSchema,
  DateTimeStringSchema,
  PositiveNumberSchema,
} from "./common";

// ============================================================================
// Enums
// ============================================================================

export enum PredictionChoice {
  UP = "UP", // 상승 예측
  DOWN = "DOWN", // 하락 예측
}

export enum PredictionStatus {
  PENDING = "PENDING", // 대기 중
  LOCKED = "LOCKED", // 정산용 잠금
  CORRECT = "CORRECT", // 정답
  INCORRECT = "INCORRECT", // 오답
  VOID = "VOID", // 무효 (환불)
}

// ============================================================================
// Core Prediction Types
// ============================================================================

export const PredictionSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  trading_day: DateStringSchema,
  symbol: z.string(),
  choice: z.nativeEnum(PredictionChoice),
  status: z.nativeEnum(PredictionStatus),
  submitted_at: DateTimeStringSchema,
  updated_at: DateTimeStringSchema.nullable(),
  points_earned: z.number(),
});

export const PredictionCreateSchema = z.object({
  symbol: z.string().regex(/^[A-Z]{1,5}$/, "심볼은 대문자 1-5자여야 합니다"),
  choice: z.nativeEnum(PredictionChoice),
});

export const PredictionUpdateSchema = z.object({
  choice: z.nativeEnum(PredictionChoice),
});

export const PredictionsForDayResponseSchema = z.object({
  predictions: z.array(PredictionSchema),
  total_predictions: z.number(),
  completed_predictions: z.number(),
  pending_predictions: z.number(),
  trading_day: DateStringSchema,
});

export type Prediction = z.infer<typeof PredictionSchema>;
export type PredictionCreate = z.infer<typeof PredictionCreateSchema>;
export type PredictionUpdate = z.infer<typeof PredictionUpdateSchema>;
export type PredictionsForDayResponse = z.infer<
  typeof PredictionsForDayResponseSchema
>;
// ============================================================================
// Prediction History Types
// ============================================================================

export const PredictionHistoryParamsSchema = z.object({
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

export type PredictionHistoryParams = z.infer<
  typeof PredictionHistoryParamsSchema
>;

// ============================================================================
// Prediction Response Types
// ============================================================================

export const PredictionSubmitResponseSchema = z.object({
  prediction: PredictionSchema,
});

export const PredictionHistoryResponseSchema = z.object({
  history: z.array(PredictionSchema),
});

export const RemainingPredictionsResponseSchema = z.object({
  remaining_predictions: z.number().min(0),
});

export const DayPredictionsResponseSchema = z.object({
  result: z.array(PredictionSchema),
});

export type PredictionSubmitResponse = z.infer<
  typeof PredictionSubmitResponseSchema
>;
export type PredictionHistoryResponse = z.infer<
  typeof PredictionHistoryResponseSchema
>;
export type RemainingPredictionsResponse = z.infer<
  typeof RemainingPredictionsResponseSchema
>;
export type DayPredictionsResponse = z.infer<
  typeof DayPredictionsResponseSchema
>;

// ============================================================================
// Prediction Statistics Types
// ============================================================================

export const PredictionStatsSchema = z.object({
  total_predictions: z.number(),
  correct_predictions: z.number(),
  incorrect_predictions: z.number(),
  void_predictions: z.number(),
  accuracy_rate: z.number().min(0).max(100),
  total_points_earned: z.number(),
  total_points_lost: z.number(),
  net_points: z.number(),
});

export const DailyPredictionStatsSchema = z.object({
  trading_day: DateStringSchema,
  predictions_made: z.number(),
  predictions_correct: z.number(),
  predictions_incorrect: z.number(),
  points_earned: z.number(),
  points_lost: z.number(),
  net_points: z.number(),
});

export type PredictionStats = z.infer<typeof PredictionStatsSchema>;
export type DailyPredictionStats = z.infer<typeof DailyPredictionStatsSchema>;

// ============================================================================
// Prediction Validation Types
// ============================================================================

export const PredictionValidationSchema = z.object({
  can_predict: z.boolean(),
  reason: z.string().optional(),
  remaining_slots: z.number().min(0),
  trading_day: DateStringSchema,
  current_time: DateTimeStringSchema,
});

export type PredictionValidation = z.infer<typeof PredictionValidationSchema>;

// ============================================================================
// Prediction Analytics Types
// ============================================================================

export const PredictionAnalyticsSchema = z.object({
  symbol: z.string(),
  total_predictions: z.number(),
  up_predictions: z.number(),
  down_predictions: z.number(),
  correct_predictions: z.number(),
  accuracy_rate: z.number(),
  average_points: z.number(),
  last_prediction_date: DateStringSchema.optional(),
});

export const PredictionTrendSchema = z.object({
  date: DateStringSchema,
  total_predictions: z.number(),
  correct_predictions: z.number(),
  accuracy_rate: z.number(),
  points_earned: z.number(),
});

export type PredictionAnalytics = z.infer<typeof PredictionAnalyticsSchema>;
export type PredictionTrend = z.infer<typeof PredictionTrendSchema>;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * 예측 상태에 따른 표시 텍스트 반환
 */
export const getPredictionStatusText = (status: PredictionStatus): string => {
  switch (status) {
    case PredictionStatus.PENDING:
      return "대기 중";
    case PredictionStatus.LOCKED:
      return "정산 대기";
    case PredictionStatus.CORRECT:
      return "정답 ✅";
    case PredictionStatus.INCORRECT:
      return "오답 ❌";
    case PredictionStatus.VOID:
      return "무효 처리";
    default:
      return status;
  }
};

/**
 * 예측 선택에 따른 표시 텍스트 반환
 */
export const getPredictionChoiceText = (choice: PredictionChoice): string => {
  switch (choice) {
    case PredictionChoice.UP:
      return "상승 ⬆️";
    case PredictionChoice.DOWN:
      return "하락 ⬇️";
    default:
      return choice;
  }
};

/**
 * 예측 상태에 따른 색상 클래스 반환
 */
export const getPredictionStatusColor = (status: PredictionStatus): string => {
  switch (status) {
    case PredictionStatus.PENDING:
      return "text-yellow-600";
    case PredictionStatus.LOCKED:
      return "text-blue-600";
    case PredictionStatus.CORRECT:
      return "text-green-600";
    case PredictionStatus.INCORRECT:
      return "text-red-600";
    case PredictionStatus.VOID:
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
};

/**
 * 예측 선택에 따른 색상 클래스 반환
 */
export const getPredictionChoiceColor = (choice: PredictionChoice): string => {
  switch (choice) {
    case PredictionChoice.UP:
      return "text-green-600";
    case PredictionChoice.DOWN:
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

/**
 * 예측이 완료되었는지 확인
 */
export const isPredictionCompleted = (status: PredictionStatus): boolean => {
  return [
    PredictionStatus.CORRECT,
    PredictionStatus.INCORRECT,
    PredictionStatus.VOID,
  ].includes(status);
};

/**
 * 예측이 수정 가능한지 확인
 */
export const isPredictionEditable = (status: PredictionStatus): boolean => {
  return status === PredictionStatus.PENDING;
};

/**
 * 예측이 정답인지 확인
 */
export const isPredictionCorrect = (status: PredictionStatus): boolean => {
  return status === PredictionStatus.CORRECT;
};

/**
 * 예측이 오답인지 확인
 */
export const isPredictionIncorrect = (status: PredictionStatus): boolean => {
  return status === PredictionStatus.INCORRECT;
};

/**
 * 예측이 무효인지 확인
 */
export const isPredictionVoid = (status: PredictionStatus): boolean => {
  return status === PredictionStatus.VOID;
};

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
