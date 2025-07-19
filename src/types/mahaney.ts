export interface MahaneyCriterionEvaluation {
  pass_criterion: boolean;
  score: number;
  metric: string;
  comment: string;
}

export interface MahaneyStockAnalysis {
  stock_name: string;
  revenue_growth: MahaneyCriterionEvaluation;
  valuation: MahaneyCriterionEvaluation;
  product_innovation: MahaneyCriterionEvaluation;
  tam: MahaneyCriterionEvaluation;
  customer_value: MahaneyCriterionEvaluation;
  management_quality: MahaneyCriterionEvaluation;
  timing: MahaneyCriterionEvaluation;
  final_assessment: string;
  recommendation: "Buy" | "Sell" | "Hold";
  recommendation_score: string;
  summary: string;
  detail_summary: string;
}

export interface MahaneyAnalysisGetRequest {
  target_date?: string;
  tickers?: string[];
  recommendation?: "Buy" | "Sell" | "Hold";
  limit?: number;
  sort_by?: "recommendation_score" | "final_assessment" | "stock_name";
  sort_order?: "asc" | "desc";
}

export interface MahaneyAnalysisGetResponse {
  stocks: MahaneyStockAnalysis[];
  total_count: number;
  filtered_count: number;
  request_params: MahaneyAnalysisGetRequest;
}