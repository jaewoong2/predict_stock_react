"use client";

import { useState } from "react";
import { LineChart, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MarketForecastResponse } from "@/types/news";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ForecastBadge } from "./shared/ForecastBadge";
import { ForecastDetailDrawer } from "./shared/ForecastDetailDrawer";

interface MarketForecastCardProps {
  majorData: MarketForecastResponse[];
  minorData: MarketForecastResponse[];
}

export function MarketForecastCard({
  majorData,
  minorData,
}: MarketForecastCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState<{
    date: string;
    major: MarketForecastResponse | null;
    minor: MarketForecastResponse | null;
  } | null>(null);

  const latestMajor = majorData.at(-1);
  const latestMinor = minorData.at(-1);

  const handleForecastClick = (
    major: MarketForecastResponse,
    minor: MarketForecastResponse,
  ) => {
    setSelectedForecast({
      date: major.date_yyyymmdd,
      major,
      minor,
    });
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
              <LineChart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                시장 전망
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400"></p>
            </div>
          </div>
        </div>

        {/* Compact Latest Forecasts */}
        <div className="flex items-center gap-3">
          {latestMajor && (
            <ForecastBadge
              type="expert"
              outlook={latestMajor.outlook}
              percentage={latestMajor.up_percentage || 0}
              variant="compact"
            />
          )}
          {latestMinor && (
            <ForecastBadge
              type="community"
              outlook={latestMinor.outlook}
              percentage={latestMinor.up_percentage || 0}
              variant="compact"
            />
          )}
        </div>

        {/* Forecast History */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            최근 예측
          </h4>
          <div className="space-y-2">
            {majorData.slice(0, 5).map((major, index) => {
              const minor = minorData[index];
              return (
                <button
                  key={major.date_yyyymmdd}
                  onClick={() => handleForecastClick(major, minor)}
                  className="group w-full rounded-lg border border-slate-200 bg-white p-3 text-left transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-[#11131a] dark:hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      {format(new Date(major.date_yyyymmdd), "MM월 dd일")}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          major.outlook === "UP"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
                        )}
                      >
                        전문가 {major.up_percentage}%
                      </Badge>
                      <Badge
                        className={cn(
                          minor?.outlook === "UP"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
                        )}
                      >
                        커뮤니티 {minor?.up_percentage || 0}%
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 dark:text-slate-500" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <ForecastDetailDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        forecast={selectedForecast}
      />
    </>
  );
}
