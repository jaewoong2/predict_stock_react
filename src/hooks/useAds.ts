import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adService } from "../services/adService";
import {
  AdWatchRequest,
  AdWatchResponse,
  AvailableSlotsResponse,
  SlotUnlockRequest,
  SlotUnlockResponse,
  AdWatchHistoryList,
} from "../types/ads";
import { PaginationParams } from "../types/common";

// ============================================================================
// Query Keys
// ============================================================================

export const ADS_KEYS = {
  all: ["ads"] as const,
  availableSlots: () => [...ADS_KEYS.all, "available-slots"] as const,
  history: (params?: PaginationParams) =>
    [...ADS_KEYS.all, "history", params] as const,
  todayCount: () => [...ADS_KEYS.all, "today-count"] as const,
} as const;

// ============================================================================
// Ad Query Hooks
// ============================================================================

/**
 * 사용 가능한 슬롯 조회 훅
 */
export const useAvailableSlots = () => {
  return useQuery({
    queryKey: ADS_KEYS.availableSlots(),
    queryFn: adService.getAvailableSlots,
    refetchInterval: 60 * 1000, // 1분마다 갱신
  });
};

/**
 * 광고 시청 내역 조회 훅
 */
export const useAdWatchHistory = (pagination?: PaginationParams) => {
  return useQuery({
    queryKey: ADS_KEYS.history(pagination),
    queryFn: () => adService.getAdWatchHistory(pagination),
  });
};

/**
 * 오늘 광고 시청 횟수 조회 훅
 */
export const useTodayAdWatchCount = () => {
  return useQuery({
    queryKey: ADS_KEYS.todayCount(),
    queryFn: adService.getTodayAdWatchCount,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// ============================================================================
// Ad Mutation Hooks
// ============================================================================

/**
 * 광고 시청 완료 처리 훅
 */
export const useCompleteAdWatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdWatchRequest) => adService.completeAdWatch(data),
    onSuccess: () => {
      // 관련 데이터 무효화
      queryClient.invalidateQueries({ queryKey: ADS_KEYS.availableSlots() });
      queryClient.invalidateQueries({ queryKey: ADS_KEYS.history() });
      queryClient.invalidateQueries({ queryKey: ADS_KEYS.todayCount() });
      // 예측 관련 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: ["predictions", "remaining"] });
    },
  });
};

/**
 * 슬롯 해제 훅
 */
export const useUnlockSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SlotUnlockRequest) => adService.unlockSlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADS_KEYS.availableSlots() });
      queryClient.invalidateQueries({ queryKey: ADS_KEYS.history() });
      // 예측 관련 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: ["predictions", "remaining"] });
    },
  });
};
