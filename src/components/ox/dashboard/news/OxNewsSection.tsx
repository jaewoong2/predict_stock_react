"use client";

import { useEffect, useState } from "react";
import { useMarketForecast, useMarketNewsSummary } from "@/hooks/useMarketNews";
import { format } from "date-fns";
import { MarketNewsCard } from "./MarketNewsCard";
import {
  MarketNewsResponse,
  NewsRecommendationsResponse,
  MarketForecastResponse,
} from "@/types/news";
import { useDateRangeError } from "@/hooks/useDateRangeError";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { useRouter } from "next/navigation";

interface OxNewsSectionProps {
  initialNewsData?: MarketNewsResponse;
  initialRecommendationData?: NewsRecommendationsResponse;
  initialMajorForecast?: MarketForecastResponse[];
  initialMinorForecast?: MarketForecastResponse[];
}

export function OxNewsSection({
  initialNewsData,
  initialMajorForecast,
  initialMinorForecast,
}: OxNewsSectionProps) {
  const { date } = useSignalSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectiveDate = date || format(new Date(), "yyyy-MM-dd");

  const {
    data: newsData,
    isLoading: isLoadingNews,
    error: newsError,
  } = useMarketNewsSummary(
    {
      news_type: "market",
      news_date: effectiveDate,
    },
    {
      initialData: initialNewsData,
      enabled: !initialNewsData,
    },
  );

  const { data: majorForecast, error: majorForecastError } = useMarketForecast(
    effectiveDate,
    "Major",
    {
      initialData: initialMajorForecast,
      enabled: !initialMajorForecast,
    },
  );

  const { data: minorForecast, error: minorForecastError } = useMarketForecast(
    effectiveDate,
    "Minor",
    {
      initialData: initialMinorForecast,
      enabled: !initialMinorForecast,
    },
  );

  const combinedError = newsError || majorForecastError || minorForecastError;
  const { ErrorModal } = useDateRangeError({ error: combinedError });

  // Prevent hydration mismatch by showing loading state until mounted
  if (!mounted || isLoadingNews) {
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
    <>
      <ErrorModal />
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
    </>
  );
}
