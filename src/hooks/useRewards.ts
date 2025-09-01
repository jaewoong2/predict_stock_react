import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rewardService } from "../services/rewardService";
import { RewardRedemptionRequest } from "../types/rewards";
import { PaginationParams } from "../types/common";
import { useCallback } from "react";

// ============================================================================
// Query Keys
// ============================================================================

export const REWARDS_KEYS = {
  all: ["rewards"] as const,
  catalog: (availableOnly: boolean) =>
    [...REWARDS_KEYS.all, "catalog", availableOnly] as const,
  item: (sku: string) => [...REWARDS_KEYS.all, "item", sku] as const,
  myRedemptions: (pagination?: PaginationParams) =>
    [...REWARDS_KEYS.all, "my-redemptions", pagination] as const,
} as const;

// ============================================================================
// Reward Query Hooks
// ============================================================================

/**
 * 리워드 카탈로그 조회 훅
 */
export const useRewardCatalog = (availableOnly: boolean = true) => {
  return useQuery({
    queryKey: REWARDS_KEYS.catalog(availableOnly),
    queryFn: () => rewardService.getRewardCatalog(availableOnly),
    staleTime: 10 * 60 * 1000, // 10분
  });
};

/**
 * 특정 리워드 조회 훅
 */
export const useRewardBySku = (sku: string) => {
  return useQuery({
    queryKey: REWARDS_KEYS.item(sku),
    queryFn: () => rewardService.getRewardBySku(sku),
    enabled: !!sku,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 내 교환 내역 조회 훅
 */
export const useMyRedemptions = (pagination?: PaginationParams) => {
  return useQuery({
    queryKey: REWARDS_KEYS.myRedemptions(pagination),
    queryFn: () => rewardService.getMyRedemptions(pagination),
    staleTime: 2 * 60 * 1000, // 2분
  });
};

// ============================================================================
// Reward Mutation Hooks
// ============================================================================

/**
 * 리워드 교환 훅
 */
export const useRedeemReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RewardRedemptionRequest) =>
      rewardService.redeemReward(request),
    onSuccess: () => {
      // 관련 데이터 무효화
      queryClient.invalidateQueries({ queryKey: REWARDS_KEYS.catalog(true) });
      queryClient.invalidateQueries({ queryKey: REWARDS_KEYS.myRedemptions() });
      // 포인트 관련 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: ["points", "balance"] });
    },
  });
};

// ============================================================================
// Reward Utility Hooks
// ============================================================================

/**
 * 리워드 교환 플로우 훅
 */
export const useRewardExchange = () => {
  const redeemMutation = useRedeemReward();

  const exchangeReward = useCallback(
    async (request: RewardRedemptionRequest) => {
      return redeemMutation.mutateAsync(request);
    },
    [redeemMutation],
  );

  return {
    exchangeReward,
    isLoading: redeemMutation.isPending,
    error: redeemMutation.error,
  };
};
