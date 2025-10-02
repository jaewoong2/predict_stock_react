"use client";

import { useState } from "react";
import { useAnalystPriceTargets } from "@/hooks/useMarketData";
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
import { ArrowUp, ArrowDown, Plus, Minus, ExternalLink } from "lucide-react";
import type { AnalystAction } from "@/types/market-data";

interface AnalystPriceTargetsWidgetProps {
  targetDate?: string;
}

export function AnalystPriceTargetsWidget({
  targetDate,
}: AnalystPriceTargetsWidgetProps) {
  const [actionFilter, setActionFilter] = useState<AnalystAction | "ALL">(
    "ALL",
  );
  const [limit, setLimit] = useState(20);

  const { data, isLoading, error } = useAnalystPriceTargets({
    target_date: targetDate,
    action: actionFilter === "ALL" ? undefined : actionFilter,
    limit,
    sort_by: "impact",
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
          해당 날짜의 애널리스트 목표가 데이터가 없습니다.
        </p>
      </div>
    );
  }

  const getActionBadge = (action: AnalystAction) => {
    const config = {
      UP: {
        label: "상향",
        color:
          "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
      },
      DOWN: {
        label: "하향",
        color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
      },
      INIT: {
        label: "신규",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
      },
      DROP: {
        label: "취소",
        color: "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400",
      },
    };
    const { label, color } = config[action];
    return (
      <Badge className={`${color} rounded-full px-2 py-0.5 text-xs`}>
        {label}
      </Badge>
    );
  };

  const getActionIcon = (action: AnalystAction) => {
    const iconClass = "h-4 w-4";
    switch (action) {
      case "UP":
        return <ArrowUp className={`${iconClass} text-green-600`} />;
      case "DOWN":
        return <ArrowDown className={`${iconClass} text-red-600`} />;
      case "INIT":
        return <Plus className={`${iconClass} text-blue-600`} />;
      case "DROP":
        return <Minus className={`${iconClass} text-gray-600`} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={actionFilter}
          onValueChange={(value) =>
            setActionFilter(value as AnalystAction | "ALL")
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체</SelectItem>
            <SelectItem value="UP">상향</SelectItem>
            <SelectItem value="DOWN">하향</SelectItem>
            <SelectItem value="INIT">신규</SelectItem>
            <SelectItem value="DROP">취소</SelectItem>
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
        {data.items.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:shadow-md dark:border-slate-800 dark:bg-[#11131a]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getActionIcon(item.action)}</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                      {item.ticker}
                    </span>
                    {getActionBadge(item.action)}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {item.broker}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.broker_rating}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      ${item.old_pt?.toFixed(2) || "N/A"}
                    </span>
                    <ArrowRight />
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      ${item.new_pt?.toFixed(2) || "N/A"}
                    </span>
                    {item.upside_pct !== null && (
                      <span
                        className={`ml-2 text-xs ${
                          item.upside_pct > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        ({item.upside_pct > 0 ? "+" : ""}
                        {item.upside_pct.toFixed(1)}% 여력)
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.rationale}
                  </p>
                  {item.source_details.length > 0 && (
                    <a
                      href={item.source_details[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <ExternalLink className="h-3 w-3" />
                      출처 보기
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-base ${
                      i < Math.round(item.impact_score / 2)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg
      className="h-4 w-4 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}
