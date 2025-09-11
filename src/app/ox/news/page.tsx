"use client";

import { format } from "date-fns";
import { NewsListMobile } from "@/components/ox/news/NewsListMobile";
import { MobileTabBar } from "@/components/ox/home/MobileTabBar";
import { Newspaper, TrendingUp } from "lucide-react";

export default function OxNewsPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-full px-4 py-6 md:max-w-xl">
        {/* Page Header with Toss style */}
        <div className="text-center space-y-3 mb-6">
          <div className="flex justify-center">
            <div className="p-3 bg-orange-100 rounded-2xl">
              <Newspaper className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">뉴스</h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            최신 금융 뉴스와 시장 동향을 확인하세요
          </p>
        </div>

        <div className="space-y-6 pb-20">
          <NewsListMobile date={today} />
        </div>
      </div>
      
      {/* Fixed Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
}
