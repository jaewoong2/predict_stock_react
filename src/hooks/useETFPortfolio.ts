import { useQuery, useMutation, UseQueryOptions } from "@tanstack/react-query";
import { etfService } from "@/services/etfService";
import {
  ETFAnalysisGetRequest,
  ETFAnalysisGetResponse,
  ETFAnalysisPostRequest,
} from "@/types/etf";

export const ETF_KEYS = {
  all: ["etf"] as const,
  portfolios: () => [...ETF_KEYS.all, "portfolios"] as const,
  portfolio: (params: ETFAnalysisGetRequest) =>
    [...ETF_KEYS.portfolios(), params] as const,
};

export const useETFPortfolio = (
  params: ETFAnalysisGetRequest = {},
  options?: Omit<
    UseQueryOptions<ETFAnalysisGetResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ETFAnalysisGetResponse, Error>({
    queryKey: ETF_KEYS.portfolio(params),
    queryFn: () => etfService.getETFPortfolio(params),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 데이터 사용
    ...options,
  });
};

export const useCreateETFPortfolioAnalysis = () => {
  return useMutation<void, Error, ETFAnalysisPostRequest>({
    mutationFn: (params: ETFAnalysisPostRequest) =>
      etfService.createETFPortfolioAnalysis(params),
  });
};