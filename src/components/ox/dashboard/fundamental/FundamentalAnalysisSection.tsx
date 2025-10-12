"use client";

import { useState } from "react";
import { useFundamentalAnalysis } from "@/hooks/useFundamentalAnalysis";
import { FundamentalAnalysisCard } from "./FundamentalAnalysisCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FundamentalAnalysisSectionProps {
  defaultTicker?: string;
}

// Popular tickers for suggestions
const POPULAR_TICKERS = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "META", name: "Meta" },
];

export function FundamentalAnalysisSection({
  defaultTicker,
}: FundamentalAnalysisSectionProps) {
  const [ticker, setTicker] = useState(defaultTicker || "");
  const [inputValue, setInputValue] = useState("");
  const [analysisRequest, setAnalysisRequest] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { data, isLoading, error, refetch } = useFundamentalAnalysis(
    {
      ticker,
      analysis_request: analysisRequest,
    },
    {
      enabled: !!ticker,
    }
  );

  const handleSearch = (selectedTicker?: string) => {
    const tickerToSearch = selectedTicker || inputValue.trim();
    if (tickerToSearch) {
      setTicker(tickerToSearch.toUpperCase());
      setAnalysisRequest(true);
      setInputValue("");
      setIsFocused(false);
      setTimeout(() => setAnalysisRequest(false), 1000);
    }
  };

  const handleRefresh = () => {
    setAnalysisRequest(true);
    refetch().then(() => setAnalysisRequest(false));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      setIsFocused(false);
      setInputValue("");
    }
  };

  const filteredTickers = POPULAR_TICKERS.filter(
    (t) =>
      inputValue.length > 0 &&
      (t.symbol.toLowerCase().includes(inputValue.toLowerCase()) ||
        t.name.toLowerCase().includes(inputValue.toLowerCase()))
  );

  const showSuggestions = isFocused && (inputValue.length === 0 || filteredTickers.length > 0);

  // Empty state with command palette style
  if (!ticker) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="w-full max-w-2xl space-y-6">
          {/* Hero Section */}
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <TrendingUp className="h-8 w-8 text-slate-600 dark:text-slate-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
              기업 기본 분석
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              티커를 검색하여 상세한 기업 분석 리포트를 확인하세요
            </p>
          </div>

          {/* Command Palette Style Search */}
          <div className="relative">
            <div
              className={cn(
                "overflow-hidden rounded-xl border bg-white shadow-lg transition-all dark:bg-[#0f1118]",
                isFocused
                  ? "border-slate-300 shadow-xl dark:border-slate-700"
                  : "border-slate-200 dark:border-slate-800"
              )}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <Search className="h-5 w-5 text-slate-400" />
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  placeholder="티커 또는 회사명 검색..."
                  className="flex-1 border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
                <kbd className="hidden rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400 sm:inline-block">
                  Enter
                </kbd>
              </div>

              {/* Suggestions */}
              {showSuggestions && (
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="p-2">
                    <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {inputValue.length > 0 ? "검색 결과" : "인기 종목"}
                    </p>
                    {(inputValue.length > 0 ? filteredTickers : POPULAR_TICKERS).map((item) => (
                      <button
                        key={item.symbol}
                        onClick={() => handleSearch(item.symbol)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                              {item.symbol.substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                              {item.symbol}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {item.name}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer hint */}
              {!showSuggestions && (
                <div className="border-t border-slate-100 px-4 py-2 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    티커를 입력하고 Enter를 누르거나 클릭하여 검색
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Search Bar - Compact */}
        <div className="relative">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#0f1118]">
            <Search className="h-5 w-5 text-slate-400" />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="티커 또는 회사명 검색..."
              className="flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Loading State */}
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-[#11131a]">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/20">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      {ticker} 분석 중...
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      재무제표, 뉴스, 시장 데이터를 분석하고 있습니다
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#0f1118]">
            <Search className="h-5 w-5 text-slate-400" />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="티커 또는 회사명 검색..."
              className="flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <Card className="overflow-hidden rounded-2xl border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/20">
          <CardContent className="p-6">
            <h3 className="mb-2 font-semibold text-rose-900 dark:text-rose-400">
              분석을 불러올 수 없습니다
            </h3>
            <p className="text-sm text-rose-700 dark:text-rose-300">
              {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  // Success state with data
  return (
    <div className="space-y-4">
      {/* Search Bar - Compact */}
      <div className="relative">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#0f1118]">
          <Search className="h-5 w-5 text-slate-400" />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="티커 또는 회사명 검색..."
            className="flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Mini suggestions when focused */}
        {showSuggestions && (
          <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-[#0f1118]">
            <div className="max-h-[200px] overflow-y-auto p-2">
              {(inputValue.length > 0 ? filteredTickers : POPULAR_TICKERS.slice(0, 4)).map(
                (item) => (
                  <button
                    key={item.symbol}
                    onClick={() => handleSearch(item.symbol)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {item.symbol}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {item.name}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Analysis Card */}
      <FundamentalAnalysisCard
        data={data}
        onRefresh={handleRefresh}
        isRefreshing={analysisRequest}
      />
    </div>
  );
}
