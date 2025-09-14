"use client";

import React, { memo, useMemo } from "react";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { MarketNewsItem } from "@/types/news";
import TickerAvatar from "./TickerAvatar";
import RecBadge from "./RecBadge";

const NewsItemRow = memo(function NewsItemRow({
  item,
  onSelect,
}: {
  item: MarketNewsItem;
  onSelect: (item: MarketNewsItem) => void;
}) {
  const timeText = useMemo(
    () =>
      formatDistanceToNow(new Date(item.created_at), {
        addSuffix: true,
        locale: ko,
      }),
    [item.created_at],
  );

  return (
    <article
      role="button"
      aria-label="뉴스 상세 보기"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(item);
        }
      }}
      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-blue-300 focus:outline-none"
    >
      <TickerAvatar ticker={item.ticker} />
      <div className="min-w-0 flex-1 space-y-2">
        <h3 className="line-clamp-2 text-sm leading-tight font-semibold text-gray-900">
          {item.headline}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-gray-600">
          {item.summary}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{timeText}</span>
        </div>
      </div>
      <RecBadge rec={item.recommendation} />
    </article>
  );
});

export default NewsItemRow;

