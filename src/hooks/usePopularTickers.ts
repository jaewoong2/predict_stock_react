import { useQuery } from "@tanstack/react-query";
import { tickerService } from "@/services/tickerService";
import type { StockData } from "@/types/ticker";

/**
 * 인기 티커 목록 조회 Hook
 *
 * @example
 * ```tsx
 * const { data: popularTickers } = usePopularTickers({ limit: 8 });
 * ```
 */
export function usePopularTickers(params?: {
  target_date?: string;
  direction?: "asc" | "desc";
  field?: "close_change" | "volume_change";
  limit?: number;
}) {
  return useQuery<StockData[]>({
    queryKey: ["popular-tickers", params],
    queryFn: () => {
      const queryParams: Partial<{
        target_date: string;
        direction: "asc" | "desc";
        field: "close_change" | "volume_change";
        limit: number;
      }> = {
        direction: params?.direction || "desc",
        field: params?.field || "volume_change",
        limit: params?.limit || 8,
      };

      // target_date가 있을 때만 포함 (undefined 방지)
      if (params?.target_date) {
        queryParams.target_date = params.target_date;
      }

      return tickerService.getPopularStocks(queryParams);
    },
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
    retry: false,
  });
}
