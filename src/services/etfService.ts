import {
  ETFAnalysisGetRequest,
  ETFAnalysisGetResponse,
  ETFAnalysisPostRequest,
} from "@/types/etf";
import api from "./api";

export const etfService = {
  async getETFPortfolio({
    target_date,
    etf_tickers,
    limit,
    sort_by = "date",
    sort_order = "desc",
  }: ETFAnalysisGetRequest): Promise<ETFAnalysisGetResponse> {
    const params: ETFAnalysisGetRequest = {
      sort_by,
      sort_order,
    };

    if (target_date) {
      params.target_date = target_date;
    }
    if (etf_tickers) {
      params.etf_tickers = etf_tickers;
    }
    if (limit) {
      params.limit = limit;
    }

    const response = await api.get<ETFAnalysisGetResponse>(
      "/news/etf/portfolio",
      { params },
    );
    return response.data;
  },

  async createETFPortfolioAnalysis({
    etf_tickers,
    target_date,
  }: ETFAnalysisPostRequest): Promise<void> {
    const payload: ETFAnalysisPostRequest = {
      etf_tickers,
    };

    if (target_date) {
      payload.target_date = target_date;
    }

    await api.post("/news/etf/portfolio", payload);
  },
};
