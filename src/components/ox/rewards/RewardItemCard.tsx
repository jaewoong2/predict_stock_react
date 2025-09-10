"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RewardItem } from "@/types/rewards";
import { Badge } from "@/components/ui/badge";

interface RewardItemCardProps {
  item: RewardItem;
  onSelect: (item: RewardItem) => void;
}

export function RewardItemCard({ item, onSelect }: RewardItemCardProps) {
  const disabled = !item.is_available || (item.stock_quantity !== undefined && item.stock_quantity <= 0);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="truncate" title={item.name}>{item.name}</span>
          {!item.is_available && <Badge variant="outline">품절</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {item.image_url ? (
          <div className="relative h-32 w-full overflow-hidden rounded-md bg-gray-50 dark:bg-gray-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-md bg-gray-50 text-sm text-gray-400 dark:bg-gray-900 dark:text-gray-500">
            이미지 없음
          </div>
        )}
        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400" title={item.description}>
          {item.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{item.points_cost.toLocaleString()} P</span>
          {item.stock_quantity !== undefined && (
            <span className="text-gray-500 dark:text-gray-400">재고 {item.stock_quantity}</span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={disabled} onClick={() => onSelect(item)}>
          교환하기
        </Button>
      </CardFooter>
    </Card>
  );
}

