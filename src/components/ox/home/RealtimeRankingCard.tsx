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
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <TossCardTitle>실시간 랭킹</TossCardTitle>
          </div>
          <TossButton variant="ghost" size="sm">
            전체보기
          </TossButton>
        </div>
      </TossCardHeader>

      <TossCardContent>
        {/* Custom Tab Navigation */}
        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {tabs.map((tabItem) => (
              <button
                key={tabItem.id}
                onClick={() => setTab(tabItem.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                  tab === tabItem.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
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
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">관심목록을 만들어보세요</h3>
              <p className="text-sm text-gray-500 mb-4">관심 있는 종목을 저장하고 쉽게 확인하세요</p>
              <TossButton variant="primary" size="sm">
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

