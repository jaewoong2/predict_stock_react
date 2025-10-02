"use client";

import { useState } from "react";
import { useInsiderTrends } from "@/hooks/useMarketData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, TrendingDown, ExternalLink } from "lucide-react";
import type { InsiderAction } from "@/types/market-data";

interface InsiderTrendsWidgetProps {
  targetDate?: string;
}

export function InsiderTrendsWidget({ targetDate }: InsiderTrendsWidgetProps) {
  const [actionFilter, setActionFilter] = useState<InsiderAction | "ALL">(
    "ALL",
  );
  const [limit, setLimit] = useState(20);

  const { data, isLoading, error } = useInsiderTrends({
    target_date: targetDate,
    action: actionFilter === "ALL" ? undefined : actionFilter,
    limit,
    sort_by: "value",
    sort_order: "desc",
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
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
          해당 날짜의 내부자 거래 데이터가 없습니다.
        </p>
      </div>
    );
  }

  const formatValue = (value: number) => {
    if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getActionBadge = (action: InsiderAction) => {
    if (action === "BUY") {
      return (
        <Badge className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-950 dark:text-green-400">
          매수
        </Badge>
      );
    }
    return (
      <Badge className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-950 dark:text-red-400">
        매도
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={actionFilter}
          onValueChange={(value) =>
            setActionFilter(value as InsiderAction | "ALL")
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체</SelectItem>
            <SelectItem value="BUY">매수</SelectItem>
            <SelectItem value="SELL">매도</SelectItem>
          </SelectContent>
        </Select>

        {!data.is_exact_date_match && (
          <Badge variant="outline" className="text-xs">
            {data.actual_date} 데이터
          </Badge>
        )}

        <div className="ml-auto text-xs text-slate-600 dark:text-slate-400">
          {data.filtered_count}개 표시 / 전체 {data.total_count}개
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {data.items.map((item, index) => {
          const isBuy = item.action === "BUY";
          const isLargeTransaction = item.value >= 10000000; // $10M+

          return (
            <div
              key={index}
              className={`rounded-2xl border p-4 transition-all hover:shadow-md ${
                isLargeTransaction
                  ? "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/20"
                  : "border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-[#11131a]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {isBuy ? (
                      <div className="rounded-full bg-green-100 p-2 dark:bg-green-950">
                        <ShoppingCart className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-red-100 p-2 dark:bg-red-950">
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                        {item.ticker}
                      </span>
                      {getActionBadge(item.action)}
                      {isLargeTransaction && (
                        <Badge className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-white">
                          대규모
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {item.insider_name}
                        </span>
                        <span className="mx-2 text-slate-400">·</span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {item.insider_title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                        <span>
                          {item.shares.toLocaleString()} 주 @ $
                          {item.price.toFixed(2)}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-50">
                          {formatValue(item.value)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        거래일: {item.date} | 신고일: {item.filing_date}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {item.transaction_type}
                      </div>
                    </div>
                    {item.source_details.length > 0 && (
                      <a
                        href={item.source_details[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                      >
                        <ExternalLink className="h-3 w-3" />
                        SEC 서류 보기
                      </a>
                    )}
                  </div>
                </div>
                {/* Sentiment Score */}
                <div className="text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    신뢰도
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      item.sentiment_score >= 7
                        ? "text-green-600 dark:text-green-400"
                        : item.sentiment_score >= 4
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {item.sentiment_score.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
