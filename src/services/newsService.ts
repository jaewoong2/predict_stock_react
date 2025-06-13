import axios from "axios";
import { MarketNewsResponse } from "@/types/news";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const newsService = {
  async getMarketNewsSummary(): Promise<MarketNewsResponse> {
    const response = await api.get<MarketNewsResponse>("/market/news-summary");
    return response.data;
  },
};
