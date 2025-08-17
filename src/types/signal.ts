export interface ChartPattern {
  name: string;
  description: string;
  pattern_type: "bullish" | "bearish" | "neutral";
  confidence_level: number; // Confidence level of the pattern detection (0.0 to 1.0)
}

export interface Signal {
  ticker: string;
  strategy?: string | null;
  entry_price?: number | null;
  stop_loss?: number | null;
  take_profit?: number | null;
  close_price?: number | null;
  action?: string | null;
  timestamp?: string | null;
  probability?: string | null;
  result_description?: string | null;
  report_summary?: string | null;
  ai_model?: string | null;
  senario?: string | null;
  good_things?: string | null;
  bad_things?: string | null;
  chart_pattern?: ChartPattern | null;
  favorite?: number | null;
}

export interface SignalTickerInfo {
  symbol: string;
  name?: string | null;
  price?: number | null;
  open_price?: number | null;
  high_price?: number | null;
  low_price?: number | null;
  close_price?: number | null;
  volume?: number | null;
  ticker_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SignalResult {
  action: "up" | "down" | "unchanged" | "unknown";
  is_correct: boolean;
  price_diff: number;
}

export interface SignalData {
  signal: Signal;
  ticker?: SignalTickerInfo | null;
  result?: SignalResult | null;
}

export interface SignalAPIResponse {
  signals: SignalData[];
}

// 주간 액션 카운트 타입
export interface WeeklyActionCount {
  ticker: string;
  count: number[];
  date: string[];
}

export interface WeeklyActionCountResponse {
  signals: WeeklyActionCount[];
}

export interface GetWeeklyActionCountParams {
  tickers?: string;
  reference_date?: string;
  action: "Buy" | "Sell";

  order_by?: "counts" | null;
  limit?: number | null;
}

// 전략 타입 정의
export type StrategyType =
  | "PULLBACK"
  | "OVERSOLD"
  | "MACD_LONG"
  | "GAPPER"
  | "VOL_DRY_BOUNCE"
  | "GOLDEN_CROSS"
  | "MEAN_REVERSION"
  | "BREAKOUT"
  | "GAP_UP"
  | "VWAP_BOUNCE"
  | "MOMENTUM_SURGE"
  | "VOLUME_SPIKE"
  | "TREND_UP"
  | "TREND_DOWN"
  | "DONCHIAN_BREAKOUT"
  | "VOLUME_EXPANSION"
  | "QUIET_PULLBACK"
  | "VOLATILITY_COMPRESSION"
  | "VCP_DAILY"
  | "RS_SHORT"
  | "RS_MID"
  | "SUPERTREND_BUY"
  | "SUPERTREND_SELL";

// 전략 옵션 인터페이스
export interface StrategyOption {
  value: StrategyType;
  label: string;
  description: string;
}

// 전략 옵션 데이터
export const STRATEGY_OPTIONS: StrategyOption[] = [
  {
    value: "PULLBACK",
    label: "풀백 전략",
    description:
      "주가가 단기 이동평균선(10일 SMA)에 근접하거나 약간 하락한 후 장기 이동평균선(50일 SMA) 위에서 반등 가능성 포착. (상승 추세에서 일시적 조정을 매수 기회)",
  },
  {
    value: "OVERSOLD",
    label: "과매도 전략",
    description:
      "주가가 과매도 상태(RSI < 40)이고 볼린저 밴드 하단 아래로 떨어지며 스토캐스틱 %K < 30일 때 반등 가능성 포착. (과도한 매도로 저평가된 종목)",
  },
  {
    value: "MACD_LONG",
    label: "MACD 롱 전략",
    description:
      "MACD 히스토그램이 음수에서 양수로 전환되고 MACD 라인이 시그널 라인을 상향 돌파할 때 상승 추세 전환 가능성 포착. (단기 모멘텀 강화)",
  },
  {
    value: "GAPPER",
    label: "갭상승 전략",
    description:
      "전일 대비 갭 상승(2% 이상) 후 거래량 증가를 동반한 지속적 상승 가능성 포착. (갭업 후 추가 상승 모멘텀)",
  },
  {
    value: "VOL_DRY_BOUNCE",
    label: "볼륨 드라이 바운스",
    description:
      "거래량이 낮은 'Dry-Up' 구간(최근 10일) 후 주가가 단기 이동평균선(5일 SMA)을 돌파하며 반등 가능성 포착. (저유동성 후 돌파를 활용)",
  },
  {
    value: "GOLDEN_CROSS",
    label: "골든 크로스",
    description:
      "단기 이동평균선(50일 SMA)이 장기 이동평균선(200일 SMA)을 상향 돌파하고 거래량이 증가할 때 강한 상승 추세의 시작 가능성 포착. (장기 투자)",
  },
  {
    value: "MEAN_REVERSION",
    label: "평균 회귀 전략",
    description:
      "주가가 평균(20일 SMA)에서 크게 벗어났다가 다시 복귀할 때 반전 기회를 포착 가능성. (단기 변동성을 활용한 평균 회귀)",
  },
  {
    value: "BREAKOUT",
    label: "브레이크아웃 전략",
    description:
      "주가가 최근 52주 최고가를 돌파하고 RSI < 70으로 과매수가 아닐 때 강한 상승 모멘텀 포착 가능성. (새로운 고점 돌파로 추가 상승)",
  },
  {
    value: "GAP_UP",
    label: "갭업 전략",
    description:
      "전일 대비 2% 이상 갭 상승하고 거래량이 평균보다 50% 이상 증가할 때 단기 상승 모멘텀 포착. (갭업과 거래량 증가의 조합)",
  },
  {
    value: "VWAP_BOUNCE",
    label: "VWAP 바운스",
    description:
      "주가가 VWAP(거래량 가중 평균가) 근처에서 반등할 때 단기 매수 기회 포착. (기관 매수 평균가 지지선 활용)",
  },
  {
    value: "MOMENTUM_SURGE",
    label: "모멘텀 서지",
    description:
      "최근 5일간 가격이 3% 이상 변동하고 거래량이 50% 이상 급증할 때 강한 모멘텀 포착. (급격한 가격/거래량 변화)",
  },
  {
    value: "VOLUME_SPIKE",
    label: "볼륨 스파이크",
    description:
      "거래량이 20일 평균의 2배 이상 증가하고 RSI < 50이며 가격이 1% 이상 상승할 때 매수 기회 포착. (거래량 급증과 가격 상승)",
  },
  {
    value: "TREND_UP",
    label: "상승 추세",
    description:
      "ADX > 25, +DI > -DI, 슈퍼트렌드 상승, 종가 > SMA50 > SMA200, SMA50 기울기 > 0일 때 강한 상승 추세 포착. (다중 지표 상승 확인)",
  },
  {
    value: "TREND_DOWN",
    label: "하락 추세",
    description:
      "ADX > 25, -DI > +DI, 슈퍼트렌드 하락, 종가 < SMA50 < SMA200, SMA50 기울기 < 0일 때 강한 하락 추세 포착. (다중 지표 하락 확인)",
  },
  {
    value: "DONCHIAN_BREAKOUT",
    label: "돈치안 브레이크아웃",
    description:
      "20일 돈치안 채널 상단을 돌파하고 ADX > 20, 거래량 증가할 때 브레이크아웃 포착. (채널 상단 돌파 전략)",
  },
  {
    value: "VOLUME_EXPANSION",
    label: "볼륨 확장",
    description:
      "거래량이 20일 평균의 1.5배 이상 증가하고 일일 수익률이 2% 이상일 때 거래량 확장 포착. (거래량과 가격 동반 상승)",
  },
  {
    value: "QUIET_PULLBACK",
    label: "조용한 풀백",
    description:
      "주가가 10일 SMA 근처(±1%)에서 조정받고 ATR 비율 < 0.7로 변동성이 낮을 때 조용한 조정 포착. (낮은 변동성 중 조정)",
  },
  {
    value: "VOLATILITY_COMPRESSION",
    label: "변동성 압축",
    description:
      "볼린저 밴드 폭이 최근 6개월 최저 수준일 때 변동성 압축 포착. (낮은 변동성 후 큰 움직임 예상)",
  },
  {
    value: "VCP_DAILY",
    label: "VCP 일일",
    description:
      "SMA50 > SMA150 > SMA200 상승 구조에서 최근 변동성 수축(5일 폭 < 20일 폭의 75%)과 거래량 감소 패턴 포착. (VCP 패턴)",
  },
  {
    value: "RS_SHORT",
    label: "단기 상대강도",
    description:
      "최근 20일간 S&P 500 대비 상대강도가 양수일 때 단기 상대강도 우위 포착. (시장 대비 아웃퍼폼)",
  },
  {
    value: "RS_MID",
    label: "중기 상대강도",
    description:
      "최근 60일간 S&P 500 대비 상대강도가 양수일 때 중기 상대강도 우위 포착. (시장 대비 지속적 아웃퍼폼)",
  },
  {
    value: "SUPERTREND_BUY",
    label: "슈퍼트렌드 매수",
    description:
      "슈퍼트렌드 지표가 하락에서 상승 추세로 전환(추세 변화 +2)할 때 매수 신호 발생. (ATR 기반 추세 추종 지표)",
  },
  {
    value: "SUPERTREND_SELL",
    label: "슈퍼트렌드 매도",
    description:
      "슈퍼트렌드 지표가 상승에서 하락 추세로 전환(추세 변화 -2)할 때 매도 신호 발생. (ATR 기반 추세 추종 지표)",
  },
];
