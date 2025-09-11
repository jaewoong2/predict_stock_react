"use client";

import { useMemo, useState } from "react";
import { useMarketNewsSummary } from "@/hooks/useMarketNews";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

function RecBadge({ rec }: { rec: "Buy" | "Hold" | "Sell" | null }) {
  const variant = rec === "Buy" ? "default" : rec === "Sell" ? "destructive" : "secondary";
  return <Badge variant={variant}>{rec ?? "N/A"}</Badge>;
}

export function NewsListMobile({ date }: { date: string }) {
  const { data, isLoading, error } = useMarketNewsSummary({ news_type: "market", news_date: date });
  const [filter, setFilter] = useState<"ALL" | "Buy" | "Hold" | "Sell">("ALL");
  const items = data?.result ?? [];

  const filtered = useMemo(() => {
    if (filter === "ALL") return items;
    return items.filter((n) => n.recommendation === filter);
  }, [filter, items]);

  return (
    <div className="space-y-3">
      {/* Filter Tabs */}
      <div className="sticky top-[56px] z-10 -mx-4 bg-white/90 px-4 py-2 backdrop-blur dark:bg-black/60">
        <div className="grid grid-cols-4 gap-2">
          {(["ALL", "Buy", "Hold", "Sell"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded-full border px-3 py-1 text-sm ${filter === k ? "bg-black text-white dark:bg-white dark:text-black" : "text-gray-700 dark:text-gray-200"}`}
            >
              {k === "ALL" ? "전체" : k}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <Card><CardContent className="py-10 text-center text-gray-500">불러오는 중...</CardContent></Card>
      ) : error ? (
        <Card><CardContent className="py-10 text-center text-red-600">뉴스를 불러오지 못했습니다.</CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-gray-500">표시할 뉴스가 없습니다.</CardContent></Card>
      ) : (
        <div className="divide-y rounded-md border">
          {filtered.map((n) => (
            <article key={n.id} className="flex items-start gap-3 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold dark:bg-gray-800">
                {(n.ticker?.[0] || "N").toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium">{n.headline}</h3>
                <p className="text-muted-foreground line-clamp-2 text-xs">{n.summary}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ko })}</span>
                </div>
              </div>
              <RecBadge rec={n.recommendation} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

