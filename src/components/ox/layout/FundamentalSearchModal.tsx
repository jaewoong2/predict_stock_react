"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  ArrowRight,
  X,
  TrendingUp,
  Loader2,
  Minimize2,
} from "lucide-react";
import { useFundamentalAnalysis } from "@/hooks/useFundamentalAnalysis";
import { usePopularTickers } from "@/hooks/usePopularTickers";
import { useTickerLookup } from "@/hooks/useTickerLookup";
import { FundamentalAnalysisCard } from "../dashboard/fundamental/FundamentalAnalysisCard";
import type { MatchType } from "@/types/ticker-lookup";

interface FundamentalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fallback 티커 (API 실패 시)
const FALLBACK_TICKERS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "META", name: "Meta Platforms, Inc." },
  { symbol: "AMZN", name: "Amazon.com, Inc." },
  { symbol: "AMD", name: "Advanced Micro Devices" },
];

export function FundamentalSearchModal({
  isOpen,
  onClose,
}: FundamentalSearchModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedTicker, setSelectedTicker] = useState("");
  const [analysisRequest, setAnalysisRequest] = useState(false);

  // 인기 티커 조회 (거래량 기준 상위 8개)
  const { data: popularStocks } = usePopularTickers({
    limit: 8,
    field: "volume_change",
  });

  // 실시간 티커 검색 (Lookup API with Debouncing & Session Cache)
  const {
    matches: searchResults,
    hasExactSymbol,
    isLoading: isSearching,
    isSearching: isTyping,
    hasQuery,
    isEmpty,
  } = useTickerLookup(inputValue, 250, 10);

  // API 데이터를 검색 가능한 포맷으로 변환
  const POPULAR_TICKERS = useMemo(() => {
    if (popularStocks && popularStocks.length > 0) {
      return popularStocks.map((stock) => ({
        symbol: stock.symbol,
        name: stock.symbol, // API에 name 없으면 symbol 사용
      }));
    }
    return FALLBACK_TICKERS;
  }, [popularStocks]);

  const { data, isLoading, error, refetch } = useFundamentalAnalysis(
    {
      ticker: selectedTicker,
      analysis_request: analysisRequest,
    },
    {
      enabled: !!selectedTicker,
    },
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close (but show warning if loading)
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading]);

  const handleClose = useCallback(() => {
    // If loading, just minimize (don't reset state)
    if (isLoading) {
      onClose();
      return;
    }

    // Otherwise, full reset
    setInputValue("");
    setSelectedTicker("");
    setAnalysisRequest(false);
    onClose();
  }, [onClose, isLoading]);

  const handleSearch = (ticker: string) => {
    setSelectedTicker(ticker.toUpperCase());
    setAnalysisRequest(true);
    setInputValue("");
    setTimeout(() => setAnalysisRequest(false), 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleSearch(inputValue.trim());
    }
  };

  const handleRefresh = () => {
    setAnalysisRequest(true);
    refetch().then(() => setAnalysisRequest(false));
  };

  // match_type에 따른 라벨
  const getMatchLabel = (matchType: MatchType) => {
    switch (matchType) {
      case "exact_symbol":
        return "정확한 심볼";
      case "symbol_prefix":
        return "심볼 시작 일치";
      case "company_name":
        return "회사명 일치";
      default:
        return "";
    }
  };

  // 검색 결과 결정
  const displayTickers = useMemo(() => {
    if (!inputValue) {
      return { type: "popular" as const, items: POPULAR_TICKERS, hasExact: false };
    }

    if (hasQuery && searchResults.length > 0) {
      return {
        type: "search" as const,
        items: searchResults,
        hasExact: hasExactSymbol,
      };
    }

    if (isEmpty) {
      return { type: "empty" as const, items: [], hasExact: hasExactSymbol };
    }

    // 타이핑 중 - 로컬 필터링으로 즉시 피드백
    const filtered = POPULAR_TICKERS.filter(
      (t) =>
        t.symbol.toLowerCase().includes(inputValue.toLowerCase()) ||
        t.name.toLowerCase().includes(inputValue.toLowerCase()),
    );
    return { type: "filtered" as const, items: filtered, hasExact: false };
  }, [inputValue, hasQuery, searchResults, isEmpty, hasExactSymbol, POPULAR_TICKERS]);

  const showSuggestions = displayTickers.items.length > 0 || displayTickers.type === "empty";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-[10vh] backdrop-blur-sm">
      <div className="fixed inset-0" onClick={handleClose} aria-hidden="true" />

      <div className="animate-in fade-in slide-in-from-top-4 relative w-full max-w-3xl duration-200">
        {/* Modal Content */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f1118]">
          {/* Search Header */}
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="티커 또는 회사명 검색..."
              className="flex-1 bg-transparent text-base text-slate-900 placeholder-slate-400 outline-none dark:text-slate-50 ios-input-zoom ios-input-zoom--sm"
              autoFocus={!isLoading}
              disabled={isLoading}
            />

            {/* Close button with context-aware tooltip */}
            <div className="group relative">
              <button
                onClick={handleClose}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                {isLoading ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
              </button>

              {/* Tooltip */}
              {isLoading && (
                <div className="absolute top-full right-0 mt-2 hidden w-48 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block dark:bg-slate-100 dark:text-slate-900">
                  분석은 백그라운드에서 계속됩니다
                </div>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className="max-h-[70vh] overflow-y-auto">
            {!selectedTicker && showSuggestions && (
              <div className="p-3">
                <div className="mb-3 flex items-center justify-between px-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {displayTickers.type === "popular" && "인기 종목"}
                    {displayTickers.type === "search" && "검색 결과"}
                    {displayTickers.type === "filtered" && "검색 결과"}
                    {displayTickers.type === "empty" && "검색 결과"}
                  </p>
                  {(isTyping || isSearching) && (
                    <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                  )}
                </div>
                <div className="space-y-1">
                  {displayTickers.items.map((item) => {
                    const isSearchResult = displayTickers.type === "search";
                    const matchType = "match_type" in item ? item.match_type : undefined;

                    return (
                      <button
                        key={item.symbol}
                        onClick={() => handleSearch(item.symbol)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <div className="flex flex-1 items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                              {item.symbol.substring(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                                {item.symbol}
                              </p>
                              {matchType && (
                                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                                  {getMatchLabel(matchType)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {item.name}
                            </p>
                            {isSearchResult && "exchange" in item && item.exchange && (
                              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                {item.exchange}
                                {item.is_etf && " · ETF"}
                              </p>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!selectedTicker && displayTickers.type === "empty" && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <p className="mb-1 text-sm font-medium text-slate-900 dark:text-slate-50">
                  "{inputValue}" 검색 결과가 없습니다
                </p>
                {!displayTickers.hasExact ? (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/20">
                    <p className="mb-1 text-xs font-semibold text-amber-900 dark:text-amber-300">
                      등록되지 않은 심볼입니다
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      다른 티커를 검색하거나 정확한 심볼을 입력하세요
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    심볼은 존재하지만 등록된 데이터가 없습니다
                  </p>
                )}
              </div>
            )}

            {/* Loading State with progress indicator */}
            {isLoading && (
              <div className="p-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative mb-6">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950" />
                    </div>
                  </div>

                  <p className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-50">
                    {selectedTicker} 분석 중...
                  </p>
                  <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                    재무제표, 뉴스, 시장 데이터를 분석하고 있습니다
                  </p>

                  {/* Background processing notice */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/20">
                    <div className="flex items-start gap-2">
                      <Minimize2 className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-300">
                          백그라운드 처리
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                          창을 닫아도 분석은 계속됩니다. 다시 열어서 결과를
                          확인하세요.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-6">
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/20">
                  <h3 className="mb-2 font-semibold text-rose-900 dark:text-rose-400">
                    분석을 불러올 수 없습니다
                  </h3>
                  <p className="text-sm text-rose-700 dark:text-rose-300">
                    {error.message}
                  </p>
                </div>
              </div>
            )}

            {/* Success - Show Analysis */}
            {data && !isLoading && (
              <div className="p-6">
                <FundamentalAnalysisCard
                  data={data}
                  onRefresh={handleRefresh}
                  isRefreshing={analysisRequest}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          {!selectedTicker && !isLoading && (
            <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  <span>
                    <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">
                      ↵
                    </kbd>{" "}
                    검색
                  </span>
                  <span>
                    <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">
                      ESC
                    </kbd>{" "}
                    닫기
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedTicker && !isLoading && (
            <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
              <button
                onClick={() => {
                  setSelectedTicker("");
                  setInputValue("");
                }}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← 검색으로 돌아가기
              </button>
            </div>
          )}

          {isLoading && (
            <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  분석이 완료되면 다시 열어서 확인하세요
                </p>
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  ESC
                </kbd>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
