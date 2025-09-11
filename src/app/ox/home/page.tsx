"use client";

import { HomeTopStrip } from "@/components/ox/home/HomeTopStrip";
import { MyInvestmentCard } from "@/components/ox/home/MyInvestmentCard";
import { RealtimeRankingCard } from "@/components/ox/home/RealtimeRankingCard";
import { MobileTabBar } from "@/components/ox/home/MobileTabBar";

export default function OxHomePage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-2 md:max-w-xl">
      <HomeTopStrip activeTab="home" />

      <div className="space-y-4">
        <MyInvestmentCard />
        <RealtimeRankingCard />
      </div>
      <div className="h-16" />
      <MobileTabBar />
    </div>
  );
}
