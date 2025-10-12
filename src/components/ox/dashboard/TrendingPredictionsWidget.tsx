"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TickerAvatar } from "@/components/atomic/atoms/TickerAvatar";
import {
  TrendingUp,
  TrendingDown,
  Target,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePredictionDirectionStats } from "@/hooks/usePredictionTrends";
import type {
  HighProbabilityStock,
  TrendingStock,
} from "@/types/prediction-trends";

/**
 * 예측 트렌드 위젯
 *
 * 데이터 소스:
 * 1. "확률 높은 종목" - 시그널 데이터 (useSignalDataByDate) ✅
 * 2. "롱/숏 예측 많은 종목" - GET /api/ox/predictions/direction-stats ✅
 *
 * 참고: TrendingPredictionsContainer에서 시그널 데이터를 가져와서 전달합니다.
 */
interface TrendingPredictionsWidgetProps {
  date?: string; // 조회할 날짜 (기본: 오늘)
  limit?: number; // 각 카테고리별 최대 종목 수 (기본: 5)
  highProbability?: HighProbabilityStock[]; // 시그널 데이터에서 추출된 확률 높은 종목
}

// Mock 데이터 (API 연동 전 테스트용)
const MOCK_HIGH_PROBABILITY: HighProbabilityStock[] = [
  {
    ticker: "NVDA",
    companyName: "NVIDIA",
    probability: 78.5,
    direction: "LONG",
    totalPredictions: 1234,
    lastPrice: 875.32,
    changePercent: 2.4,
  },
  {
    ticker: "TSLA",
    companyName: "Tesla",
    probability: 72.3,
    direction: "LONG",
    totalPredictions: 987,
    lastPrice: 245.67,
    changePercent: -1.2,
  },
  {
    ticker: "AAPL",
    companyName: "Apple",
    probability: 68.9,
    direction: "SHORT",
    totalPredictions: 856,
    lastPrice: 178.45,
    changePercent: 0.8,
  },
  {
    ticker: "MSFT",
    companyName: "Microsoft",
    probability: 65.7,
    direction: "LONG",
    totalPredictions: 743,
    lastPrice: 405.23,
    changePercent: 1.5,
  },
  {
    ticker: "META",
    companyName: "Meta",
    probability: 63.2,
    direction: "SHORT",
    totalPredictions: 692,
    lastPrice: 485.91,
    changePercent: -0.5,
  },
];

const MOCK_LONG_PREDICTIONS: TrendingStock[] = [
  {
    ticker: "NVDA",
    companyName: "NVIDIA",
    count: 1234,
    winRate: 68.5,
    avgProfit: 12.3,
    lastPrice: 875.32,
    changePercent: 2.4,
  },
  {
    ticker: "TSLA",
    companyName: "Tesla",
    count: 987,
    winRate: 62.1,
    avgProfit: 8.7,
    lastPrice: 245.67,
    changePercent: -1.2,
  },
  {
    ticker: "AAPL",
    companyName: "Apple",
    count: 856,
    winRate: 71.3,
    avgProfit: 5.4,
    lastPrice: 178.45,
    changePercent: 0.8,
  },
  {
    ticker: "MSFT",
    companyName: "Microsoft",
    count: 743,
    winRate: 69.8,
    avgProfit: 7.2,
    lastPrice: 405.23,
    changePercent: 1.5,
  },
  {
    ticker: "GOOGL",
    companyName: "Alphabet",
    count: 621,
    winRate: 65.4,
    avgProfit: 6.1,
    lastPrice: 142.89,
    changePercent: 1.1,
  },
];

const MOCK_SHORT_PREDICTIONS: TrendingStock[] = [
  {
    ticker: "META",
    companyName: "Meta",
    count: 692,
    winRate: 58.3,
    avgProfit: -4.2,
    lastPrice: 485.91,
    changePercent: -0.5,
  },
  {
    ticker: "NFLX",
    companyName: "Netflix",
    count: 534,
    winRate: 61.7,
    avgProfit: -3.8,
    lastPrice: 512.34,
    changePercent: -2.1,
  },
  {
    ticker: "COIN",
    companyName: "Coinbase",
    count: 487,
    winRate: 64.2,
    avgProfit: -5.6,
    lastPrice: 198.76,
    changePercent: -3.4,
  },
  {
    ticker: "SHOP",
    companyName: "Shopify",
    count: 423,
    winRate: 59.1,
    avgProfit: -4.1,
    lastPrice: 67.89,
    changePercent: -1.8,
  },
  {
    ticker: "UBER",
    companyName: "Uber",
    count: 398,
    winRate: 62.5,
    avgProfit: -3.5,
    lastPrice: 72.45,
    changePercent: -0.9,
  },
];

type TabType = "high-probability" | "long" | "short";

export function TrendingPredictionsWidget({
  date,
  limit = 5,
  highProbability = MOCK_HIGH_PROBABILITY,
}: TrendingPredictionsWidgetProps) {
  const [activeTab, setActiveTab] = useState<TabType>("high-probability");

  // 롱/숏 예측 통계 API 호출 - 임시로 비활성화 (브랜치 이슈)
  const { data, isLoading, error } = usePredictionDirectionStats(
    {
      date,
      limit,
    },
    {
      enabled: false, // API 호출 완전 비활성화
    }
  );

  // Mock 데이터 사용 (API 비활성화 중)
  const mostLongPredictions = MOCK_LONG_PREDICTIONS;
  const mostShortPredictions = MOCK_SHORT_PREDICTIONS;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab("high-probability")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
            activeTab === "high-probability"
              ? "bg-purple-600 text-white dark:bg-purple-500"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#151b24] dark:text-slate-300 dark:hover:bg-[#1a2030]",
          )}
        >
          <Target className="h-4 w-4" />
          <span>확률 높은 종목</span>
          <Badge
            variant="secondary"
            className={cn(
              "ml-1",
              activeTab === "high-probability"
                ? "bg-purple-700 text-white dark:bg-purple-600"
                : "bg-slate-200 dark:bg-[#1a2030]",
            )}
          >
            {highProbability.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("long")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
            activeTab === "long"
              ? "bg-emerald-600 text-white dark:bg-emerald-500"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#151b24] dark:text-slate-300 dark:hover:bg-[#1a2030]",
          )}
        >
          <TrendingUp className="h-4 w-4" />
          <span>롱 예측 많은 종목</span>
          <Badge
            variant="secondary"
            className={cn(
              "ml-1",
              activeTab === "long"
                ? "bg-emerald-700 text-white dark:bg-emerald-600"
                : "bg-slate-200 dark:bg-[#1a2030]",
            )}
          >
            {mostLongPredictions.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("short")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
            activeTab === "short"
              ? "bg-rose-600 text-white dark:bg-rose-500"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#151b24] dark:text-slate-300 dark:hover:bg-[#1a2030]",
          )}
        >
          <TrendingDown className="h-4 w-4" />
          <span>숏 예측 많은 종목</span>
          <Badge
            variant="secondary"
            className={cn(
              "ml-1",
              activeTab === "short"
                ? "bg-rose-700 text-white dark:bg-rose-600"
                : "bg-slate-200 dark:bg-[#1a2030]",
            )}
          >
            {mostShortPredictions.length}
          </Badge>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === "high-probability" && (
          <>
            {highProbability.map((stock, index) => (
              <HighProbabilityCard
                key={stock.ticker}
                stock={stock}
                rank={index + 1}
              />
            ))}
          </>
        )}

        {activeTab === "long" && (
          <>
            {mostLongPredictions.map((stock, index) => (
              <TrendingStockCard
                key={stock.ticker}
                stock={stock}
                rank={index + 1}
                type="long"
              />
            ))}
          </>
        )}

        {activeTab === "short" && (
          <>
            {mostShortPredictions.map((stock, index) => (
              <TrendingStockCard
                key={stock.ticker}
                stock={stock}
                rank={index + 1}
                type="short"
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function HighProbabilityCard({
  stock,
  rank,
}: {
  stock: HighProbabilityStock;
  rank: number;
}) {
  const isLong = stock.direction === "LONG";
  const isPositive = (stock.changePercent ?? 0) > 0;

  return (
    <Card className="group cursor-pointer rounded-2xl border-0 bg-white p-4 transition-all hover:shadow-lg dark:bg-[#0f1118] dark:hover:bg-[#151b24]">
      <div className="flex items-center justify-between">
        {/* Left: Rank + Stock Info */}
        <div className="flex items-center gap-4">
          {/* Rank Badge */}
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
              rank === 1
                ? "bg-amber-400 text-amber-900"
                : rank === 2
                  ? "bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-100"
                  : rank === 3
                    ? "bg-amber-600 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-[#1a2030] dark:text-slate-300",
            )}
          >
            {rank}
          </div>

          {/* Stock Avatar + Info */}
          <div className="flex items-center gap-3">
            <TickerAvatar symbol={stock.ticker} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
                  {stock.ticker}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "border-0 text-xs font-semibold",
                    isLong
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
                  )}
                >
                  {isLong ? "LONG" : "SHORT"}
                </Badge>
              </div>
              {stock.companyName && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stock.companyName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-6">
          {/* Probability */}
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">확률</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {stock.probability.toFixed(1)}%
            </p>
          </div>

          {/* Total Predictions */}
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              예측 수
            </p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {stock.totalPredictions.toLocaleString()}
            </p>
          </div>

          {/* Price Change */}
          {stock.changePercent !== undefined && (
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                변동률
              </p>
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <ArrowUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-rose-500" />
                )}
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400",
                  )}
                >
                  {Math.abs(stock.changePercent).toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function TrendingStockCard({
  stock,
  rank,
  type,
}: {
  stock: TrendingStock;
  rank: number;
  type: "long" | "short";
}) {
  const isPositive = (stock.changePercent ?? 0) > 0;

  return (
    <Card className="group cursor-pointer rounded-2xl border-0 bg-white p-4 transition-all hover:shadow-lg dark:bg-[#0f1118] dark:hover:bg-[#151b24]">
      <div className="flex items-center justify-between">
        {/* Left: Rank + Stock Info */}
        <div className="flex items-center gap-4">
          {/* Rank Badge */}
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
              rank === 1
                ? "bg-amber-400 text-amber-900"
                : rank === 2
                  ? "bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-100"
                  : rank === 3
                    ? "bg-amber-600 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-[#1a2030] dark:text-slate-300",
            )}
          >
            {rank}
          </div>

          {/* Stock Avatar + Info */}
          <div className="flex items-center gap-3">
            <TickerAvatar symbol={stock.ticker} size={32} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
                  {stock.ticker}
                </span>
              </div>
              {stock.companyName && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stock.companyName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-6">
          {/* Prediction Count */}
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {type === "long" ? "롱 예측" : "숏 예측"}
            </p>
            <p
              className={cn(
                "text-lg font-bold",
                type === "long"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400",
              )}
            >
              {stock.count.toLocaleString()}
            </p>
          </div>

          {/* Win Rate */}
          {stock.winRate !== undefined && (
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">승률</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {stock.winRate.toFixed(1)}%
              </p>
            </div>
          )}

          {/* Avg Profit */}
          {stock.avgProfit !== undefined && (
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                평균 수익
              </p>
              <p
                className={cn(
                  "text-sm font-semibold",
                  stock.avgProfit > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400",
                )}
              >
                {stock.avgProfit > 0 ? "+" : ""}
                {stock.avgProfit.toFixed(1)}%
              </p>
            </div>
          )}

          {/* Price Change */}
          {stock.changePercent !== undefined && (
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                변동률
              </p>
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <ArrowUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-rose-500" />
                )}
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400",
                  )}
                >
                  {Math.abs(stock.changePercent).toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs Skeleton */}
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 w-40 animate-pulse rounded-xl bg-slate-200 dark:bg-[#151b24]"
          />
        ))}
      </div>

      {/* Cards Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-[#0f1118]"
          />
        ))}
      </div>
    </div>
  );
}
