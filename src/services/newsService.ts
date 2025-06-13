import axios from "axios";
import {
  GetMarketNewsSummaryRequestParams,
  MarketNewsResponse,
} from "@/types/news";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const newsService = {
  async getMarketNewsSummary({
    news_type,
    ticker,
  }: GetMarketNewsSummaryRequestParams): Promise<MarketNewsResponse> {
    const url =
      `/market/news` +
      (news_type ? `?news_type=${news_type}` : "") +
      (ticker ? `&ticker=${ticker}` : "");
    const response = await api.get<MarketNewsResponse>(url);
    return response.data;
  },
};
