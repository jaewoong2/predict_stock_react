"use client";

import { HomeTopStrip } from "@/components/ox/home/HomeTopStrip";
import { MyInvestmentCard } from "@/components/ox/home/MyInvestmentCard";
import { RealtimeRankingCard } from "@/components/ox/home/RealtimeRankingCard";
import { MobileTabBar } from "@/components/ox/home/MobileTabBar";

export default function OxHomePage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#090b11]">
      {/* Content Container */}
      <div className="mx-auto w-full max-w-full px-4 py-2 md:max-w-xl">
        <HomeTopStrip activeTab="home" />

        {/* Main Content with Toss-style spacing */}
        <div className="space-y-6 pb-20">
          <MyInvestmentCard />
          <RealtimeRankingCard />
        </div>
      </div>

      {/* Fixed Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
}
