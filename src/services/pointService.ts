import { oxApi } from "./api";
import {
  PointsBalance,
  PointsLedgerEntry,
  PointsLedger,
  UserProfileWithPoints,
  UserFinancialSummary,
  AffordabilityCheck,
} from "../types/points";
import {
  PAGINATION_LIMITS,
  PaginationParams,
  validatePaginationParams,
} from "../types/common";

export const pointService = {
  // ============================================================================
  // Points Balance Operations
  // ============================================================================

  /**
   * 내 포인트 잔액 조회 (BaseResponse 래핑)
   */
  getMyPointsBalance: async (): Promise<PointsBalance> => {
    return await oxApi.getWithBaseResponse<PointsBalance>(
      "/users/me/points/balance",
    );
  },

  /**
   * 포인트 잔액 조회 (직접 응답)
   */
  getPointsBalance: async (): Promise<{ balance: number }> => {
    return await oxApi.getDirect<{ balance: number }>("/points/balance");
  },

  // ============================================================================
  // Points Ledger Operations
  // ============================================================================

  /**
   * 포인트 거래 내역 조회 (BaseResponse 래핑)
   */
  getMyPointsLedger: async (
    pagination?: PaginationParams,
  ): Promise<PointsLedger> => {
    const validatedParams = validatePaginationParams(
      pagination || {},
      PAGINATION_LIMITS.POINTS_LEDGER,
    );

    const queryString = new URLSearchParams({
      limit: (
        validatedParams.limit || PAGINATION_LIMITS.POINTS_LEDGER.default
      ).toString(),
      offset: (validatedParams.offset || 0).toString(),
    });

    return await oxApi.getWithBaseResponse<PointsLedger>(
      `/users/me/points/ledger?${queryString}`,
    );
  },

  /**
   * 포인트 거래 내역 조회 (직접 응답)
   */
  getPointsLedger: async (
    pagination?: PaginationParams,
  ): Promise<{
    balance: number;
    entries: PointsLedgerEntry[];
    total_count: number;
    has_next: boolean;
  }> => {
    const validatedParams = validatePaginationParams(
      pagination || {},
      PAGINATION_LIMITS.POINTS_LEDGER,
    );

    const queryString = new URLSearchParams({
      limit: (
        validatedParams.limit || PAGINATION_LIMITS.POINTS_LEDGER.default
      ).toString(),
      offset: (validatedParams.offset || 0).toString(),
    });

    return await oxApi.getDirect<{
      balance: number;
      entries: PointsLedgerEntry[];
      total_count: number;
      has_next: boolean;
    }>(`/points/ledger?${queryString}`);
  },

  // ============================================================================
  // User Profile with Points
  // ============================================================================

  /**
   * 프로필 + 포인트 정보
   */
  getMyProfileWithPoints: async (): Promise<UserProfileWithPoints> => {
    return await oxApi.getWithBaseResponse<UserProfileWithPoints>(
      "/users/me/profile-with-points",
    );
  },

  /**
   * 재정 요약 정보
   */
  getMyFinancialSummary: async (): Promise<UserFinancialSummary> => {
    return await oxApi.getWithBaseResponse<UserFinancialSummary>(
      "/users/me/financial-summary",
    );
  },

  // ============================================================================
  // Points Validation
  // ============================================================================

  /**
   * 지불 가능 여부 확인
   */
  checkAffordability: async (amount: number): Promise<AffordabilityCheck> => {
    return await oxApi.getWithBaseResponse<AffordabilityCheck>(
      `/users/me/can-afford/${amount}`,
    );
  },
};
