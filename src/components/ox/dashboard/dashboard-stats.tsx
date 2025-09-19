"use client";

import { usePointsBalance } from "@/hooks/usePoints";
import { useTodaySession } from "@/hooks/useSession";
import {
  useRemainingPredictions,
  usePredictionStats,
} from "@/hooks/usePrediction";
import { cn } from "@/lib/utils";

export function DashboardStats() {
  const { data: pointsBalance } = usePointsBalance();
  const { data: session } = useTodaySession();
  const { data: predictionStats } = usePredictionStats();
  const { data: remainingPredictions } = useRemainingPredictions(
    session?.session?.trading_day || new Date().toISOString().split("T")[0],
  );

  const stats = [
    {
      title: "보유 포인트",
      value: pointsBalance?.balance?.toLocaleString() || "0",
      suffix: "P",
      accent: "text-amber-500 dark:text-amber-300",
    },
    {
      title: "정확도",
      value: predictionStats?.accuracy_rate
        ? predictionStats.accuracy_rate.toFixed(1)
        : "0",
      suffix: "%",
      accent: "text-blue-500 dark:text-blue-300",
    },
    {
      title: "남은 기회",
      value: remainingPredictions?.toString() || "0",
      suffix: "회",
      accent: "text-emerald-500 dark:text-emerald-300",
    },
  ];

  const sessionStatus = session?.session?.phase === "OPEN" ? "예측 가능" : "예측 마감";
  const isMarketOpen = session?.session?.phase === "OPEN";

  return (
    <div className="space-y-6">
      {/* 세션 상태 배너 */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-slate-50 p-6 text-sm shadow-none dark:bg-[#151b24]",
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className={cn(
                "h-2.5 w-2.5 rounded-full",
                isMarketOpen ? "bg-emerald-500" : "bg-slate-400"
              )} />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                시장 현황
              </span>
            </div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {sessionStatus}
            </div>
          </div>
          <div className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            isMarketOpen
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
          )}>
            {isMarketOpen ? "LIVE" : "CLOSED"}
          </div>
        </div>
      </div>

      {/* 통계 카드들 */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              "relative flex flex-col justify-between rounded-2xl bg-white p-6 text-sm shadow-none transition-colors dark:bg-[#11131a]",
            )}
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-10 w-0.5 rounded-full bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {stat.title}
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                <span className={cn("font-semibold", stat.accent)}>{stat.value}</span>
                <span className="ml-1 text-base text-slate-400 dark:text-slate-500">
                  {stat.suffix}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
