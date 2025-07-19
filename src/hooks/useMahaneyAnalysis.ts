import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  MahaneyAnalysisGetRequest,
  MahaneyAnalysisGetResponse,
} from "../types/mahaney";
import { mahaneyAnalysisService } from "@/services/mahaneyService";

export const MAHANEY_KEYS = {
  all: ["mahaney"] as const,
  lists: () => [...MAHANEY_KEYS.all, "list"] as const,
  analysis: (params: MahaneyAnalysisGetRequest) =>
    [...MAHANEY_KEYS.lists(), params] as const,
};

export const useMahaneyAnalysis = (
  params: MahaneyAnalysisGetRequest = {},
  options?: Omit<
    UseQueryOptions<MahaneyAnalysisGetResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<MahaneyAnalysisGetResponse, Error>({
    queryKey: MAHANEY_KEYS.analysis(params),
    queryFn: () => mahaneyAnalysisService.getMahaneyAnalysis(params),
    ...options,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 데이터 사용
  });
};