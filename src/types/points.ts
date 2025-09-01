import { z } from "zod";
import {
  DateStringSchema,
  DateTimeStringSchema,
  PositiveNumberSchema,
  NonNegativeNumberSchema,
} from "./common";

// ============================================================================
// Core Points Types
// ============================================================================

export const PointsBalanceSchema = z.object({
  balance: NonNegativeNumberSchema,
  user_id: z.number(),
});

export const PointsLedgerEntrySchema = z.object({
  id: z.number(),
  transaction_type: z.string(),
  delta_points: z.number(), // 양수: 획득, 음수: 사용
  balance_after: NonNegativeNumberSchema,
  reason: z.string(),
  ref_id: z.string().optional(),
  created_at: DateTimeStringSchema,
});

export const PointsLedgerSchema = z.object({
  balance: NonNegativeNumberSchema,
  entries: z.array(PointsLedgerEntrySchema),
  total_count: z.number(),
  has_next: z.boolean(),
});

// BaseResponse를 사용하는 엔드포인트 (/users/me/points/*)
export type PointsBalance = z.infer<typeof PointsBalanceSchema>;
export type PointsLedgerEntry = z.infer<typeof PointsLedgerEntrySchema>;
export type PointsLedger = z.infer<typeof PointsLedgerSchema>;

// 직접 응답하는 엔드포인트 (/points/*)
export const PointsBalanceResponseSchema = z.object({
  balance: NonNegativeNumberSchema,
});

export const PointsLedgerResponseSchema = z.object({
  balance: NonNegativeNumberSchema,
  entries: z.array(PointsLedgerEntrySchema),
  total_count: z.number(),
  has_next: z.boolean(),
});

export type PointsBalanceResponse = z.infer<typeof PointsBalanceResponseSchema>;
export type PointsLedgerResponse = z.infer<typeof PointsLedgerResponseSchema>;

// ============================================================================
// Extended Points Types
// ============================================================================

export const UserProfileWithPointsSchema = z.object({
  user_profile: z.object({
    user_id: z.number(),
    email: z.string().email(),
    nickname: z.string(),
    auth_provider: z.string(),
    created_at: DateTimeStringSchema,
    is_oauth_user: z.boolean(),
  }),
  points_balance: NonNegativeNumberSchema,
  last_updated: DateTimeStringSchema,
});

export const UserFinancialSummarySchema = z.object({
  user_id: z.number(),
  current_balance: NonNegativeNumberSchema,
  points_earned_today: NonNegativeNumberSchema,
  can_make_predictions: z.boolean(),
  summary_date: DateStringSchema,
});

export const AffordabilityCheckSchema = z.object({
  amount: NonNegativeNumberSchema,
  can_afford: z.boolean(),
  current_balance: NonNegativeNumberSchema,
  shortfall: NonNegativeNumberSchema, // 부족한 포인트 (can_afford가 false일 때)
});

export type UserProfileWithPoints = z.infer<typeof UserProfileWithPointsSchema>;
export type UserFinancialSummary = z.infer<typeof UserFinancialSummarySchema>;
export type AffordabilityCheck = z.infer<typeof AffordabilityCheckSchema>;

// ============================================================================
// Transaction Types
// ============================================================================

export enum TransactionType {
  PREDICTION_CORRECT = "PREDICTION_CORRECT",
  PREDICTION_VOID = "PREDICTION_VOID",
  REWARD_REDEMPTION = "REWARD_REDEMPTION",
  ADMIN_ADJUSTMENT = "ADMIN_ADJUSTMENT",
  SIGNUP_BONUS = "SIGNUP_BONUS",
  DAILY_BONUS = "DAILY_BONUS",
  REFERRAL_BONUS = "REFERRAL_BONUS",
  EVENT_REWARD = "EVENT_REWARD",
  PENALTY = "PENALTY",
  SYSTEM_ADJUSTMENT = "SYSTEM_ADJUSTMENT",
}

export const TransactionTypeSchema = z.nativeEnum(TransactionType);

export const PointsTransactionSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  transaction_type: TransactionTypeSchema,
  delta_points: z.number(),
  balance_before: NonNegativeNumberSchema,
  balance_after: NonNegativeNumberSchema,
  reason: z.string(),
  ref_id: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  created_at: DateTimeStringSchema,
});

export type PointsTransaction = z.infer<typeof PointsTransactionSchema>;

// ============================================================================
// Points Statistics Types
// ============================================================================

export const PointsStatsSchema = z.object({
  total_earned: NonNegativeNumberSchema,
  total_spent: NonNegativeNumberSchema,
  net_points: z.number(),
  total_transactions: z.number(),
  average_per_transaction: z.number(),
  highest_balance: NonNegativeNumberSchema,
  current_streak: z.number(),
  longest_streak: z.number(),
});

export const DailyPointsStatsSchema = z.object({
  date: DateStringSchema,
  points_earned: NonNegativeNumberSchema,
  points_spent: NonNegativeNumberSchema,
  net_points: z.number(),
  transaction_count: z.number(),
  balance_at_end: NonNegativeNumberSchema,
});

export const MonthlyPointsStatsSchema = z.object({
  year: z.number(),
  month: z.number(),
  total_earned: NonNegativeNumberSchema,
  total_spent: NonNegativeNumberSchema,
  net_points: z.number(),
  transaction_count: z.number(),
  average_daily_earned: z.number(),
  average_daily_spent: z.number(),
  days_active: z.number(),
});

export type PointsStats = z.infer<typeof PointsStatsSchema>;
export type DailyPointsStats = z.infer<typeof DailyPointsStatsSchema>;
export type MonthlyPointsStats = z.infer<typeof MonthlyPointsStatsSchema>;

// ============================================================================
// Points Analytics Types
// ============================================================================

export const PointsAnalyticsSchema = z.object({
  user_id: z.number(),
  period_start: DateStringSchema,
  period_end: DateStringSchema,
  total_earned: NonNegativeNumberSchema,
  total_spent: NonNegativeNumberSchema,
  net_points: z.number(),
  earning_sources: z.array(
    z.object({
      transaction_type: TransactionTypeSchema,
      total_points: NonNegativeNumberSchema,
      transaction_count: z.number(),
      percentage: z.number(),
    }),
  ),
  spending_categories: z.array(
    z.object({
      transaction_type: TransactionTypeSchema,
      total_points: NonNegativeNumberSchema,
      transaction_count: z.number(),
      percentage: z.number(),
    }),
  ),
  daily_trends: z.array(DailyPointsStatsSchema),
  prediction_performance: z.object({
    total_predictions: z.number(),
    correct_predictions: z.number(),
    points_earned_from_predictions: NonNegativeNumberSchema,
    accuracy_rate: z.number(),
  }),
});

export type PointsAnalytics = z.infer<typeof PointsAnalyticsSchema>;

// ============================================================================
// Points Management Types
// ============================================================================

export const PointsAdjustmentSchema = z.object({
  user_id: z.number(),
  delta_points: z.number(),
  reason: z.string(),
  transaction_type: TransactionTypeSchema,
  ref_id: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const BatchPointsAdjustmentSchema = z.object({
  adjustments: z.array(PointsAdjustmentSchema),
  reason: z.string(),
  transaction_type: TransactionTypeSchema,
});

export type PointsAdjustment = z.infer<typeof PointsAdjustmentSchema>;
export type BatchPointsAdjustment = z.infer<typeof BatchPointsAdjustmentSchema>;

// ============================================================================
// Points Validation Types
// ============================================================================

export const PointsValidationSchema = z.object({
  can_afford: z.boolean(),
  current_balance: NonNegativeNumberSchema,
  required_amount: NonNegativeNumberSchema,
  shortfall: NonNegativeNumberSchema,
  reason: z.string().optional(),
});

export type PointsValidation = z.infer<typeof PointsValidationSchema>;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * 거래 유형에 따른 표시 텍스트 반환
 */
export const getTransactionTypeText = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.PREDICTION_CORRECT:
      return "예측 성공";
    case TransactionType.PREDICTION_VOID:
      return "예측 환불";
    case TransactionType.REWARD_REDEMPTION:
      return "리워드 교환";
    case TransactionType.ADMIN_ADJUSTMENT:
      return "관리자 조정";
    case TransactionType.SIGNUP_BONUS:
      return "가입 보너스";
    case TransactionType.DAILY_BONUS:
      return "일일 보너스";
    case TransactionType.REFERRAL_BONUS:
      return "추천 보너스";
    case TransactionType.EVENT_REWARD:
      return "이벤트 보상";
    case TransactionType.PENALTY:
      return "페널티";
    case TransactionType.SYSTEM_ADJUSTMENT:
      return "시스템 조정";
    default:
      return type;
  }
};

/**
 * 거래 유형에 따른 색상 클래스 반환
 */
export const getTransactionTypeColor = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.PREDICTION_CORRECT:
    case TransactionType.SIGNUP_BONUS:
    case TransactionType.DAILY_BONUS:
    case TransactionType.REFERRAL_BONUS:
    case TransactionType.EVENT_REWARD:
      return "text-green-600";
    case TransactionType.REWARD_REDEMPTION:
    case TransactionType.PENALTY:
      return "text-red-600";
    case TransactionType.PREDICTION_VOID:
    case TransactionType.ADMIN_ADJUSTMENT:
    case TransactionType.SYSTEM_ADJUSTMENT:
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

/**
 * 거래 유형에 따른 아이콘 반환
 */
export const getTransactionTypeIcon = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.PREDICTION_CORRECT:
      return "✅";
    case TransactionType.PREDICTION_VOID:
      return "🔄";
    case TransactionType.REWARD_REDEMPTION:
      return "🎁";
    case TransactionType.ADMIN_ADJUSTMENT:
      return "⚙️";
    case TransactionType.SIGNUP_BONUS:
      return "🎉";
    case TransactionType.DAILY_BONUS:
      return "📅";
    case TransactionType.REFERRAL_BONUS:
      return "👥";
    case TransactionType.EVENT_REWARD:
      return "🎪";
    case TransactionType.PENALTY:
      return "⚠️";
    case TransactionType.SYSTEM_ADJUSTMENT:
      return "🔧";
    default:
      return "💰";
  }
};

/**
 * 포인트 포맷팅
 */
export const formatPoints = (points: number): string => {
  return new Intl.NumberFormat("ko-KR").format(points);
};

/**
 * 포인트 변화량 포맷팅
 */
export const formatPointsChange = (deltaPoints: number): string => {
  const sign = deltaPoints >= 0 ? "+" : "";
  return `${sign}${formatPoints(deltaPoints)}P`;
};

/**
 * 포인트 변화량에 따른 색상 클래스 반환
 */
export const getPointsChangeColor = (deltaPoints: number): string => {
  if (deltaPoints > 0) return "text-green-600";
  if (deltaPoints < 0) return "text-red-600";
  return "text-gray-600";
};

/**
 * 포인트 변화량에 따른 배경 색상 클래스 반환
 */
export const getPointsChangeBgColor = (deltaPoints: number): string => {
  if (deltaPoints > 0) return "bg-green-100";
  if (deltaPoints < 0) return "bg-red-100";
  return "bg-gray-100";
};

/**
 * 포인트 잔액이 충분한지 확인
 */
export const hasEnoughPoints = (balance: number, required: number): boolean => {
  return balance >= required;
};

/**
 * 포인트 부족량 계산
 */
export const calculatePointsShortfall = (
  balance: number,
  required: number,
): number => {
  return Math.max(0, required - balance);
};

/**
 * 포인트 사용 가능 여부 확인
 */
export const canSpendPoints = (balance: number, amount: number): boolean => {
  return balance >= amount && amount > 0;
};

/**
 * 포인트 거래가 유효한지 확인
 */
export const isValidPointsTransaction = (
  deltaPoints: number,
  balanceAfter: number,
): boolean => {
  return balanceAfter >= 0 && Math.abs(deltaPoints) <= 1000000; // 최대 100만 포인트
};

/**
 * 포인트 통계 요약 생성
 */
export const createPointsSummary = (
  transactions: PointsTransaction[],
): {
  total_earned: number;
  total_spent: number;
  net_points: number;
  transaction_count: number;
  average_per_transaction: number;
} => {
  const total_earned = transactions
    .filter((t) => t.delta_points > 0)
    .reduce((sum, t) => sum + t.delta_points, 0);

  const total_spent = transactions
    .filter((t) => t.delta_points < 0)
    .reduce((sum, t) => sum + Math.abs(t.delta_points), 0);

  const net_points = total_earned - total_spent;
  const transaction_count = transactions.length;
  const average_per_transaction =
    transaction_count > 0 ? net_points / transaction_count : 0;

  return {
    total_earned,
    total_spent,
    net_points,
    transaction_count,
    average_per_transaction,
  };
};
