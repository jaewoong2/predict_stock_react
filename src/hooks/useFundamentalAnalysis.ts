import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fundamentalAnalysisService } from "@/services/fundamentalAnalysisService";
import {
  FundamentalAnalysisGetResponse,
  FundamentalAnalysisParams,
} from "@/types/fundamental-analysis";

export const FUNDAMENTAL_ANALYSIS_KEYS = {
  all: ["fundamentalAnalysis"] as const,
  byTicker: (ticker: string, targetDate?: string) =>
    [...FUNDAMENTAL_ANALYSIS_KEYS.all, ticker, targetDate] as const,
};

/**
 * React Query hook for fetching fundamental analysis
 * @param params - Query parameters (ticker, force_refresh, target_date)
 * @param options - Additional React Query options
 */
export const useFundamentalAnalysis = (
  params: FundamentalAnalysisParams,
  options?: Omit<
    UseQueryOptions<FundamentalAnalysisGetResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<FundamentalAnalysisGetResponse, Error>({
    queryKey: FUNDAMENTAL_ANALYSIS_KEYS.byTicker(
      params.ticker,
      params.target_date
    ),
    queryFn: () => fundamentalAnalysisService.getFundamentalAnalysis(params),
    enabled: !!params.ticker && (options?.enabled === undefined || options.enabled),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
    ...options,
  });
};
