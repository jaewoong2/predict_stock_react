"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useTodaySession } from "@/hooks/useSession";

type HomeTopStripProps = {
  activeTab?: "home" | "discover" | "news";
};

export function HomeTopStrip({ activeTab = "home" }: HomeTopStripProps) {
  const { data: today } = useTodaySession();
  const phase = today?.session?.phase ?? "--";
  const tradingDay = today?.session?.trading_day ?? "";

  return (
    <div className="sticky top-0 z-10 -mx-4 mb-3 bg-white px-4 py-2 dark:bg-[#0f1118]">
      {/* Market Indices Row removed: no external index trend calls */}
      <div className="mb-2 flex items-center justify-between text-xs">
        <div className="text-slate-400">지수 정보는 표시하지 않습니다</div>
        <Link href="#" className="text-slate-400 dark:text-slate-500">
          <Search className="h-5 w-5" />
        </Link>
      </div>

      {/* Tabs */}
      <nav className="flex items-center gap-4 text-sm">
        <TabLink href="/ox/home" active={activeTab === "home"}>
          홈
        </TabLink>
        <TabLink href="/" active={activeTab === "discover"}>
          발견
        </TabLink>
        <TabLink href="/ox/news" active={activeTab === "news"}>
          뉴스
        </TabLink>
        <div className="ml-auto text-xs text-slate-400 dark:text-slate-500">
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

// IndexBadge removed

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
          ? "border-b-2 border-[#2b6ef2] pb-1 text-[#2b6ef2] dark:text-slate-100"
          : "pb-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      }
    >
      {children}
    </Link>
  );
}
