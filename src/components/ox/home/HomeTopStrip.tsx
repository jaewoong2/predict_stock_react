"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useTodaySession } from "@/hooks/useSession";
import { useFormattedIndices } from "@/hooks/useMarketIndices";

type HomeTopStripProps = {
  activeTab?: "home" | "discover" | "news";
};

export function HomeTopStrip({ activeTab = "home" }: HomeTopStripProps) {
  const { data: today } = useTodaySession();
  const { indices, isLoading: indicesLoading, error: indicesError } = useFormattedIndices();
  const phase = today?.session?.phase ?? "--";
  const tradingDay = today?.session?.trading_day ?? "";

  return (
    <div className="sticky top-0 z-10 -mx-4 mb-3 border-b bg-white/90 px-4 py-2 backdrop-blur dark:bg-black/60">
      {/* Market Indices Row */}
      <div className="mb-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          {indicesLoading ? (
            // Loading skeleton
            <>
              <div className="flex items-center gap-1">
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-8 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-14 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-10 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
              </div>
            </>
          ) : indicesError ? (
            // Error fallback
            <span className="text-red-500">인덱스 로드 실패</span>
          ) : indices.length > 0 ? (
            // Real data
            indices.slice(0, 3).map((index, i) => (
              <IndexBadge
                key={i}
                name={index.name}
                value={index.value}
                delta={index.delta}
                negative={index.negative}
              />
            ))
          ) : (
            // Fallback placeholder
            <>
              <IndexBadge name="나스닥" value="--" delta="--%" />
              <IndexBadge name="다우" value="--" delta="--%" />
              <IndexBadge name="S&P 500" value="--" delta="--%" />
            </>
          )}
        </div>
        <Link href="#" className="text-gray-500 dark:text-gray-400">
          <Search className="h-5 w-5" />
        </Link>
      </div>

      {/* Tabs */}
      <nav className="flex items-center gap-4 text-sm">
        <TabLink href="/ox/home" active={activeTab === "home"}>
          홈
        </TabLink>
        <TabLink href="/ox/dashboard" active={activeTab === "discover"}>
          발견
        </TabLink>
        <TabLink href="/ox/news" active={activeTab === "news"}>
          뉴스
        </TabLink>
        <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
          {tradingDay && <span className="mr-2">{tradingDay}</span>}
          <span
            className={
              phase === "OPEN"
                ? "text-green-600 dark:text-green-400"
                : phase === "CLOSED"
                  ? "text-red-600 dark:text-red-400"
                  : ""
            }
          >
            {phase === "OPEN"
              ? "예측 가능"
              : phase === "CLOSED"
                ? "예측 마감"
                : "세션"}
          </span>
        </div>
      </nav>
    </div>
  );
}

function IndexBadge({
  name,
  value,
  delta,
  negative = false,
}: {
  name: string;
  value: string;
  delta: string;
  negative?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-gray-500 dark:text-gray-400">{name}</span>
      <span className="font-semibold">{value}</span>
      <span className={negative ? "text-blue-600" : "text-red-600"}>
        {delta}
      </span>
    </div>
  );
}

function TabLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "border-b-2 border-black pb-1 text-black dark:border-white dark:text-white"
          : "pb-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      }
    >
      {children}
    </Link>
  );
}
