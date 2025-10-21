"use client";

import { Suspense } from "react";
import { DashboardStats } from "@/components/ox/dashboard/dashboard-stats";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { OxNewsSection } from "@/components/ox/dashboard/news/OxNewsSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CompactMarketChanges } from "@/components/ox/dashboard/market/CompactMarketChanges";
import { TrendingPredictionsContainer } from "@/components/ox/dashboard/TrendingPredictionsContainer";

const panelClassName = "rounded-3xl bg-white shadow-none dark:bg-[#0f1118]";

function StatsSkeleton() {
  return (
    <Card className={panelClassName}>
      <CardContent className="px-6 sm:px-8">
        <div className="space-y-6">
          <div className="animate-pulse rounded-2xl bg-slate-50 p-6 dark:bg-[#151b24]">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="mb-3 h-3 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-white p-6 dark:bg-[#11131a]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NewsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-96 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}

function PredictionsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:flex-1" />
        <Skeleton className="h-10 w-full sm:w-32" />
      </div>

      <div className="rounded-2xl bg-white p-4 dark:bg-[#0f1118]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4" />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 dark:bg-[#0f1118]">
            <div className="grid grid-cols-2 items-center gap-4 md:grid-cols-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketChangeSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-none dark:bg-[#0f1118]">
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-slate-50 p-4 dark:bg-[#11131a]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-40" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}

export function DashboardPageClient() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-[#090b11]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-8 pb-16 sm:px-6 lg:px-10">
        <header className="space-y-4">
          <Badge className="w-fit rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:bg-[#151b24] dark:text-slate-300">
            오늘의 인사이트
          </Badge>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                오늘 예측
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                오늘 미국 주식의 방향을 예측을 해봐요
              </p>
            </div>
          </div>
        </header>

        <Suspense fallback={<StatsSkeleton />}>
          <Card className={panelClassName}>
            <CardContent className="px-0">
              <DashboardStats />
            </CardContent>
          </Card>
        </Suspense>

        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              오늘 예측 트렌드
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              다른 유저들은 어디에 예측을 했을까요?
            </p>
          </div>
          <Card className={panelClassName}>
            <CardContent className="px-0 py-0">
              <Suspense fallback={<TrendingSkeleton />}>
                <TrendingPredictionsContainer limit={5} />
              </Suspense>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              시장 뉴스 & 전망
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              오늘의 주요 뉴스와 전문가 시장 전망을 확인하세요.
            </p>
          </div>
          <Suspense fallback={<NewsSkeleton />}>
            <OxNewsSection />
          </Suspense>
        </section>

        <Card className={panelClassName}>
          <CardHeader className="px-0">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              투자 신호
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              AI 분석 기반 실시간 투자 기회를 확인하세요.
            </p>
          </CardHeader>
          <CardContent className="px-0">
            <Suspense fallback={<PredictionsSkeleton />}>
              <DashboardClient />
            </Suspense>
          </CardContent>
        </Card>

        <Suspense fallback={<MarketChangeSkeleton />}>
          <CompactMarketChanges />
        </Suspense>
      </div>
    </div>
  );
}
