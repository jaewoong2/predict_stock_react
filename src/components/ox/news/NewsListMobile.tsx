"use client";

import { useMemo, useState } from "react";
import { useMarketNewsSummary } from "@/hooks/useMarketNews";
import { TossCard, TossCardContent, TossCardHeader, TossCardTitle } from "@/components/ui/toss-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Filter, Clock, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarketNewsItem } from "@/types/news";
import { NewsDetailSheet } from "./NewsDetailSheet";

function RecBadge({ rec }: { rec: "Buy" | "Hold" | "Sell" | null }) {
  const getVariant = (rec: string | null) => {
    switch (rec) {
      case "Buy":
        return "bg-green-100 text-green-700 border-green-200";
      case "Sell":
        return "bg-red-100 text-red-700 border-red-200";
      case "Hold":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${getVariant(rec)}`}>
      {rec ?? "N/A"}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <TossCard padding="lg">
      <TossCardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-12 rounded-lg" />
          </div>
        ))}
      </TossCardContent>
    </TossCard>
  );
}

export function NewsListMobile({ date }: { date: string }) {
  const { data, isLoading, error } = useMarketNewsSummary(
    { news_type: "market", news_date: date },
    { refetchInterval: 60_000, staleTime: 30_000 }
  );
  const [filter, setFilter] = useState<"ALL" | "Buy" | "Hold" | "Sell">("ALL");
  const [selected, setSelected] = useState<MarketNewsItem | null>(null);
  const items = data?.result ?? [];

  const filtered = useMemo(() => {
    if (filter === "ALL") return items;
    return items.filter((n) => n.recommendation === filter);
  }, [filter, items]);

  const filters = [
    { id: "ALL", label: "전체" },
    { id: "Buy", label: "Buy" },
    { id: "Hold", label: "Hold" },
    { id: "Sell", label: "Sell" }
  ] as const;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <TossCard padding="lg">
        <TossCardContent>
          <div className="py-12 text-center">
            <div className="text-red-600 mb-2">
              뉴스를 불러오지 못했습니다.
            </div>
            <p className="text-sm text-gray-500">
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        </TossCardContent>
      </TossCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <TossCard padding="lg">
        <TossCardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <TossCardTitle>필터</TossCardTitle>
          </div>
        </TossCardHeader>
        <TossCardContent>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {filters.map((filterItem) => (
              <button
                key={filterItem.id}
                onClick={() => setFilter(filterItem.id)}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                  filter === filterItem.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                )}
              >
                {filterItem.label}
              </button>
            ))}
          </div>
        </TossCardContent>
      </TossCard>

      {/* News List */}
      {filtered.length === 0 ? (
        <TossCard padding="lg">
          <TossCardContent>
            <div className="py-12 text-center">
              <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                표시할 뉴스가 없습니다
              </h3>
              <p className="text-sm text-gray-500">
                다른 필터를 선택해보세요
              </p>
            </div>
          </TossCardContent>
        </TossCard>
      ) : (
        <TossCard padding="lg">
          <TossCardContent>
            <div className="space-y-3">
              {filtered.map((n) => (
                <article
                  key={n.id}
                  role="button"
                  aria-label="뉴스 상세 보기"
                  tabIndex={0}
                  onClick={() => setSelected(n)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(n);
                    }
                  }}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                    {(n.ticker?.[0] || "N").toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                      {n.headline}
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                      {n.summary}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ko })}
                      </span>
                    </div>
                  </div>
                  <RecBadge rec={n.recommendation} />
                </article>
              ))}
            </div>
          </TossCardContent>
        </TossCard>
      )}
      <NewsDetailSheet item={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
