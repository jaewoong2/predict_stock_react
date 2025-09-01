import { z } from "zod";
import { DateStringSchema, DateTimeStringSchema } from "./common";

// ============================================================================
// Enums
// ============================================================================

export enum SessionStatus {
  OPEN = "OPEN", // 예측 가능
  CLOSED = "CLOSED", // 예측 마감
}

// ============================================================================
// Core Session Types
// ============================================================================

export const SessionSchema = z.object({
  id: z.number(),
  trading_day: DateStringSchema,
  status: z.nativeEnum(SessionStatus),
  created_at: DateTimeStringSchema,
  closed_at: DateTimeStringSchema.optional(),
});

export const MarketStatusSchema = z.object({
  current_date: DateStringSchema,
  current_time_kst: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "시간 형식이 올바르지 않습니다"),
  is_trading_day: z.boolean(),
  message: z.string(),
  next_trading_day: DateStringSchema.optional(),
});

export const SessionTodayResponseSchema = z.object({
  session: SessionSchema.nullable(),
  market_status: MarketStatusSchema,
});

export type Session = z.infer<typeof SessionSchema>;
export type MarketStatus = z.infer<typeof MarketStatusSchema>;
export type SessionTodayResponse = z.infer<typeof SessionTodayResponseSchema>;

// ============================================================================
// Prediction Availability Types
// ============================================================================

export const PredictionAvailabilitySchema = z.object({
  can_predict: z.boolean(),
  trading_day: DateStringSchema,
  current_time: DateTimeStringSchema,
});

export type PredictionAvailability = z.infer<
  typeof PredictionAvailabilitySchema
>;

// ============================================================================
// Session Schedule Types
// ============================================================================

export const SessionScheduleSchema = z.object({
  trading_day: DateStringSchema,
  open_time: z.string().regex(/^\d{2}:\d{2}$/, "시간 형식이 올바르지 않습니다"),
  close_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "시간 형식이 올바르지 않습니다"),
  is_holiday: z.boolean(),
  holiday_reason: z.string().optional(),
});

export const WeeklyScheduleSchema = z.object({
  week_start: DateStringSchema,
  week_end: DateStringSchema,
  sessions: z.array(SessionScheduleSchema),
});

export type SessionSchedule = z.infer<typeof SessionScheduleSchema>;
export type WeeklySchedule = z.infer<typeof WeeklyScheduleSchema>;

// ============================================================================
// Market Calendar Types
// ============================================================================

export const MarketHolidaySchema = z.object({
  date: DateStringSchema,
  reason: z.string(),
  is_early_close: z.boolean().optional(),
  early_close_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
});

export const MarketCalendarSchema = z.object({
  year: z.number(),
  month: z.number(),
  holidays: z.array(MarketHolidaySchema),
  trading_days: z.number(),
  non_trading_days: z.number(),
});

export type MarketHoliday = z.infer<typeof MarketHolidaySchema>;
export type MarketCalendar = z.infer<typeof MarketCalendarSchema>;

// ============================================================================
// Session Statistics Types
// ============================================================================

export const SessionStatsSchema = z.object({
  trading_day: DateStringSchema,
  total_predictions: z.number(),
  total_users: z.number(),
  total_points_awarded: z.number(),
  total_points_lost: z.number(),
  net_points: z.number(),
  session_duration_hours: z.number(),
  average_predictions_per_user: z.number(),
});

export const SessionComparisonSchema = z.object({
  current_session: SessionStatsSchema,
  previous_session: SessionStatsSchema.optional(),
  change_percentage: z.number(),
  trend: z.enum(["up", "down", "stable"]),
});

export type SessionStats = z.infer<typeof SessionStatsSchema>;
export type SessionComparison = z.infer<typeof SessionComparisonSchema>;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * 세션 상태에 따른 표시 텍스트 반환
 */
export const getSessionStatusText = (status: SessionStatus): string => {
  switch (status) {
    case SessionStatus.OPEN:
      return "예측 가능 🟢";
    case SessionStatus.CLOSED:
      return "예측 마감 🔴";
    default:
      return status;
  }
};

/**
 * 세션 상태에 따른 색상 클래스 반환
 */
export const getSessionStatusColor = (status: SessionStatus): string => {
  switch (status) {
    case SessionStatus.OPEN:
      return "text-green-600";
    case SessionStatus.CLOSED:
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

/**
 * 세션이 열려있는지 확인
 */
export const isSessionOpen = (status: SessionStatus): boolean => {
  return status === SessionStatus.OPEN;
};

/**
 * 세션이 닫혀있는지 확인
 */
export const isSessionClosed = (status: SessionStatus): boolean => {
  return status === SessionStatus.CLOSED;
};

/**
 * 오늘이 거래일인지 확인
 */
export const isTodayTradingDay = (marketStatus: MarketStatus): boolean => {
  return marketStatus.is_trading_day;
};

/**
 * 다음 거래일이 있는지 확인
 */
export const hasNextTradingDay = (marketStatus: MarketStatus): boolean => {
  return !!marketStatus.next_trading_day;
};

/**
 * 현재 시간이 거래 시간인지 확인 (한국 시간 기준)
 */
export const isCurrentTimeInTradingHours = (
  currentTimeKst: string,
): boolean => {
  const [hours, minutes] = currentTimeKst.split(":").map(Number);
  const currentMinutes = hours * 60 + minutes;

  // 거래 시간: 09:00 ~ 15:30 (한국 시간)
  const marketOpenMinutes = 9 * 60; // 09:00
  const marketCloseMinutes = 15 * 60 + 30; // 15:30

  return (
    currentMinutes >= marketOpenMinutes && currentMinutes <= marketCloseMinutes
  );
};

/**
 * 거래일까지 남은 시간 계산
 */
export const getTimeUntilTradingDay = (
  nextTradingDay: string,
): {
  days: number;
  hours: number;
  minutes: number;
} => {
  const now = new Date();
  const nextDay = new Date(nextTradingDay);
  const diffMs = nextDay.getTime() - now.getTime();

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
};

/**
 * 세션 지속 시간 계산
 */
export const getSessionDuration = (session: Session): number => {
  if (!session.closed_at) return 0;

  const created = new Date(session.created_at);
  const closed = new Date(session.closed_at);
  const diffMs = closed.getTime() - created.getTime();

  return Math.floor(diffMs / (1000 * 60 * 60)); // 시간 단위
};

/**
 * 세션 상태 메시지 생성
 */
export const createSessionStatusMessage = (
  session: Session | null,
  marketStatus: MarketStatus,
): string => {
  if (!session) {
    if (marketStatus.is_trading_day) {
      return "오늘은 거래일이지만 세션이 아직 시작되지 않았습니다.";
    } else {
      return `오늘은 휴장일입니다. ${marketStatus.message}`;
    }
  }

  if (isSessionOpen(session.status)) {
    return "현재 예측이 가능합니다.";
  } else {
    return "예측이 마감되었습니다.";
  }
};

/**
 * 세션 진행률 계산
 */
export const calculateSessionProgress = (session: Session): number => {
  if (isSessionOpen(session.status)) {
    const created = new Date(session.created_at);
    const now = new Date();
    const totalDuration = 6.5 * 60 * 60 * 1000; // 6.5시간 (거래 시간)
    const elapsed = now.getTime() - created.getTime();

    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  }

  return 100; // 세션이 닫혀있으면 100%
};

/**
 * 세션 남은 시간 계산
 */
export const getSessionTimeRemaining = (
  session: Session,
): {
  hours: number;
  minutes: number;
} => {
  if (isSessionClosed(session.status)) {
    return { hours: 0, minutes: 0 };
  }

  const created = new Date(session.created_at);
  const now = new Date();
  const totalDuration = 6.5 * 60 * 60 * 1000; // 6.5시간
  const elapsed = now.getTime() - created.getTime();
  const remaining = totalDuration - elapsed;

  if (remaining <= 0) {
    return { hours: 0, minutes: 0 };
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
};
