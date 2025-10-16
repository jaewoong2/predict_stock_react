"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetTickerByDiffrences } from "@/hooks/useTicker";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useDateRangeError } from "@/hooks/useDateRangeError";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { useRouter } from "next/navigation";

export function CompactMarketChanges() {
  const [activeTab, setActiveTab] = useState("price");
  const { date } = useSignalSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: priceData,
    isLoading: priceLoading,
    error: priceError,
  } = useGetTickerByDiffrences({
    direction: "desc",
    limit: 10,
    field: "close_change",
    target_date: date || undefined,
  });

  const {
    data: volumeData,
    isLoading: volumeLoading,
    error: volumeError,
  } = useGetTickerByDiffrences({
    direction: "desc",
    limit: 10,
    field: "volume_change",
    target_date: date || undefined,
  });

  const combinedError = priceError || volumeError;
  const { ErrorModal } = useDateRangeError({ error: combinedError });

  // Prevent hydration mismatch by showing loading state until mounted
  if (!mounted || priceLoading || volumeLoading) {
    return <LoadingSkeleton />;
  }

  if (
    (!priceData || priceData.length === 0) &&
    (!volumeData || volumeData.length === 0)
  ) {
    return (
      <>
        <ErrorModal />
        <div className="rounded-3xl bg-white p-6 text-center text-sm text-slate-500 dark:bg-[#0f1118] dark:text-slate-400">
          데이터를 불러올 수 없습니다.
        </div>
      </>
    );
  }

  return (
    <>
      <ErrorModal />
      <div className="rounded-3xl bg-white p-6 shadow-none dark:bg-[#0f1118]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md grid-cols-2 bg-slate-100 dark:bg-[#151b24]">
            <TabsTrigger
              value="price"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#0f1118]"
            >
              주가 상승률
            </TabsTrigger>
            <TabsTrigger
              value="volume"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#0f1118]"
            >
              거래량 상승률
            </TabsTrigger>
          </TabsList>

          <TabsContent value="price" className="mt-0">
            <StockGrid data={priceData} date={date || ""} type="price" />
          </TabsContent>

          <TabsContent value="volume" className="mt-0">
            <StockGrid data={volumeData} date={date || ""} type="volume" />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function StockGrid({
  data,
  date,
  type,
}: {
  data?: any[];
  date: string;
  type: "price" | "volume";
}) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {data.slice(0, 10).map((stock, index) => {
        const changeValue =
          type === "price" ? stock.price_change : stock.volume_change;
        const isPositive = changeValue > 0;

        return (
          <Link
            key={stock.symbol}
            href={`/detail/${stock.symbol}?model=GOOGLE&date=${date}`}
            className="group rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 dark:bg-[#11131a] dark:hover:bg-[#151b24]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-600 dark:bg-[#0f1118] dark:text-slate-300">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-50 dark:group-hover:text-blue-400">
                    {stock.symbol}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    ${stock.close_price.toFixed(2)}
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold",
                  isPositive
                    ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
                    : "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
                )}
              >
                {isPositive ? (
                  <ArrowUpIcon className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownIcon className="h-3.5 w-3.5" />
                )}
                {Math.abs(changeValue).toFixed(2)}%
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-none dark:bg-[#0f1118]">
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-slate-50 p-4 dark:bg-[#11131a]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
