export interface ResearchItem {
  title: string;
  date: string;
  source: string;
  summary: string;
  entities: string[];
  event_type: string;
}

export interface ResearchResults {
  research_items: ResearchItem[];
}

export interface StockMetrics {
  ticker: string;
  company_name: string;
  revenue_growth_rate: number;
  rs_strength: number;
  market_cap: number;
  sector: string;
  current_price: number;
  volume_trend: string;
}

export interface LeadingStock {
  stock_metrics: StockMetrics;
  analysis_summary: string;
  growth_potential: string;
  risk_factors: string[];
  target_price: number;
  recommendation: string;
}

export interface LeadingStocks {
  leading_stocks: LeadingStock[];
}

export interface CompanyInfo {
  sector: string;
  reason: string;
}

export interface SectorAnalysis {
  analysis: {
    primary_beneficiaries: CompanyInfo[];
    supply_chain_beneficiaries: CompanyInfo[];
    bottleneck_solution_beneficiaries: CompanyInfo[];
    infrastructure_beneficiaries: CompanyInfo[];
  };
}

export interface ComprehensiveResearch {
  id: number;
  date: string;
  name: string;
  value: {
    research_date: string;
    research_results: ResearchResults;
    sector_analysis: SectorAnalysis;
    leading_stocks: LeadingStocks;
  };
  created_at: string | null;
}

export interface ResearchRequestParams {
  target_date: string;
  limit?: number | null;
  sort_by?: string | null;
  sort_order?: string | null;
}

export interface ResearchAnalysis {
  actual_date: string;
  analyses: ComprehensiveResearch[];
  filtered_count: number;
  is_exact_date_match: boolean;
  request_params: {
    target_date: string;
    limit: number | null;
    sort_by: string | null;
    sort_order: string | null;
  };
  total_count: number;
}
