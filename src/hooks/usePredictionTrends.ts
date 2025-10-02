import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { predictionTrendsService } from "@/services/predictionTrendsService";
import type { PredictionDirectionStatsResponse } from "@/types/prediction-trends";

/**
 * 롱/숏 예측 통계 조회 Hook
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = usePredictionDirectionStats({
 *   date: "2025-10-02",
 *   limit: 5,
 * });
 * ```
 */
export function usePredictionDirectionStats(
  params?: {
    date?: string;
    limit?: number;
  },
  options?: Omit<
    UseQueryOptions<PredictionDirectionStatsResponse>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: ["prediction-direction-stats", params?.date, params?.limit],
    queryFn: () => predictionTrendsService.getDirectionStats(params),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    ...options,
  });
}

