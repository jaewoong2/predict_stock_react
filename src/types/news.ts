export type MarketNewsItem = {
  ticker: string | null;
  headline: string;
  detail_description: string;
  created_at: string;
  result_type: "market";
  id: number;
  date_yyyymmdd: string;
  summary: string;
  recommendation: "Buy" | "Sell" | "Hold" | null;
};

export interface MarketNewsResponse {
  result: MarketNewsItem[];
}

export type GetMarketNewsSummaryRequestParams = {
  ticker?: string;
  news_type?: "market" | "ticker";
  news_date?: string; // YYYY-MM-DD 형식
};

export type NewsRecommendationItem = {
  date: string;
  headline: string;
  summary: string;
  detail_description: string;
  recommendation: "Buy" | "Sell" | "Hold" | null;
};

export type TickerNewsRecommendation = {
  ticker: string;
  news: NewsRecommendationItem[];
};

export interface NewsRecommendationsResponse {
  results: TickerNewsRecommendation[];
}

export type GetNewsRecommendationsParams = {
  recommendation: "Buy" | "Hold" | "Sell";
  limit?: number;
  date?: string; // YYYY-MM-DD 형식
};

export type MarketForeCastRequestParams = {
  date: string; // YYYY-MM-DD 형식
  source?: "Major" | "Minor";
};

export type MarketForecastResponse = {
  date_yyyymmdd: string;
  outlook: "UP" | "DOWN";
  reason: string;
  up_percentage?: number; // e.g., '70'
  created_at?: string; // ISO format string for datetime
  source?: "Major" | "Minor";
};
