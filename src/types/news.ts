export type MarketNewsItem = {
  ticker: string | null;
  headline: string;
  detail_description: string;
  created_at: string;
  result_type: "market";
  id: number;
  date_yyyymmdd: string;
  summary: string;
};

export interface MarketNewsResponse {
  result: MarketNewsItem[];
}
