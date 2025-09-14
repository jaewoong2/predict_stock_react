"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMarketNewsSummary } from "@/hooks/useMarketNews";
import {
  TossCard,
  TossCardContent,
  TossCardHeader,
} from "@/components/ui/toss-card";
import { Newspaper } from "lucide-react";
import type { MarketNewsItem } from "@/types/news";
import { NewsDetailSheet } from "./NewsDetailSheet";
import { useTickers } from "@/hooks/useTicker";
import SearchAndBadgesExt from "./parts/SearchAndBadges";
import NewsItemsListExt from "./parts/NewsItemsList";

export function NewsListMobile({ date }: { date: string }) {
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);

  const { data: allTickers } = useTickers();

  const { data: marketData, isFetching: isFetchingMarket } =
    useMarketNewsSummary({ news_type: "market", news_date: date });

  const { data: tickerData, isFetching: isFetchingTicker } =
    useMarketNewsSummary(
      {
        news_type: "ticker",
        ticker:
          selectedTickers.length > 0
            ? selectedTickers.map((t) => t.toUpperCase()).join(",")
            : undefined,
        news_date: date,
      },
      {
        refetchInterval: 60_000,
        staleTime: 30_000,
        enabled: selectedTickers.length > 0,
        placeholderData: (prev) => prev,
      },
    );

  const [selected, setSelected] = useState<MarketNewsItem | null>(null);
  const [displayItems, setDisplayItems] = useState<MarketNewsItem[]>([]);

  useEffect(() => {
    // if (dataResp?.result) setDisplayItems(dataResp.result);
    if (
      tickerData &&
      tickerData.result.length > 0 &&
      selectedTickers.length > 0
    ) {
      setDisplayItems(tickerData.result);
      return;
    }

    if (marketData) {
      setDisplayItems(marketData?.result);
    }
  }, [marketData, tickerData, selectedTickers]);

  // recommendation filter removed — show all items

  const availableSymbols = useMemo(() => {
    return Array.from(
      new Set(
        (allTickers ?? [])
          .map((t) => t.symbol)
          .filter(Boolean)
          .map((s) => s.toUpperCase()),
      ),
    ).sort();
  }, [allTickers]);

  // Stable handlers must be declared before any early returns
  const handleToggleTicker = useCallback((symbol: string) => {
    setSelectedTickers((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol],
    );
  }, []);
  const handleClearAll = useCallback(() => setSelectedTickers([]), []);
  const handleChangeSelected = useCallback(
    (arr: string[]) => setSelectedTickers(arr),
    [],
  );
  const handleSelectItem = useCallback(
    (it: MarketNewsItem) => setSelected(it),
    [],
  );

  const handleSheetOpenChange = useCallback((open: boolean) => {
    if (!open) {
      // Defer state update to avoid setState during render of parent
      setTimeout(() => setSelected(null), 0);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Ticker Search & Badges */}
      <TossCard padding="lg">
        <TossCardContent>
          <SearchAndBadgesExt
            selectedTickers={selectedTickers}
            onToggle={handleToggleTicker}
            onClearAll={handleClearAll}
            onChangeSelected={handleChangeSelected}
            availableSymbols={availableSymbols}
          />
        </TossCardContent>
      </TossCard>

      {/* News List */}
      {displayItems.length === 0 ? (
        <TossCard padding="lg">
          <TossCardContent>
            <div className="py-12 text-center">
              <Newspaper className="mx-auto mb-3 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                표시할 뉴스가 없습니다
              </h3>
              <p className="text-sm text-gray-500">다른 필터를 선택해보세요</p>
            </div>
          </TossCardContent>
        </TossCard>
      ) : (
        <TossCard padding="lg">
          <TossCardContent>
            <NewsItemsListExt items={displayItems} onSelect={handleSelectItem} />
          </TossCardContent>
        </TossCard>
      )}
      <NewsDetailSheet item={selected} onOpenChange={handleSheetOpenChange} />
    </div>
  );
}
