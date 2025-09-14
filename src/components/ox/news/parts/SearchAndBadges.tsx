"use client";

import React, { memo } from "react";
import SignalSearchInput from "@/components/signal/SignalSearchInput";
import TickerBadgeRow from "@/components/ticker/TickerBadgeRow";

const SearchAndBadges = memo(function SearchAndBadges({
  selectedTickers,
  onToggle,
  onClearAll,
  onChangeSelected,
  availableSymbols,
}: {
  selectedTickers: string[];
  onToggle: (symbol: string) => void;
  onClearAll: () => void;
  onChangeSelected: (tickers: string[]) => void;
  availableSymbols: string[];
}) {
  return (
    <div className="space-y-2">
      <SignalSearchInput
        selectedTickers={selectedTickers}
        onSelectedTickersChange={onChangeSelected}
        availableTickers={availableSymbols}
        placeholder="티커 검색 (다중 선택)"
      />
      <TickerBadgeRow
        selected={selectedTickers}
        onToggle={onToggle}
        onClearAll={onClearAll}
      />
    </div>
  );
});

export default SearchAndBadges;

