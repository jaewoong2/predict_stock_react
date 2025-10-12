"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TickerAvatar } from "@/components/atomic/atoms/TickerAvatar";
import { TrendingUp, TrendingDown, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePredictionDirectionStats } from "@/hooks/usePredictionTrends";
import type { TrendingStock } from "@/types/prediction-trends";
import { useDateRangeError } from "@/hooks/useDateRangeError";

interface TrendingPredictionsWidgetProps {
  date?: string; // 조회할 날짜 (기본: 오늘)
  limit?: number; // 각 카테고리별 최대 종목 수 (기본: 5)
}

type TabType = "long" | "short";

export function TrendingPredictionsWidget({
  date,
  limit = 5,
}: TrendingPredictionsWidgetProps) {
  const [activeTab, setActiveTab] = useState<TabType>("long");

  const { data, isLoading, error } = usePredictionDirectionStats({
    date,
    limit,
  });

  const { ErrorModal } = useDateRangeError({ error });

  const mostLongPredictions = data?.mostLongPredictions || [];
  const mostShortPredictions = data?.mostShortPredictions || [];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab("long")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
            activeTab === "long"
              ? "bg-emerald-600 text-white dark:bg-emerald-500"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#151b24] dark:text-slate-300 dark:hover:bg-[#1a2030]",
          )}
        >
          <TrendingUp className="h-4 w-4" />
          <span>상승 예측 많은 종목</span>
          <Badge
            variant="secondary"
            className={cn(
              "ml-1",
              activeTab === "long"
                ? "bg-emerald-700 text-white dark:bg-emerald-600"
                : "bg-slate-200 dark:bg-[#1a2030]",
            )}
          >
            {mostLongPredictions.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("short")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
            activeTab === "short"
              ? "bg-rose-600 text-white dark:bg-rose-500"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#151b24] dark:text-slate-300 dark:hover:bg-[#1a2030]",
          )}
        >
          <TrendingDown className="h-4 w-4" />
          <span>하락 예측 많은 종목</span>
          <Badge
            variant="secondary"
            className={cn(
              "ml-1",
              activeTab === "short"
                ? "bg-rose-700 text-white dark:bg-rose-600"
                : "bg-slate-200 dark:bg-[#1a2030]",
            )}
          >
            {mostShortPredictions.length}
          </Badge>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === "long" && (
          <>
            {mostLongPredictions.length === 0 ? (
              <EmptyState type="long" />
            ) : (
              mostLongPredictions.map((stock, index) => (
                <TrendingStockCard
                  key={stock.ticker}
                  stock={stock}
                  rank={index + 1}
                  type="long"
                />
              ))
            )}
          </>
        )}

        {activeTab === "short" && (
          <>
            {mostShortPredictions.length === 0 ? (
              <EmptyState type="short" />
            ) : (
              mostShortPredictions.map((stock, index) => (
                <TrendingStockCard
                  key={stock.ticker}
                  stock={stock}
                  rank={index + 1}
                  type="short"
                />
              ))
            )}
          </>
        )}
      </div>

      <ErrorModal />
    </div>
  );
}

function EmptyState({ type }: { type: "long" | "short" }) {
  return (
    <Card className="rounded-2xl border-0 bg-white p-12 dark:bg-[#0f1118]">
      <div className="flex flex-col items-center justify-center text-center">
        <div
          className={cn(
            "mb-4 rounded-full p-4",
            type === "long"
              ? "bg-emerald-50 dark:bg-emerald-950/30"
              : "bg-rose-50 dark:bg-rose-950/30",
          )}
        >
          <Inbox
            className={cn(
              "h-8 w-8",
              type === "long"
                ? "text-emerald-400 dark:text-emerald-500"
                : "text-rose-400 dark:text-rose-500",
            )}
          />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {type === "long"
            ? "참여한 사용자가 없습니다"
            : "참여한 사용자가 없습니다"}
        </p>
      </div>
    </Card>
  );
}

function TrendingStockCard({
  stock,
  rank,
  type,
}: {
  stock: TrendingStock;
  rank: number;
  type: "long" | "short";
}) {
  return (
    <Card className="group cursor-pointer rounded-2xl border-0 bg-white p-4 transition-all hover:shadow-lg dark:bg-[#0f1118] dark:hover:bg-[#151b24]">
      <div className="flex items-center justify-between">
        {/* Left: Rank + Stock Info */}
        <div className="flex items-center gap-4">
          {/* Rank Badge */}
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
              rank === 1
                ? "bg-amber-400 text-amber-900"
                : rank === 2
                  ? "bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-100"
                  : rank === 3
                    ? "bg-amber-600 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-[#1a2030] dark:text-slate-300",
            )}
          >
            {rank}
          </div>

          {/* Stock Avatar + Info */}
          <div className="flex items-center gap-3">
            <TickerAvatar symbol={stock.ticker} size={32} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
                  {stock.ticker}
                </span>
              </div>
              {stock.companyName && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stock.companyName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-6">
          {/* Prediction Count */}
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {type === "long" ? "롱 예측" : "숏 예측"}
            </p>
            <p
              className={cn(
                "text-lg font-bold",
                type === "long"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400",
              )}
            >
              {stock.count.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs Skeleton */}
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 w-40 animate-pulse rounded-xl bg-slate-200 dark:bg-[#151b24]"
          />
        ))}
      </div>

      {/* Cards Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-[#0f1118]"
          />
        ))}
      </div>
    </div>
  );
}
