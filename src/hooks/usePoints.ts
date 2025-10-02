import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { pointService } from "../services/pointService";
import {
  PointsBalance,
  PointsLedgerEntry,
  PointsLedger,
  UserProfileWithPoints,
  UserFinancialSummary,
  AffordabilityCheck,
} from "../types/points";
import { PaginationParams } from "../types/common";
import { useAuth } from "./useAuth";

// ============================================================================
// Query Keys
// ============================================================================

export const POINTS_KEYS = {
  all: ["points"] as const,
  balance: () => [...POINTS_KEYS.all, "balance"] as const,
  ledger: (pagination?: PaginationParams) =>
    [...POINTS_KEYS.all, "ledger", pagination] as const,
  profileWithPoints: () => [...POINTS_KEYS.all, "profile-with-points"] as const,
  financialSummary: () => [...POINTS_KEYS.all, "financial-summary"] as const,
  affordability: (amount: number) =>
    [...POINTS_KEYS.all, "can-afford", amount] as const,
} as const;

// ============================================================================
// Points Query Hooks
// ============================================================================

/**
 * 포인트 잔액 조회 훅
 */
export const usePointsBalance = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: POINTS_KEYS.balance(),
    queryFn: pointService.getMyPointsBalance,
    staleTime: 30 * 1000, // 30초
    enabled: isAuthenticated,
  });
};

/**
 * 포인트 거래 내역 조회 훅 (무한 스크롤)
 */
export const usePointsLedger = (pagination?: PaginationParams) => {
  const { isAuthenticated } = useAuth();
  return useInfiniteQuery({
    queryKey: POINTS_KEYS.ledger(pagination),
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      pointService.getMyPointsLedger({
        ...pagination,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.has_next) return undefined;
      const loadedCount = allPages.reduce(
        (sum, page) => sum + page.entries.length,
        0,
      );
      return loadedCount;
    },
    staleTime: 30 * 1000, // 30초
    enabled: isAuthenticated,
  });
};

/**
 * 프로필 + 포인트 정보 조회 훅
 */
export const useProfileWithPoints = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: POINTS_KEYS.profileWithPoints(),
    queryFn: pointService.getMyProfileWithPoints,
    staleTime: 60 * 1000, // 1분
    enabled: isAuthenticated,
  });
};

/**
 * 재정 요약 정보 조회 훅
 */
export const useFinancialSummary = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: POINTS_KEYS.financialSummary(),
    queryFn: pointService.getMyFinancialSummary,
    staleTime: 5 * 60 * 1000, // 5분
    enabled: isAuthenticated,
  });
};

/**
 * 지불 가능 여부 확인 훅
 */
export const useCheckAffordability = (amount: number) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: POINTS_KEYS.affordability(amount),
    queryFn: () => pointService.checkAffordability(amount),
    enabled: isAuthenticated && amount > 0,
    staleTime: 30 * 1000, // 30초
  });
};
