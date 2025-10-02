"use client";

import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { useMarketForecast, useMarketNewsSummary } from "@/hooks/useMarketNews";
import { format } from "date-fns";
import { MarketNewsCard } from "./MarketNewsCard";
import {
  MarketNewsResponse,
  NewsRecommendationsResponse,
  MarketForecastResponse,
} from "@/types/news";

interface OxNewsSectionProps {
  initialNewsData?: MarketNewsResponse;
  initialRecommendationData?: NewsRecommendationsResponse;
  initialMajorForecast?: MarketForecastResponse[];
  initialMinorForecast?: MarketForecastResponse[];
}

function reverseArray<T>(array: T[]) {
  return array.reverse();
}

export function OxNewsSection({
  initialNewsData,
  initialMajorForecast,
  initialMinorForecast,
}: OxNewsSectionProps) {
  const { date } = useSignalSearchParams();
  const effectiveDate = date || format(new Date(), "yyyy-MM-dd");

  const { data: newsData, isLoading: isLoadingNews } = useMarketNewsSummary(
    {
      news_type: "market",
      news_date: effectiveDate,
    },
    {
      initialData: initialNewsData,
      enabled: !initialNewsData,
    },
  );

  const { data: majorForecast } = useMarketForecast(effectiveDate, "Major", {
    initialData: initialMajorForecast,
    enabled: !initialMajorForecast,
  });

  const { data: minorForecast } = useMarketForecast(effectiveDate, "Minor", {
    initialData: initialMinorForecast,
    enabled: !initialMinorForecast,
  });

  if (isLoadingNews) {
    return (
      <div className="space-y-6">
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-y-6 overflow-scroll">
      {/* Market News with Forecast - Full Width */}
      {newsData?.result && (
        <div className="rounded-2xl bg-white shadow-none dark:bg-[#11131a]">
          <MarketNewsCard
            items={newsData.result}
            majorForecast={majorForecast}
            minorForecast={minorForecast}
          />
        </div>
      )}
    </div>
  );
}
