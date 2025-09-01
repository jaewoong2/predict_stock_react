import { oxApi } from "./api";
import {
  Session,
  MarketStatus,
  SessionTodayResponse,
  PredictionAvailability,
  SessionSchedule,
  WeeklySchedule,
  MarketCalendar,
  MarketHoliday,
  SessionStats,
  SessionComparison,
} from "../types/session";

export const sessionService = {
  // ============================================================================
  // Core Session Operations
  // ============================================================================

  /**
   * 오늘 세션 조회
   */
  getTodaySession: async (): Promise<SessionTodayResponse> => {
    return await oxApi.getWithBaseResponse<SessionTodayResponse>(
      "/session/today",
    );
  },

  /**
   * 예측 가능 여부 확인
   */
  canPredictNow: async (
    tradingDay?: string,
  ): Promise<PredictionAvailability> => {
    const url = tradingDay
      ? `/session/can-predict?trading_day=${tradingDay}`
      : "/session/can-predict";

    return await oxApi.getWithBaseResponse<PredictionAvailability>(url);
  },

  // ============================================================================
  // Session Schedule Operations
  // ============================================================================

  /**
   * 주간 세션 스케줄 조회
   */
  getWeeklySchedule: async (
    startDate: string,
    endDate: string,
  ): Promise<WeeklySchedule> => {
    const queryString = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });

    return await oxApi.getWithBaseResponse<WeeklySchedule>(
      `/session/schedule/weekly?${queryString}`,
    );
  },

  /**
   * 특정 날짜 세션 스케줄 조회
   */
  getSessionSchedule: async (date: string): Promise<SessionSchedule> => {
    return await oxApi.getWithBaseResponse<SessionSchedule>(
      `/session/schedule/${date}`,
    );
  },

  /**
   * 월간 세션 스케줄 조회
   */
  getMonthlySchedule: async (
    year: number,
    month: number,
  ): Promise<WeeklySchedule> => {
    const queryString = new URLSearchParams({
      year: year.toString(),
      month: month.toString(),
    });

    return await oxApi.getWithBaseResponse<WeeklySchedule>(
      `/session/schedule/monthly?${queryString}`,
    );
  },

  // ============================================================================
  // Market Calendar Operations
  // ============================================================================

  /**
   * 시장 캘린더 조회
   */
  getMarketCalendar: async (
    startDate: string,
    endDate: string,
  ): Promise<MarketCalendar> => {
    const queryString = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });

    return await oxApi.getWithBaseResponse<MarketCalendar>(
      `/session/calendar?${queryString}`,
    );
  },

  /**
   * 휴일 정보 조회
   */
  getMarketHolidays: async (
    startDate: string,
    endDate: string,
  ): Promise<MarketHoliday[]> => {
    const queryString = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });

    return await oxApi.getWithBaseResponse<MarketHoliday[]>(
      `/session/holidays?${queryString}`,
    );
  },

  // ============================================================================
  // Session Analytics
  // ============================================================================

  /**
   * 세션 통계 조회
   */
  getSessionStats: async (date: string): Promise<SessionStats> => {
    return await oxApi.getWithBaseResponse<SessionStats>(
      `/session/stats/${date}`,
    );
  },

  /**
   * 세션 비교 조회
   */
  getSessionComparison: async (
    date1: string,
    date2: string,
  ): Promise<SessionComparison> => {
    const queryString = new URLSearchParams({
      date1,
      date2,
    });

    return await oxApi.getWithBaseResponse<SessionComparison>(
      `/session/compare?${queryString}`,
    );
  },

  // ============================================================================
  // Trading Day Operations
  // ============================================================================

  /**
   * 다음 거래일 조회
   */
  getNextTradingDay: async (fromDate?: string): Promise<string> => {
    const params: Record<string, string> = {};
    if (fromDate) {
      params.from_date = fromDate;
    }
    const queryString = new URLSearchParams(params);
    const url = queryString.toString()
      ? `/session/next-trading-day?${queryString}`
      : "/session/next-trading-day";

    const response = await oxApi.getWithBaseResponse<{
      next_trading_day: string;
    }>(url);
    return response.next_trading_day;
  },

  /**
   * 이전 거래일 조회
   */
  getPreviousTradingDay: async (fromDate?: string): Promise<string> => {
    const params: Record<string, string> = {};
    if (fromDate) {
      params.from_date = fromDate;
    }
    const queryString = new URLSearchParams(params);
    const url = queryString.toString()
      ? `/session/previous-trading-day?${queryString}`
      : "/session/previous-trading-day";

    const response = await oxApi.getWithBaseResponse<{
      previous_trading_day: string;
    }>(url);
    return response.previous_trading_day;
  },

  /**
   * 거래일 목록 조회
   */
  getTradingDays: async (
    startDate: string,
    endDate: string,
  ): Promise<string[]> => {
    const queryString = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });

    const response = await oxApi.getWithBaseResponse<{ trading_days: string[] }>(
      `/session/trading-days?${queryString}`,
    );
    return response.trading_days;
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * 현재 시간이 거래 시간인지 확인
 */
export const isCurrentlyInTradingHours = (): boolean => {
  const now = new Date();
  const kstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  const hours = kstTime.getHours();
  const minutes = kstTime.getMinutes();

  const currentMinutes = hours * 60 + minutes;
  const marketOpenMinutes = 9 * 60; // 09:00
  const marketCloseMinutes = 15 * 60 + 30; // 15:30

  return (
    currentMinutes >= marketOpenMinutes && currentMinutes <= marketCloseMinutes
  );
};

/**
 * 오늘이 주말인지 확인
 */
export const isTodayWeekend = (): boolean => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0: 일요일, 6: 토요일
};

/**
 * 다음 거래일까지의 시간 계산
 */
export const getTimeUntilNextTradingDay = async (): Promise<{
  days: number;
  hours: number;
  minutes: number;
} | null> => {
  try {
    const nextTradingDay = await sessionService.getNextTradingDay();
    const now = new Date();
    const nextDay = new Date(nextTradingDay);
    const diffMs = nextDay.getTime() - now.getTime();

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  } catch (error) {
    console.error("Failed to get time until next trading day:", error);
    return null;
  }
};

/**
 * 세션 상태 요약 생성
 */
export const createSessionSummary = (
  session: Session | null,
  marketStatus: MarketStatus,
): {
  isActive: boolean;
  canPredict: boolean;
  status: string;
  message: string;
  nextAction?: string;
} => {
  if (!session) {
    if (marketStatus.is_trading_day) {
      return {
        isActive: false,
        canPredict: false,
        status: "WAITING",
        message: "세션이 아직 시작되지 않았습니다.",
        nextAction: "세션 시작 대기 중",
      };
    } else {
      return {
        isActive: false,
        canPredict: false,
        status: "HOLIDAY",
        message: marketStatus.message,
        nextAction: marketStatus.next_trading_day
          ? `다음 거래일: ${marketStatus.next_trading_day}`
          : undefined,
      };
    }
  }

  if (session.status === "OPEN") {
    return {
      isActive: true,
      canPredict: true,
      status: "ACTIVE",
      message: "현재 예측이 가능합니다.",
      nextAction: "예측하기",
    };
  } else {
    return {
      isActive: false,
      canPredict: false,
      status: "CLOSED",
      message: "예측이 마감되었습니다.",
      nextAction: "결과 확인",
    };
  }
};
