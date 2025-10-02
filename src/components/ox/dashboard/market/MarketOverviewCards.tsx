"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketBreadth } from "@/hooks/useMarketData";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface MarketOverviewCardsProps {
  targetDate?: string;
}

export function MarketOverviewCards({ targetDate }: MarketOverviewCardsProps) {
  const { data, isLoading, error } = useMarketBreadth({
    target_date: targetDate,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="rounded-3xl bg-white shadow-none dark:bg-[#0f1118]"
          >
            <CardContent className="p-6">
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-10 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-red-50 p-6 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
        시장 개요를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  const latestData = data?.series[data.series.length - 1];
  const advanceDeclineRatio = latestData
    ? ((latestData.advancers || 0) / (latestData.decliners || 1)).toFixed(2)
    : "0.00";
  const newHighsLows = latestData
    ? (latestData.new_highs || 0) - (latestData.new_lows || 0)
    : 0;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* VIX Card */}
      <Card className="rounded-3xl bg-white shadow-none dark:bg-[#0f1118]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                VIX
              </p>
              <p
                className={`text-3xl font-bold ${
                  (latestData?.vix || 0) < 15
                    ? "text-green-600 dark:text-green-400"
                    : (latestData?.vix || 0) > 20
                      ? "text-red-600 dark:text-red-400"
                      : "text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {latestData?.vix?.toFixed(2) || "N/A"}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {(latestData?.vix || 0) < 15
                  ? "낮은 변동성"
                  : (latestData?.vix || 0) > 20
                    ? "높은 변동성"
                    : "보통"}
              </p>
            </div>
            <div className="rounded-full bg-slate-100 p-3 dark:bg-[#151b24]">
              <Activity className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advance/Decline Ratio */}
      <Card className="rounded-3xl bg-white shadow-none dark:bg-[#0f1118]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                상승/하락 비율
              </p>
              <p
                className={`text-3xl font-bold ${
                  parseFloat(advanceDeclineRatio) > 1
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {advanceDeclineRatio}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                상승 {latestData?.advancers || 0} / 하락{" "}
                {latestData?.decliners || 0}
              </p>
            </div>
            <div className="rounded-full bg-slate-100 p-3 dark:bg-[#151b24]">
              {parseFloat(advanceDeclineRatio) > 1 ? (
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Highs vs Lows */}
      <Card className="rounded-3xl bg-white shadow-none dark:bg-[#0f1118]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                신고가 - 신저가
              </p>
              <p
                className={`text-3xl font-bold ${
                  newHighsLows > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {newHighsLows > 0 ? "+" : ""}
                {newHighsLows}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                신고가 {latestData?.new_highs || 0} / 신저가{" "}
                {latestData?.new_lows || 0}
              </p>
            </div>
            <div className="rounded-full bg-slate-100 p-3 dark:bg-[#151b24]">
              {newHighsLows > 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
