import { useQuery } from "@tanstack/react-query";
import { newsService } from "@/services/newsService";
import {
  GetMarketNewsSummaryRequestParams,
  MarketNewsResponse,
} from "@/types/news";

export const MARKET_NEWS_KEYS = {
  all: ["marketNews"] as const,
  summary: () => [...MARKET_NEWS_KEYS.all, "summary"] as const,
};

export const useMarketNewsSummary = ({
  news_type,
  ticker,
}: GetMarketNewsSummaryRequestParams) => {
  return useQuery<MarketNewsResponse, Error>({
    queryKey: MARKET_NEWS_KEYS.summary(),
    queryFn: () =>
      newsService.getMarketNewsSummary({
        news_type,
        ticker,
      }),
  });
};
