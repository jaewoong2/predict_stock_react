"use client";

import { useMemo } from "react";
import { useSignalDataByDate } from "@/hooks/useSignal";
import { TrendingPredictionsWidget } from "./TrendingPredictionsWidget";
import type { HighProbabilityStock } from "@/types/prediction-trends";
import type { SignalData } from "@/types/signal";

interface TrendingPredictionsContainerProps {
  date: string;
  limit?: number;
}

/**
 * 시그널 데이터를 가져와서 확률 높은 종목을 추출하는 컨테이너
 */
export function TrendingPredictionsContainer({
  date,
  limit = 5,
}: TrendingPredictionsContainerProps) {
  // 시그널 데이터 가져오기
  const { data: signalApiResponse } = useSignalDataByDate(date, {
    enabled: !!date,
  });

  // 시그널 데이터를 HighProbabilityStock 형식으로 변환
  const highProbabilityStocks = useMemo(() => {
    if (!signalApiResponse?.signals) return [];

    // 확률값이 있는 시그널만 필터링
    const signalsWithProbability = signalApiResponse.signals.filter(
      (item: SignalData) => {
        const probability = item.signal.probability;
        return probability && !isNaN(parseFloat(probability));
      },
    );

    // 티커별로 가장 높은 확률의 시그널만 선택
    const tickerMap = new Map<string, SignalData>();
    signalsWithProbability.forEach((item: SignalData) => {
      const ticker = item.signal.ticker;
      const probability = parseFloat(item.signal.probability || "0");

      const existing = tickerMap.get(ticker);
      if (!existing) {
        tickerMap.set(ticker, item);
      } else {
        const existingProb = parseFloat(existing.signal.probability || "0");
        if (probability > existingProb) {
          tickerMap.set(ticker, item);
        }
      }
    });

    // HighProbabilityStock 형식으로 변환
    const stocks: HighProbabilityStock[] = Array.from(tickerMap.values())
      .map((item: SignalData) => {
        const probability = parseFloat(item.signal.probability || "0");
        const action = item.signal.action?.toUpperCase();
        const direction =
          action === "BUY" || action === "LONG" ? "LONG" : "SHORT";

        // 해당 티커의 모든 예측 수 계산
        const totalPredictions = signalApiResponse.signals.filter(
          (s: SignalData) => s.signal.ticker === item.signal.ticker,
        ).length;

        return {
          ticker: item.signal.ticker,
          companyName: item.ticker?.name || undefined,
          probability: probability,
          direction: direction,
          totalPredictions: totalPredictions,
          lastPrice: item.ticker?.close_price || undefined,
          changePercent:
            item.ticker?.close_price && item.ticker?.open_price
              ? ((item.ticker.close_price - item.ticker.open_price) /
                  item.ticker.open_price) *
                100
              : undefined,
        };
      })
      .filter((stock) => stock.probability > 50) // 50% 이상만
      .sort((a, b) => b.probability - a.probability) // 확률 높은 순
      .slice(0, limit); // TOP N

    return stocks;
  }, [signalApiResponse, limit]);

  return (
    <TrendingPredictionsWidget
      date={date}
      limit={limit}
      highProbability={highProbabilityStocks}
    />
  );
}

