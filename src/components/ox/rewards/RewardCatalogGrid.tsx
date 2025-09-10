"use client";

import { useState } from "react";
import { useRewardCatalog } from "@/hooks/useRewards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RewardItemCard } from "./RewardItemCard";
import { RewardDetailSheet } from "./RewardDetailSheet";
import { RewardItem } from "@/types/rewards";

export function RewardCatalogGrid() {
  const { data, isLoading, error } = useRewardCatalog(true);
  const [selected, setSelected] = useState<RewardItem | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-gray-500 dark:text-gray-400">
          리워드를 불러오는 중...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-red-600 dark:text-red-400">
          리워드를 불러오지 못했습니다.
        </CardContent>
      </Card>
    );
  }

  const items = data?.items ?? [];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.length === 0 ? (
          <Card className="sm:col-span-2 md:col-span-3 lg:col-span-4">
            <CardContent className="py-10 text-center text-gray-500 dark:text-gray-400">
              교환 가능한 리워드가 없습니다.
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <RewardItemCard key={item.id} item={item} onSelect={setSelected} />
          ))
        )}
      </div>

      <RewardDetailSheet item={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </>
  );
}

