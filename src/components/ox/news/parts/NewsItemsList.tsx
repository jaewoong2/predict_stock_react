"use client";

import React, { memo } from "react";
import type { MarketNewsItem } from "@/types/news";
import NewsItemRow from "./NewsItemRow";

const NewsItemsList = memo(function NewsItemsList({
  items,
  onSelect,
}: {
  items: MarketNewsItem[];
  onSelect: (item: MarketNewsItem) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((n) => (
        <NewsItemRow key={n.id} item={n} onSelect={onSelect} />
      ))}
    </div>
  );
});

export default NewsItemsList;

