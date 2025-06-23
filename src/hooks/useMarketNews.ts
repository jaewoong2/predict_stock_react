import { useQuery } from "@tanstack/react-query";
import { newsService } from "@/services/newsService";
import {
  GetMarketNewsSummaryRequestParams,
  GetNewsRecommendationsParams,
  MarketForecastResponse,
  MarketNewsResponse,
  NewsRecommendationsResponse,
} from "@/types/news";

export const MARKET_NEWS_KEYS = {
  all: ["marketNews"] as const,
  summary: (ticker?: string, newsDate?: string, newsType?: string) =>
    [...MARKET_NEWS_KEYS.all, "summary", ticker, newsDate, newsType] as const,
};

export const useMarketNewsSummary = ({
  news_type,
  ticker,
  news_date,
}: GetMarketNewsSummaryRequestParams) => {
  return useQuery<MarketNewsResponse, Error>({
    queryKey: MARKET_NEWS_KEYS.summary(ticker, news_date, news_type),
    queryFn: () =>
      newsService.getMarketNewsSummary({
        news_type,
        ticker,
        news_date,
      }),
  });
};

export const NEWS_RECOMMENDATION_KEYS = {
  all: ["newsRecommendations"] as const,
  by: (recommendation: string, limit: number, date?: string) =>
    [...NEWS_RECOMMENDATION_KEYS.all, recommendation, limit, date] as const,
};

export const useNewsRecommendations = ({
  recommendation,
  limit = 5,
  date,
}: GetNewsRecommendationsParams) => {
  return useQuery<NewsRecommendationsResponse, Error>({
    queryKey: NEWS_RECOMMENDATION_KEYS.by(recommendation, limit, date),
    queryFn: () =>
      newsService.getNewsRecommendations({
        recommendation,
        limit,
        date,
      }),
  });
};

export const useMarketForecast = (
  date: string,
  source: MarketForecastResponse["source"]
) => {
  return useQuery<MarketForecastResponse, Error>({
    queryKey: ["marketForecast", date, source],
    queryFn: () => newsService.getMarketForecast({ date, source }),
    enabled: !!date, // 날짜가 있을 때만 쿼리 실행
  });
};
