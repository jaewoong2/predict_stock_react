import { oxApi } from "./api";
import type { PredictionDirectionStatsResponse, TrendingStock } from "@/types/prediction-trends";

/**
 * 백엔드 API 응답 타입 (snake_case)
 */
interface ApiTrendingStock {
  ticker: string;
  company_name?: string;
  count: number;
  win_rate?: number;
  avg_profit?: number;
  last_price?: number;
  change_percent?: number;
}

interface ApiPredictionDirectionStatsResponse {
  success: boolean;
  data: {
    most_long_predictions: ApiTrendingStock[];
    most_short_predictions: ApiTrendingStock[];
    updated_at: string;
  };
}

/**
 * snake_case를 camelCase로 변환
 */
function mapApiStockToTrendingStock(apiStock: ApiTrendingStock): TrendingStock {
  return {
    ticker: apiStock.ticker,
    companyName: apiStock.company_name,
    count: apiStock.count,
    winRate: apiStock.win_rate,
    avgProfit: apiStock.avg_profit,
    lastPrice: apiStock.last_price,
    changePercent: apiStock.change_percent,
  };
}

export const predictionTrendsService = {
  /**
   * 롱/숏 예측 통계 조회
   * GET /predictions/trends
   */
  getDirectionStats: async (params?: {
    date?: string;
    limit?: number;
  }): Promise<PredictionDirectionStatsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.date) {
      queryParams.append("date", params.date);
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const queryString = queryParams.toString();
    const url = `/predictions/trends${queryString ? `?${queryString}` : ""}`;

    const response = await oxApi.get<ApiPredictionDirectionStatsResponse>(url);

    // snake_case를 camelCase로 변환
    return {
      mostLongPredictions: response.data.data.most_long_predictions.map(
        mapApiStockToTrendingStock
      ),
      mostShortPredictions: response.data.data.most_short_predictions.map(
        mapApiStockToTrendingStock
      ),
      updatedAt: response.data.data.updated_at,
    };
  },
};

