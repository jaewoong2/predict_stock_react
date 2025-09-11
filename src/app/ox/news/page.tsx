"use client";

import { HomeTopStrip } from "@/components/ox/home/HomeTopStrip";
import { format } from "date-fns";
import { NewsListMobile } from "@/components/ox/news/NewsListMobile";

export default function OxNewsPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  return (
    <div className="mx-auto w-full max-w-md px-4 py-2 md:max-w-xl">
      <HomeTopStrip activeTab="news" />
      <div className="space-y-4">
        <NewsListMobile date={today} />
      </div>
      <div className="h-16" />
    </div>
  );
}

