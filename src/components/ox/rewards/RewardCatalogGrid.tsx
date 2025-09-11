"use client";

import { useState } from "react";
import { useRewardCatalog } from "@/hooks/useRewards";
import { TossCard, TossCardContent } from "@/components/ui/toss-card";
import { Skeleton } from "@/components/ui/skeleton";
import { RewardItemCard } from "./RewardItemCard";
import { RewardDetailSheet } from "./RewardDetailSheet";
import { RewardItem } from "@/types/rewards";
import { Gift } from "lucide-react";

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <TossCard key={i} padding="lg">
          <TossCardContent className="space-y-3">
            <Skeleton className="h-32 w-full rounded-xl" />
            <div>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </TossCardContent>
        </TossCard>
      ))}
    </div>
  );
}

export function RewardCatalogGrid() {
  const { data, isLoading, error } = useRewardCatalog(true);
  const [selected, setSelected] = useState<RewardItem | null>(null);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <TossCard padding="lg">
        <TossCardContent>
          <div className="py-12 text-center">
            <div className="text-red-600 mb-2">
              리워드를 불러오지 못했습니다.
            </div>
            <p className="text-sm text-gray-500">
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        </TossCardContent>
      </TossCard>
    );
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <TossCard padding="lg">
        <TossCardContent>
          <div className="py-12 text-center">
            <Gift className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              교환 가능한 리워드가 없습니다
            </h3>
            <p className="text-sm text-gray-500">
              새로운 리워드가 추가되면 알려드릴게요
            </p>
          </div>
        </TossCardContent>
      </TossCard>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <RewardItemCard key={item.id} item={item} onSelect={setSelected} />
        ))}
      </div>

      <RewardDetailSheet item={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </>
  );
}

