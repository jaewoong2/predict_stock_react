"use client";

import { RewardCatalogGrid } from "@/components/ox/rewards/RewardCatalogGrid";
import { MobileTabBar } from "@/components/ox/home/MobileTabBar";
import { Gift, Sparkles } from "lucide-react";

export default function RewardsCatalogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-md px-4 py-6 md:max-w-xl">
        {/* Page Header with Toss style */}
        <div className="text-center space-y-3 mb-6">
          <div className="flex justify-center">
            <div className="p-3 bg-purple-100 rounded-2xl">
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">리워드 카탈로그</h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            포인트로 교환 가능한 다양한 리워드를 확인하세요
          </p>
        </div>

        <div className="space-y-6 pb-20">
          <RewardCatalogGrid />
        </div>
      </div>
      
      {/* Fixed Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
}

