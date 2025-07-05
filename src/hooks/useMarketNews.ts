import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { newsService } from "@/services/newsService";
import {
  GetMarketNewsSummaryRequestParams,
  GetNewsRecommendationsParams,
  MarketForecastResponse,
  MarketNewsResponse,
  NewsRecommendationsResponse,
} from "@/types/news";
import { MarketAnalysis } from "@/types/market";

export const MARKET_NEWS_KEYS = {
  all: ["marketNews"] as const,
  summary: (ticker?: string, newsDate?: string, newsType?: string) =>
    [...MARKET_NEWS_KEYS.all, "summary", ticker, newsDate, newsType] as const,
};

export const useMarketNewsSummary = (
  { news_type, ticker, news_date }: GetMarketNewsSummaryRequestParams,
  options?: Omit<
    UseQueryOptions<MarketNewsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<MarketNewsResponse, Error>({
    queryKey: MARKET_NEWS_KEYS.summary(ticker, news_date, news_type),
    queryFn: () =>
      newsService.getMarketNewsSummary({
        news_type,
        ticker,
        news_date,
      }),
    ...options,
  });
};

export const NEWS_RECOMMENDATION_KEYS = {
  all: ["newsRecommendations"] as const,
  by: (recommendation: string, limit: number, date?: string) =>
    [...NEWS_RECOMMENDATION_KEYS.all, recommendation, limit, date] as const,
};

export const useNewsRecommendations = (
  { recommendation, limit = 5, date }: GetNewsRecommendationsParams,
  options?: Omit<
    UseQueryOptions<NewsRecommendationsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<NewsRecommendationsResponse, Error>({
    queryKey: NEWS_RECOMMENDATION_KEYS.by(recommendation, limit, date),
    queryFn: () =>
      newsService.getNewsRecommendations({
        recommendation,
        limit,
        date,
      }),
    ...options,
  });
};

export const useMarketForecast = (
  date: string,
  source: MarketForecastResponse["source"],
  options?: Omit<
    UseQueryOptions<MarketForecastResponse[], Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<MarketForecastResponse[], Error>({
    queryKey: ["marketForecast", date, source],
    queryFn: () => newsService.getMarketForecast({ date, source }),
    enabled: !!date && (options?.enabled === undefined || options.enabled),
    ...options,
  });
};

export const useMarketAnalysis = (
  date: string,
  options?: Omit<
    UseQueryOptions<MarketAnalysis, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<MarketAnalysis, Error>({
    queryKey: ["marketAnalysis", date],
    queryFn: () => newsService.getMarketAnalysis(date),
    enabled: !!date && (options?.enabled === undefined || options.enabled),
    ...options,
  });
};
