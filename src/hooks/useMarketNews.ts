import { useQuery } from "@tanstack/react-query";
import { newsService } from "@/services/newsService";
import { MarketNewsResponse } from "@/types/news";

export const MARKET_NEWS_KEYS = {
  all: ["marketNews"] as const,
  summary: () => [...MARKET_NEWS_KEYS.all, "summary"] as const,
};

export const useMarketNewsSummary = () => {
  return useQuery<MarketNewsResponse, Error>({
    queryKey: MARKET_NEWS_KEYS.summary(),
    queryFn: newsService.getMarketNewsSummary,
  });
};
