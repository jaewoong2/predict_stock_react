import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { researchService } from "../services/researchService";
import { ResearchAnalysis, ResearchRequestParams } from "../types/research";

export const RESEARCH_KEYS = {
  all: ["research"] as const,
  analysis: (params?: ResearchRequestParams) => [...RESEARCH_KEYS.all, "analysis", params] as const,
};

export const useResearch = (
  params?: ResearchRequestParams,
  options?: Omit<
    UseQueryOptions<ResearchAnalysis, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<ResearchAnalysis, Error>({
    queryKey: RESEARCH_KEYS.analysis(params),
    queryFn: () => researchService.getAnalysis(params),
    staleTime: 1000 * 60 * 30, // 30분
    ...options,
  });
};