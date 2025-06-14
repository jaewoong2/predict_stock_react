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
    news_date,
  }: GetMarketNewsSummaryRequestParams): Promise<MarketNewsResponse> {
    const url =
      `/market/news` +
      (news_type ? `?news_type=${news_type}` : "") +
      (ticker ? `&ticker=${ticker}` : "") +
      (news_date ? `&news_date=${news_date}` : "");
    const response = await api.get<MarketNewsResponse>(url);
    return response.data;
  },
};
