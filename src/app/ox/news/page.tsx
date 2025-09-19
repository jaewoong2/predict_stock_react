"use client";

import { format } from "date-fns";
import { NewsListMobile } from "@/components/ox/news/NewsListMobile";
import { MobileTabBar } from "@/components/ox/home/MobileTabBar";
import { Newspaper } from "lucide-react";
import { SectionHeader } from "@/components/atomic/molecules/SectionHeader";

export default function OxNewsPage() {
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-white dark:bg-[#090b11]">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <SectionHeader
          icon={<Newspaper className="h-8 w-8" />}
          iconVariant="orange"
          title="뉴스"
          subtitle="오늘의 주요 시장 뉴스와 티커 관련 뉴스를 확인하세요"
          align="center"
        />

        <div className="space-y-6 pb-20">
          <NewsListMobile date={today} />
        </div>
      </div>

      {/* Fixed Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
}
