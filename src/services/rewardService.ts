import { oxApi } from "./api";
import {
  RewardItem,
  RewardCatalogResponse,
  RewardRedemptionRequest,
  RewardRedemptionResponse,
  RewardRedemptionHistory,
  RewardRedemptionHistoryResponse,
} from "../types/rewards";
import {
  PaginationParams,
  validatePaginationParams,
  PAGINATION_LIMITS,
} from "../types/common";

export const rewardService = {
  // ============================================================================
  // Reward Catalog Operations
  // ============================================================================

  /**
   * 리워드 카탈로그 조회 (직접 응답)
   */
  getRewardCatalog: async (
    availableOnly: boolean = true,
  ): Promise<RewardCatalogResponse> => {
    const queryString = new URLSearchParams({
      available_only: availableOnly.toString(),
    });

    return await oxApi.getDirect<RewardCatalogResponse>(
      `/rewards/catalog?${queryString}`,
    );
  },

  /**
   * SKU로 특정 리워드 조회 (직접 응답)
   */
  getRewardBySku: async (sku: string): Promise<RewardItem | null> => {
    try {
      return await oxApi.getDirect<RewardItem>(`/rewards/catalog/${sku}`);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // ============================================================================
  // Reward Redemption Operations
  // ============================================================================

  /**
   * 리워드 교환 요청 (직접 응답)
   */
  redeemReward: async (
    request: RewardRedemptionRequest,
  ): Promise<RewardRedemptionResponse> => {
    return await oxApi.postDirect<RewardRedemptionResponse>(
      "/rewards/redeem",
      request,
    );
  },

  /**
   * 내 교환 내역 조회 (직접 응답)
   */
  getMyRedemptions: async (
    pagination?: PaginationParams,
  ): Promise<RewardRedemptionHistoryResponse> => {
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

    return await oxApi.getDirect<RewardRedemptionHistoryResponse>(
      `/rewards/my-redemptions?${queryString}`,
    );
  },
};
