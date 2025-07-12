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
import api from "./api";
import { MarketAnalysis } from "@/types/market";

export const newsService = {
  async getMarketNewsSummary({
    news_type,
    ticker,
    news_date,
  }: GetMarketNewsSummaryRequestParams): Promise<MarketNewsResponse> {
    const url = "/news/";
    const params: GetMarketNewsSummaryRequestParams = {};
    if (news_type) {
      params.news_type = news_type;
    }
    if (ticker) {
      params.ticker = ticker;
    }
    if (news_date) {
      params.news_date = news_date;
    }
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
      { params },
    );
    return response.data;
  },

  async getMarketForecast({
    date,
    source = "Major",
  }: MarketForeCastRequestParams) {
    const response = await api.get<MarketForecastResponse[]>(
      "/news/market-forecast",
      { params: { forecast_date: date, source: source } },
    );

    return response.data;
  },

  async getMarketAnalysis(date: string): Promise<MarketAnalysis> {
    try {
      const res = await api.get<MarketAnalysis>("/news/market-analysis", {
        params: { today: date },
      });

      return res.data;
    } catch (error) {
      console.error("Failed to fetch market analysis:", error);
      throw error;
    }
  },
};
