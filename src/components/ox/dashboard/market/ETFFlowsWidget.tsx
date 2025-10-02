"use client";

import { useState } from "react";
import { useETFFlows } from "@/hooks/useMarketData";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ETFFlowsWidgetProps {
  targetDate?: string;
}

export function ETFFlowsWidget({ targetDate }: ETFFlowsWidgetProps) {
  const [sectorOnly, setSectorOnly] = useState(false);

  const { data, isLoading, error } = useETFFlows({
    target_date: targetDate,
    sector_only: sectorOnly,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-50 p-12 text-center dark:bg-[#11131a]">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          해당 날짜의 ETF 자금 흐름 데이터가 없습니다.
        </p>
      </div>
    );
  }

  // Sort by absolute net flow
  const sortedItems = [...data.items].sort(
    (a, b) => Math.abs(b.net_flow) - Math.abs(a.net_flow),
  );

  const maxAbsFlow = Math.max(
    ...sortedItems.map((item) => Math.abs(item.net_flow)),
  );

  const formatFlow = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (absValue >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={!sectorOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setSectorOnly(false)}
          >
            전체
          </Button>
          <Button
            variant={sectorOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setSectorOnly(true)}
          >
            섹터 ETF만
          </Button>
        </div>
        {!data.is_exact_date_match && (
          <Badge variant="outline" className="text-xs">
            {data.actual_date} 데이터
          </Badge>
        )}
      </div>

      {/* Flow Chart */}
      <div className="space-y-3">
        {sortedItems.slice(0, 15).map((item, index) => {
          const flowPercentage = (Math.abs(item.net_flow) / maxAbsFlow) * 100;
          const isPositive = item.net_flow > 0;

          return (
            <div
              key={index}
              className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-[#0f1118]"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900 dark:text-slate-50">
                    {item.ticker}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-base font-semibold ${
                      isPositive
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatFlow(item.net_flow)}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full transition-all ${
                    isPositive
                      ? "bg-gradient-to-r from-green-400 to-green-600"
                      : "bg-gradient-to-r from-red-400 to-red-600"
                  }`}
                  style={{ width: `${flowPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <span>섹터: {item.sector}</span>
                  {item.volume_change !== null && (
                    <span
                      className={
                        item.volume_change > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      거래량 {item.volume_change > 0 ? "+" : ""}
                      {item.volume_change.toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {item.themes.slice(0, 3).map((theme, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="px-1.5 py-0 text-[10px]"
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>

              {item.evidence && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {item.evidence}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-slate-600 dark:text-slate-400">
        {data.filtered_count}개 중 상위 15개 표시
      </div>
    </div>
  );
}
