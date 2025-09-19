"use client";

import { TossCard, TossCardContent, TossCardHeader, TossCardTitle } from "@/components/ui/toss-card";
import { TossButton } from "@/components/ui/toss-button";
import { useState } from "react";
import { PopularStocksList } from "@/components/stocks/PopularStocksList";
import { format } from "date-fns";
import { TrendingUp, Star, Eye, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function RealtimeRankingCard() {
  const [tab, setTab] = useState("volume");
  const today = format(new Date(), "yyyy-MM-dd");

  const tabs = [
    {
      id: "volume",
      label: "거래량",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      id: "popular", 
      label: "인기",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      id: "watch",
      label: "관심",
      icon: <Eye className="h-4 w-4" />,
    },
  ];

  return (
    <TossCard padding="lg">
      <TossCardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#2b6ef2]" />
            <TossCardTitle>실시간 랭킹</TossCardTitle>
          </div>
          <TossButton variant="ghost" size="sm">
            전체보기
          </TossButton>
        </div>
      </TossCardHeader>

      <TossCardContent>
        <div className="mb-6">
          <div className="flex gap-2 rounded-xl bg-slate-50 p-1 dark:bg-[#151b25]">
            {tabs.map((tabItem) => (
              <button
                key={tabItem.id}
                onClick={() => setTab(tabItem.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  tab === tabItem.id
                    ? "bg-white text-[#2b6ef2] shadow-sm dark:bg-[#1d2432]"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                )}
              >
                {tabItem.icon}
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {tab === "volume" && (
            <div>
              <PopularStocksList date={today} viewType="card" />
            </div>
          )}
          
          {tab === "popular" && (
            <div>
              <PopularStocksList date={today} viewType="card" />
            </div>
          )}
          
          {tab === "watch" && (
            <div className="py-12 text-center">
              <Eye className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                관심목록을 만들어보세요
              </h3>
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                관심 있는 종목을 저장하고 쉽게 확인하세요
              </p>
              <TossButton variant="default" size="sm">
                <Star className="h-4 w-4" />
                관심목록 시작하기
              </TossButton>
            </div>
          )}
        </div>
      </TossCardContent>
    </TossCard>
  );
}
