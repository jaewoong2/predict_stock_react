"use client";

import { format } from "date-fns";
import { NewsListMobile } from "@/components/ox/news/NewsListMobile";
import { MobileTabBar } from "@/components/ox/home/MobileTabBar";
import { Newspaper } from "lucide-react";

export default function OxNewsPage() {
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div>
      <div className="mx-auto px-4 py-6">
        {/* Page Header with Toss style */}
        <div className="mb-6 space-y-3 text-center">
          <div className="flex justify-center">
            <div className="rounded-2xl bg-orange-100 p-3">
              <Newspaper className="h-8 w-8 text-orange-600" />
            </div>
          </div>
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
