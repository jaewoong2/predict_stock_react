"use client";
import { format } from "date-fns";
import { useMarketNewsSummary } from "@/hooks/useMarketNews";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { MarketNewsCarousel } from "./MarketNewsCarousel";
import { CarouselSkeleton } from "@/components/ui/skeletons";

export default function MarketNewsSection() {
  const { date } = useSignalSearchParams();
  const { data, isLoading } = useMarketNewsSummary(
    {
      news_type: "market",
      news_date: date ?? format(new Date(), "yyyy-MM-dd"),
    },
    {
      select: (d) => d,
    },
  );

  if (isLoading) {
    return <CarouselSkeleton itemCount={10} />;
  }

  return <MarketNewsCarousel items={data?.result ?? []} />;
}
