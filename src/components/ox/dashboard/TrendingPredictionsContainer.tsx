"use client";

import { TrendingPredictionsWidget } from "./TrendingPredictionsWidget";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";

interface TrendingPredictionsContainerProps {
  limit?: number;
}

/**
 * 예측 트렌드 컨테이너 - searchParams에서 날짜 관리
 */
export function TrendingPredictionsContainer({
  limit = 5,
}: TrendingPredictionsContainerProps) {
  const { date } = useSignalSearchParams();

  return (
    <TrendingPredictionsWidget
      date={date || undefined}
      limit={limit}
    />
  );
}

