export interface MarketAnalysis {
  analysis_date_est: string;
  market_overview: MarketOverview;
  top_momentum_sectors?: MomentumSector[];
}

export interface MarketOverview {
  summary?: string;
  major_catalysts?: string[];
}

export interface MomentumSector {
  sector_ranking: number;
  sector: string;
  reason: string;
  risk_factor: string;
  themes: SectorTheme[];
}

export interface SectorTheme {
  key_theme: string;
  stocks: ThemeStock[];
}

export interface ThemeStock {
  ticker: string;
  name: string;
  pre_market_change: string;
  key_news: {
    headline: string;
    source: string;
    summary: string;
  };
  short_term_strategy: string;
}
