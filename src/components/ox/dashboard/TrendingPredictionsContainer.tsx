"use client";

import { TrendingPredictionsWidget } from "./TrendingPredictionsWidget";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";

interface TrendingPredictionsContainerProps {
  limit?: number;
}

/**
 * 예측 트렌드 컨테이너 - searchParams에서 날짜 관리
 */
export function TrendingPredictionsContainer({
  limit = 5,
}: TrendingPredictionsContainerProps) {
  const { submittedDate } = useDashboardFilters();

  return (
    <TrendingPredictionsWidget
      date={submittedDate}
      limit={limit}
    />
  );
}

