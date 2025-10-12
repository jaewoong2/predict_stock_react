// ============================================
// Enums
// ============================================

export type VisionStatus = 'Strong' | 'Moderate' | 'Weak' | 'Dead';
export type MarketSentiment = 'Very Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Very Bearish';
export type RelativeStrength = 'Leading' | 'In-line' | 'Lagging';
export type MoatRating = 'Wide' | 'Narrow' | 'None';
export type PipelineStrength = 'Strong' | 'Moderate' | 'Weak';
export type InnovationScore = 'Leader' | 'Fast Follower' | 'Laggard';
export type ManagementScore = 'Excellent' | 'Good' | 'Average' | 'Poor';
export type RiskScore = 'Low' | 'Medium' | 'High' | 'Very High';
export type Rating = 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
export type TimeHorizon = 'Short-term' | 'Medium-term' | 'Long-term';
export type ConvictionLevel = 'Very High' | 'High' | 'Medium' | 'Low';
export type MarginTrend = 'Expanding' | 'Stable' | 'Contracting';

// ============================================
// Source Reference
// ============================================

export interface SourceRef {
  name?: string;
  url?: string;
  date?: string;
  confidence?: number; // 0.0 ~ 1.0
}

// ============================================
// Analysis Sections
// ============================================

export interface NarrativeVisionAnalysis {
  key_narrative: string;
  vision_status: VisionStatus;
  narrative_drivers: string[];
  vision_sustainability: string;
  narrative_shift_risks: string[];
  market_sentiment: MarketSentiment;
  sentiment_reasoning: string;
  sources: SourceRef[];
}

export interface SectorAnalysis {
  sector_name: string;
  sector_performance: string;
  sector_ytd_return?: number;
  rotation_trend: string;
  key_catalysts: string[];
  key_headwinds: string[];
  relative_strength: RelativeStrength;
  peer_comparison?: string;
  sector_outlook: string;
  sources: SourceRef[];
}

export interface CompetitivePosition {
  market_share?: number;
  market_share_trend?: string;
  key_competitors: string[];
  competitive_advantages: string[];
  competitive_threats: string[];
  moat_rating: MoatRating;
  moat_explanation: string;
}

export interface ProductInnovation {
  recent_product_launches: string[];
  pipeline_strength: PipelineStrength;
  rd_spending?: number; // % of revenue
  innovation_score: InnovationScore;
  key_patents_or_tech: string[];
  product_cycle_stage: string;
}

export interface MarketOpportunity {
  total_addressable_market?: number; // in billions USD
  serviceable_addressable_market?: number;
  market_growth_rate?: number; // CAGR %
  company_penetration?: number; // % of TAM
  expansion_opportunities: string[];
  geographic_breakdown?: string;
}

// ============================================
// Financial Metrics
// ============================================

export interface GrowthMetrics {
  revenue_growth_yoy?: number;
  revenue_growth_qoq?: number;
  revenue_growth_3yr_cagr?: number;
  eps_growth_yoy?: number;
  eps_growth_3yr_cagr?: number;
  revenue_guidance?: string;
  earnings_surprise_history?: string;
}

export interface ProfitabilityMetrics {
  gross_margin?: number;
  operating_margin?: number;
  net_margin?: number;
  margin_trend?: MarginTrend;
  roe?: number;
  roic?: number;
  roa?: number;
}

export interface BalanceSheetMetrics {
  debt_to_equity?: number;
  net_debt?: number;
  current_ratio?: number;
  quick_ratio?: number;
  cash_and_equivalents?: number;
  total_debt?: number;
  debt_maturity_profile?: string;
  interest_coverage?: number;
}

export interface CashFlowMetrics {
  free_cash_flow?: number;
  fcf_yield?: number;
  operating_cash_flow?: number;
  capex?: number;
  fcf_conversion_rate?: number;
  cash_flow_trend?: string;
}

export interface ValuationMetrics {
  pe_ratio?: number;
  forward_pe?: number;
  peg_ratio?: number;
  price_to_sales?: number;
  price_to_book?: number;
  ev_to_ebitda?: number;
  valuation_vs_peers?: string;
  valuation_vs_historical?: string;
  fair_value_estimate?: number;
}

export interface FundamentalMetrics {
  growth: GrowthMetrics;
  profitability: ProfitabilityMetrics;
  balance_sheet: BalanceSheetMetrics;
  cash_flow: CashFlowMetrics;
  valuation: ValuationMetrics;
  sources: SourceRef[];
}

// ============================================
// Management & Risk
// ============================================

export interface ManagementAnalysis {
  ceo_name?: string;
  ceo_tenure?: string;
  ceo_background?: string;
  management_quality_score: ManagementScore;
  key_strengths: string[];
  key_concerns: string[];
  execution_track_record: string;
  capital_allocation_score: ManagementScore;
  insider_ownership?: number;
  recent_insider_activity?: string;
  compensation_alignment?: string;
  board_quality?: string;
  sources: SourceRef[];
}

export interface RiskAnalysis {
  regulatory_risks: string[];
  competitive_risks: string[];
  execution_risks: string[];
  macro_risks: string[];
  financial_risks: string[];
  overall_risk_score: RiskScore;
  black_swan_scenarios: string[];
}

export interface CatalystAnalysis {
  near_term_catalysts: string[];
  medium_term_catalysts: string[];
  long_term_catalysts: string[];
  earnings_date?: string;
  product_launches: string[];
  regulatory_milestones: string[];
}

// ============================================
// Recommendation
// ============================================

export interface InvestmentRecommendation {
  rating: Rating;
  target_price?: number;
  current_price?: number;
  upside_downside?: number;
  time_horizon: TimeHorizon;
  conviction_level: ConvictionLevel;
  key_bullish_factors: string[];
  key_bearish_factors: string[];
  base_case_scenario: string;
  bull_case_scenario: string;
  bear_case_scenario: string;
  risk_level: RiskScore;
  confidence_level: ConvictionLevel;
  ideal_entry_point?: string;
  stop_loss_suggestion?: number;
}

// ============================================
// Main Response
// ============================================

export interface FundamentalAnalysisResponse {
  ticker: string;
  company_name: string;
  industry?: string;
  analysis_date: string;

  // Core sections
  narrative_vision: NarrativeVisionAnalysis;
  sector_analysis: SectorAnalysis;
  competitive_position: CompetitivePosition;
  product_innovation: ProductInnovation;
  market_opportunity: MarketOpportunity;
  fundamental_metrics: FundamentalMetrics;
  management_analysis: ManagementAnalysis;
  risk_analysis: RiskAnalysis;
  catalyst_analysis: CatalystAnalysis;
  recommendation: InvestmentRecommendation;

  // Summary
  executive_summary: string;
  investment_thesis: string;
  key_takeaways: string[];
  last_updated: string;
}

export interface FundamentalAnalysisGetResponse {
  analysis: FundamentalAnalysisResponse;
  is_cached: boolean;
  cache_date?: string;
  days_until_expiry?: number;
}

// ============================================
// API Request Params
// ============================================

export interface FundamentalAnalysisParams {
  ticker: string;
  force_refresh?: boolean;
  analysis_request?: boolean; // Trigger fresh analysis when needed
  target_date?: string; // YYYY-MM-DD
}
