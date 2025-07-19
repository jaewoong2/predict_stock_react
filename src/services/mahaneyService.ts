import api from "./api";
import {
  MahaneyAnalysisGetRequest,
  MahaneyAnalysisGetResponse,
} from "../types/mahaney";

class MahaneyAnalysisService {
  async getMahaneyAnalysis(
    params: MahaneyAnalysisGetRequest = {},
  ): Promise<MahaneyAnalysisGetResponse> {
    const searchParams: Record<string, string> = {};

    if (params.target_date) {
      searchParams.target_date = params.target_date;
    }
    if (params.tickers?.length) {
      searchParams.tickers = params.tickers.join(",");
    }
    if (params.recommendation) {
      searchParams.recommendation = params.recommendation;
    }
    if (params.limit) {
      searchParams.limit = params.limit.toString();
    }
    if (params.sort_by) {
      searchParams.sort_by = params.sort_by;
    }
    if (params.sort_order) {
      searchParams.sort_order = params.sort_order;
    }

    const response = await api.get<MahaneyAnalysisGetResponse>(
      "news/tech-stock/analysis",
      { params: searchParams },
    );

    return response.data;
  }
}

export const mahaneyAnalysisService = new MahaneyAnalysisService();