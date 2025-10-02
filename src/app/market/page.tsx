import { Suspense } from "react";
import type { Metadata } from "next";
import {
  MarketDataDashboard,
  MarketDataDashboardSkeleton,
} from "@/components/ox/dashboard/market/MarketDataDashboard";

export const metadata: Metadata = {
  title: "마켓 데이터 대시보드 | 주식 시장 분석",
  description:
    "애널리스트 목표가, ETF 자금 흐름, 시장 지표를 실시간으로 모니터링하세요.",
};

export default function MarketDataPage() {
  return (
    <Suspense fallback={<MarketDataDashboardSkeleton />}>
      <MarketDataDashboard />
    </Suspense>
  );
}
