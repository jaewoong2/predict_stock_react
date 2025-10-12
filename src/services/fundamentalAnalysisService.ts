import api from "./api";
import {
  FundamentalAnalysisGetResponse,
  FundamentalAnalysisParams,
} from "@/types/fundamental-analysis";

export const fundamentalAnalysisService = {
  /**
   * Fetch fundamental analysis for a ticker
   * @param params - Query parameters (ticker, force_refresh, target_date)
   * @returns Fundamental analysis data with cache info
   */
  async getFundamentalAnalysis({
    ticker,
    force_refresh = false,
    analysis_request = false,
    target_date,
  }: FundamentalAnalysisParams): Promise<FundamentalAnalysisGetResponse> {
    const params: Record<string, string> = {
      ticker: ticker.toUpperCase(),
      force_refresh: String(force_refresh),
      analysis_request: String(analysis_request),
    };

    if (target_date) {
      params.target_date = target_date;
    }

    const response = await api.get<FundamentalAnalysisGetResponse>(
      "/news/fundamental-analysis",
      { params }
    );

    return response.data;
  },
};
