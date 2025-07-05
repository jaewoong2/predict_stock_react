"use client";
import { MarketOverviewCard } from "@/components/dashboard/MarketOverviewCard";
import { MomentumSectorsCard } from "@/components/dashboard/MomentumSectorsCard";
import { PopularStocksList } from "@/components/stocks/PopularStocksList";
import { useMarketAnalysis } from "@/hooks/useMarketNews";

interface Props {
  date: string;
}

export default function MarketAnalysisSection({ date }: Props) {
  const { data } = useMarketAnalysis(date, {
    enabled: !!date,
  });

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 space-y-4 md:grid-cols-2">
      <MomentumSectorsCard
        sectors={data.top_momentum_sectors}
        defaultValue={data.top_momentum_sectors[0].sector}
      />
      <div className="flex flex-col space-y-4">
        <MarketOverviewCard data={data.market_overview} date={date} />
        <PopularStocksList date={date} />
      </div>
    </div>
  );
}
