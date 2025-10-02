import api from "./api";
import {
  AnalystPriceTargetsParams,
  AnalystPriceTargetsResponse,
  ETFFlowsParams,
  ETFFlowsResponse,
  ETFPortfolioParams,
  ETFPortfolioResponse,
  InsiderTrendsParams,
  InsiderTrendsResponse,
  LiquidityParams,
  LiquidityResponse,
  MarketBreadthParams,
  MarketBreadthResponse,
} from "@/types/market-data";

class MarketDataService {
  /**
   * 애널리스트 목표가 조회
   */
  async getAnalystPriceTargets(
    params: AnalystPriceTargetsParams = {},
  ): Promise<AnalystPriceTargetsResponse> {
    const searchParams: Record<string, string> = {};

    if (params.target_date) {
      searchParams.target_date = params.target_date;
    }
    if (params.tickers?.length) {
      searchParams.tickers = params.tickers.join(",");
    }
    if (params.action) {
      searchParams.action = params.action;
    }
    if (params.limit) {
      searchParams.limit = params.limit.toString();
    }
    if (params.sort_by) {
      searchParams.sort_by = params.sort_by;
    }
    if (params.sort_order) {
      searchParams.sort_order = params.sort_order;
    }

    const response = await api.get<AnalystPriceTargetsResponse>(
      "/news/analyst-price-targets",
      { params: searchParams },
    );

    return response.data;
  }

  /**
   * ETF 자금 흐름 조회
   */
  async getETFFlows(params: ETFFlowsParams = {}): Promise<ETFFlowsResponse> {
    const searchParams: Record<string, string> = {};

    if (params.target_date) {
      searchParams.target_date = params.target_date;
    }
    if (params.provider) {
      searchParams.provider = params.provider;
    }
    if (params.sector_only !== undefined) {
      searchParams.sector_only = params.sector_only.toString();
    }
    if (params.tickers?.length) {
      searchParams.tickers = params.tickers.join(",");
    }

    const response = await api.get<ETFFlowsResponse>("/news/etf/flows", {
      params: searchParams,
    });

    return response.data;
  }

  /**
   * 유동성 지표 조회
   */
  async getLiquidity(params: LiquidityParams = {}): Promise<LiquidityResponse> {
    const searchParams: Record<string, string> = {};

    if (params.target_date) {
      searchParams.target_date = params.target_date;
    }

    const response = await api.get<LiquidityResponse>("/news/liquidity", {
      params: searchParams,
    });

    return response.data;
  }

  /**
   * 시장 폭 지표 조회
   */
  async getMarketBreadth(
    params: MarketBreadthParams = {},
  ): Promise<MarketBreadthResponse> {
    const searchParams: Record<string, string> = {};

    if (params.target_date) {
      searchParams.target_date = params.target_date;
    }

    const response = await api.get<MarketBreadthResponse>(
      "/news/market-breadth",
      {
        params: searchParams,
      },
    );

    return response.data;
  }

  /**
   * 내부자 거래 트렌드 조회
   */
  async getInsiderTrends(
    params: InsiderTrendsParams = {},
  ): Promise<InsiderTrendsResponse> {
    const searchParams: Record<string, string> = {};

    if (params.target_date) {
      searchParams.target_date = params.target_date;
    }
    if (params.tickers?.length) {
      searchParams.tickers = params.tickers.join(",");
    }
    if (params.action) {
      searchParams.action = params.action;
    }
    if (params.limit) {
      searchParams.limit = params.limit.toString();
    }
    if (params.sort_by) {
      searchParams.sort_by = params.sort_by;
    }
    if (params.sort_order) {
      searchParams.sort_order = params.sort_order;
    }

    const response = await api.get<InsiderTrendsResponse>(
      "/news/insider-trend",
      {
        params: searchParams,
      },
    );

    return response.data;
  }

  /**
   * ETF 포트폴리오 변동 조회
   */
  async getETFPortfolio(
    params: ETFPortfolioParams = {},
  ): Promise<ETFPortfolioResponse> {
    const searchParams: Record<string, string> = {};

    if (params.target_date) {
      searchParams.target_date = params.target_date;
    }
    if (params.etf_tickers?.length) {
      searchParams.etf_tickers = params.etf_tickers.join(",");
    }

    const response = await api.get<ETFPortfolioResponse>(
      "/news/etf/portfolio",
      {
        params: searchParams,
      },
    );

    return response.data;
  }
}

export const marketDataService = new MarketDataService();
