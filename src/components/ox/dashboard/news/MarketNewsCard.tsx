"use client";

import { useState, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { MarketNewsItem, MarketForecastResponse } from "@/types/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ForecastBadge } from "./shared/ForecastBadge";
import { ForecastDetailDrawer } from "./shared/ForecastDetailDrawer";
import { RecommendationBadge } from "./shared/RecommendationBadge";
import { countRecommendations } from "./shared/utils";

interface MarketNewsCardProps {
  items: MarketNewsItem[];
  majorForecast?: MarketForecastResponse[];
  minorForecast?: MarketForecastResponse[];
}

export function MarketNewsCard({
  items,
  majorForecast,
  minorForecast,
}: MarketNewsCardProps) {
  const [selectedItem, setSelectedItem] = useState<MarketNewsItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isForecastDrawerOpen, setIsForecastDrawerOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedForecast, setSelectedForecast] = useState<{
    date: string;
    major?: MarketForecastResponse;
    minor?: MarketForecastResponse;
  } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const latestMajor = majorForecast?.at(-1);
  const latestMinor = minorForecast?.at(-1);

  const handleForecastClick = (
    major: MarketForecastResponse,
    minor?: MarketForecastResponse,
  ) => {
    setSelectedForecast({
      date: major.date_yyyymmdd,
      major,
      minor,
    });
    setIsForecastDrawerOpen(true);
  };

  const recommendationCounts = countRecommendations(items);

  const filteredItems = selectedFilter
    ? items.filter((item) => item.recommendation === selectedFilter)
    : items;

  const toggleFilter = (recommendation: string) => {
    setSelectedFilter((prev) =>
      prev === recommendation ? null : recommendation,
    );
  };

  const handleItemClick = (item: MarketNewsItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 320;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="space-y-4 pr-2">
        {/* Stats */}
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "cursor-pointer transition-all hover:scale-105",
              selectedFilter === "Buy"
                ? "bg-emerald-600 text-white dark:bg-emerald-500"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
            )}
            onClick={() => toggleFilter("Buy")}
          >
            Buy {recommendationCounts.buy}
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer transition-all hover:scale-105",
              selectedFilter === "Hold"
                ? "bg-amber-600 text-white dark:bg-amber-500"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
            )}
            onClick={() => toggleFilter("Hold")}
          >
            Hold {recommendationCounts.hold}
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer transition-all hover:scale-105",
              selectedFilter === "Sell"
                ? "bg-rose-600 text-white dark:bg-rose-500"
                : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
            )}
            onClick={() => toggleFilter("Sell")}
          >
            Sell {recommendationCounts.sell}
          </Badge>
        </div>

        {/* News Carousel with Forecast */}
        <div className="flex gap-6">
          {/* Market Forecast - Left Side */}
          {majorForecast && minorForecast && latestMajor && latestMinor && (
            <div className="hidden w-64 shrink-0 space-y-4 lg:block">
              {/* Compact Latest Forecasts */}
              <div className="space-y-2">
                <ForecastBadge
                  type="expert"
                  outlook={latestMajor.outlook}
                  percentage={latestMajor.up_percentage || 0}
                  variant="full"
                  onClick={() => handleForecastClick(latestMajor, latestMinor)}
                />
                <ForecastBadge
                  type="community"
                  outlook={latestMinor.outlook}
                  percentage={latestMinor.up_percentage || 0}
                  variant="full"
                  onClick={() => handleForecastClick(latestMajor, latestMinor)}
                />
              </div>

              {/* Recent Forecast Link */}
              <button
                onClick={() => handleForecastClick(latestMajor, latestMinor)}
                className="flex w-full items-center gap-1 text-left text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              >
                최근 예측 보기
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* News Carousel - Right Side */}
          <div className="relative flex w-full flex-1">
            <div
              ref={scrollContainerRef}
              className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="group flex max-w-[300px] min-w-[300px] snap-start flex-col rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-[#11131a] dark:hover:border-slate-700"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h4 className="line-clamp-2 flex-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {item.headline}
                    </h4>
                    {item.recommendation && (
                      <RecommendationBadge
                        recommendation={item.recommendation}
                      />
                    )}
                  </div>
                  <p className="mb-3 line-clamp-3 flex-1 text-xs text-slate-600 dark:text-slate-400">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {new Date(item.created_at).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 dark:text-slate-500" />
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="absolute top-1/2 -left-4 z-10 hidden h-8 w-8 -translate-y-1/2 rounded-full shadow-lg md:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="absolute top-1/2 -right-4 z-10 hidden h-8 w-8 -translate-y-1/2 rounded-full shadow-lg md:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="mx-auto h-full max-h-[80vh] w-[calc(100%-32px)] pb-10 !select-text max-sm:max-h-[70vh] max-sm:w-[calc(100%-14px)]">
            <div className="mx-auto h-full w-full max-w-4xl overflow-y-scroll px-6 max-sm:px-4">
              <DrawerHeader>
                <DrawerClose asChild>
                  <button className="absolute -top-10 -right-0 cursor-pointer text-3xl text-white">
                    &times;
                  </button>
                </DrawerClose>
                <DrawerTitle className="text-left">
                  {selectedItem?.headline}
                  {selectedItem?.recommendation && (
                    <RecommendationBadge
                      recommendation={selectedItem.recommendation}
                      variant="drawer"
                    />
                  )}
                </DrawerTitle>
                <DrawerDescription className="text-left">
                  {selectedItem?.ticker && (
                    <span className="mr-2 font-bold">
                      Ticker: {selectedItem.ticker}
                    </span>
                  )}
                  {new Date(
                    selectedItem?.created_at || "",
                  ).toLocaleDateString()}
                </DrawerDescription>
              </DrawerHeader>
              <div className="z-10 p-4 pb-0">
                <div className="rounded-xl bg-slate-50 p-6 dark:bg-[#151b24]">
                  <h4 className="mb-3 font-semibold text-slate-900 dark:text-slate-50">
                    요약
                  </h4>
                  <p className="mb-6 text-sm text-slate-700 dark:text-slate-300">
                    {selectedItem?.summary}
                  </p>
                  <h4 className="mb-3 font-semibold text-slate-900 dark:text-slate-50">
                    상세 내용
                  </h4>
                  <p className="text-sm whitespace-pre-line text-slate-700 dark:text-slate-300">
                    {selectedItem?.detail_description}
                  </p>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Forecast Detail Drawer */}
        <ForecastDetailDrawer
          open={isForecastDrawerOpen}
          onOpenChange={setIsForecastDrawerOpen}
          forecast={selectedForecast}
        />
      </div>
    </>
  );
}
