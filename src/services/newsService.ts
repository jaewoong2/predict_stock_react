import axios from "axios";
import {
  GetMarketNewsSummaryRequestParams,
  MarketForeCastRequestParams,
  MarketForecastResponse,
  MarketNewsResponse,
} from "@/types/news";
import {
  GetNewsRecommendationsParams,
  NewsRecommendationsResponse,
} from "@/types/news";

const API_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_LOCAL_URL
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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
    const url = "/news/";
    const params = {
      news_type,
      ticker,
      news_date,
    };
    const response = await api.get<MarketNewsResponse>(url, { params });
    return response.data;
  },

  async getNewsRecommendations({
    recommendation,
    limit = 5,
    date,
  }: GetNewsRecommendationsParams): Promise<NewsRecommendationsResponse> {
    const params: Record<string, string | number> = {
      recommendation,
      limit,
    };

    if (date) {
      params.date = date;
    }

    const response = await api.get<NewsRecommendationsResponse>(
      "/news/recommendations",
      { params }
    );
    return response.data;
  },

  async getMarketForecast({
    date,
    source = "Major",
  }: MarketForeCastRequestParams) {
    const response = await api.get<MarketForecastResponse[]>(
      "/news/market-forecast",
      { params: { forecast_date: date, source: source } }
    );

    return response.data;
  },
};
