/**
 * 예측 트렌드 관련 타입 정의
 */

/**
 * 롱/숏 예측이 많은 종목
 * API: GET /api/ox/predictions/direction-stats
 */
export interface TrendingStock {
  ticker: string;
  companyName?: string;
  count: number;
  winRate?: number; // 승률 (0-100)
  avgProfit?: number; // 평균 수익률
  lastPrice?: number; // 최신 가격
  changePercent?: number; // 변동률
}

/**
 * 확률 높은 종목
 * 참고: 별도의 기존 API 사용 (이 타입은 참고용)
 */
export interface HighProbabilityStock {
  ticker: string;
  companyName?: string;
  probability: number; // 확률 (0-100)
  direction: "LONG" | "SHORT"; // 예측 방향
  totalPredictions: number;
  lastPrice?: number;
  changePercent?: number;
}

/**
 * 롱/숏 예측 통계 응답
 * API: GET /api/ox/predictions/direction-stats
 */
export interface PredictionDirectionStatsResponse {
  // 롱 예측이 가장 많은 종목 top N
  mostLongPredictions: TrendingStock[];

  // 숏 예측이 가장 많은 종목 top N
  mostShortPredictions: TrendingStock[];

  // 업데이트 시간
  updatedAt: string;
}

/**
 * @deprecated 전체 트렌드 응답 (API 분리로 인해 사용하지 않음)
 * - highProbability: 별도 API 사용
 * - mostLongPredictions, mostShortPredictions: PredictionDirectionStatsResponse 사용
 */
export interface PredictionTrendsResponse {
  // 현재 확률이 높은 종목 top 5 (별도 API)
  highProbability: HighProbabilityStock[];

  // 롱 예측이 가장 많은 종목 top 5
  mostLongPredictions: TrendingStock[];

  // 숏 예측이 가장 많은 종목 top 5
  mostShortPredictions: TrendingStock[];

  // 업데이트 시간
  updatedAt: string;
}
