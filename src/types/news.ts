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
