"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalystPriceTargetsWidget } from "./AnalystPriceTargetsWidget";
import { ETFFlowsWidget } from "./ETFFlowsWidget";
import { LiquidityWidget } from "./LiquidityWidget";
import { MarketBreadthWidget } from "./MarketBreadthWidget";
import { InsiderTrendsWidget } from "./InsiderTrendsWidget";
import { MarketOverviewCards } from "./MarketOverviewCards";

const panelClassName = "rounded-3xl bg-white shadow-none dark:bg-[#0f1118]";

export function MarketDataDashboard() {
  const [selectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#090b11]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-8 pb-16 sm:px-6 lg:px-10">
        {/* Header */}
        <header className="space-y-4">
          <Badge className="w-fit rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:bg-[#151b24] dark:text-slate-300">
            마켓 데이터 대시보드
          </Badge>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                시장 분석 대시보드
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                애널리스트 목표가, ETF 자금 흐름, 시장 지표를 실시간으로
                모니터링하세요.
              </p>
            </div>
          </div>
        </header>

        {/* Market Overview Cards */}
        <MarketOverviewCards targetDate={selectedDate} />

        {/* Analyst Price Targets */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              🎯 애널리스트 목표가
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              주요 증권사의 목표가 변경 사항을 확인하세요.
            </p>
          </div>
          <Card className={panelClassName}>
            <CardContent className="px-6 py-6">
              <AnalystPriceTargetsWidget targetDate={selectedDate} />
            </CardContent>
          </Card>
        </section>

        {/* ETF Flows */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              💰 ETF 자금 흐름
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              ETF별 자금 유입/유출 현황을 파악하세요.
            </p>
          </div>
          <Card className={panelClassName}>
            <CardContent className="px-6 py-6">
              <ETFFlowsWidget targetDate={selectedDate} />
            </CardContent>
          </Card>
        </section>

        {/* Liquidity & Market Breadth */}
        <div className="grid gap-6 md:grid-cols-2">
          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                💧 유동성 지표
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                M2 통화량과 RRP 잔액 추이
              </p>
            </div>
            <Card className={panelClassName}>
              <CardContent className="px-6 py-6">
                <LiquidityWidget targetDate={selectedDate} />
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                📊 시장 폭 지표
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                VIX, 상승/하락 종목 수
              </p>
            </div>
            <Card className={panelClassName}>
              <CardContent className="px-6 py-6">
                <MarketBreadthWidget targetDate={selectedDate} />
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Insider Trends */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              👔 내부자 거래 트렌드
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              임원 및 내부자들의 주식 거래 동향을 확인하세요.
            </p>
          </div>
          <Card className={panelClassName}>
            <CardContent className="px-6 py-6">
              <InsiderTrendsWidget targetDate={selectedDate} />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

export function MarketDataDashboardSkeleton() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-[#090b11]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-8 pb-16 sm:px-6 lg:px-10">
        <header className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </header>

        {/* Overview Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className={panelClassName}>
              <CardContent className="p-6">
                <Skeleton className="mb-4 h-6 w-32" />
                <Skeleton className="h-12 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Widget Skeletons */}
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className={panelClassName}>
            <CardContent className="p-6">
              <Skeleton className="mb-6 h-8 w-48" />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
