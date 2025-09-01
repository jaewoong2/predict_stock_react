import { oxApi } from "./api";
import {
  AdWatchRequest,
  AdWatchResponse,
  AvailableSlotsResponse,
  SlotUnlockRequest,
  SlotUnlockResponse,
  AdWatchHistoryList,
} from "../types/ads";
import {
  PaginationParams,
  validatePaginationParams,
  PAGINATION_LIMITS,
} from "../types/common";

export const adService = {
  // ============================================================================
  // Ad Service
  // ============================================================================

  /**
   * 사용 가능한 슬롯 조회 (직접 응답)
   */
  getAvailableSlots: async (): Promise<AvailableSlotsResponse> => {
    return await oxApi.getDirect<AvailableSlotsResponse>("/ads/available-slots");
  },

  /**
   * 광고 시청 완료 처리 (직접 응답)
   */
  completeAdWatch: async (data: AdWatchRequest): Promise<AdWatchResponse> => {
    return await oxApi.postDirect<AdWatchResponse>("/ads/watch-complete", data);
  },

  /**
   * 슬롯 해제 (포인트 구매 또는 프리미엄 구독)
   */
  unlockSlot: async (data: SlotUnlockRequest): Promise<SlotUnlockResponse> => {
    return await oxApi.postDirect<SlotUnlockResponse>("/ads/unlock-slot", data);
  },

  /**
   * 광고 시청 내역 조회 (직접 응답)
   */
  getAdWatchHistory: async (
    pagination?: PaginationParams,
  ): Promise<AdWatchHistoryList> => {
    const validatedParams = validatePaginationParams(
      pagination || {},
      PAGINATION_LIMITS.REWARDS_HISTORY,
    );

    const queryString = new URLSearchParams({
      limit: (
        validatedParams.limit || PAGINATION_LIMITS.REWARDS_HISTORY.default
      ).toString(),
      offset: (validatedParams.offset || 0).toString(),
    });

    return await oxApi.getDirect<AdWatchHistoryList>(
      `/ads/history?${queryString}`,
    );
  },

  /**
   * 오늘 광고 시청 횟수 조회 (직접 응답)
   */
  getTodayAdWatchCount: async (): Promise<{ count: number; limit: number }> => {
    return await oxApi.getDirect<{ count: number; limit: number }>(
      "/ads/today-count",
    );
  },
};
