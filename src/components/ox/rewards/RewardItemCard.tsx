"use client";

import Image from "next/image";
import { TossCard, TossCardContent } from "@/components/ui/toss-card";
import { TossButton } from "@/components/ui/toss-button";
import { RewardItem } from "@/types/rewards";
import { Badge } from "@/components/ui/badge";
import { Coins, Package } from "lucide-react";

interface RewardItemCardProps {
  item: RewardItem;
  onSelect: (item: RewardItem) => void;
}

export function RewardItemCard({ item, onSelect }: RewardItemCardProps) {
  const disabled = !item.is_available || (item.stock_quantity !== undefined && item.stock_quantity <= 0);

  return (
    <TossCard padding="lg" className="h-full">
      <TossCardContent className="space-y-4">
        {/* Header with status */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
            {item.name}
          </h3>
          {!item.is_available && (
            <Badge variant="outline" className="ml-2 flex-shrink-0">
              품절
            </Badge>
          )}
        </div>

        {/* Image */}
        {item.image_url ? (
          <div className="relative h-32 w-full overflow-hidden rounded-xl bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-xl bg-gray-100">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2" title={item.description}>
          {item.description}
        </p>

        {/* Price and Stock */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Coins className="h-4 w-4 text-yellow-600" />
              <span className="font-bold text-gray-900">{item.points_cost.toLocaleString()}P</span>
            </div>
            {item.stock_quantity !== undefined && (
              <span className="text-xs text-gray-500">재고 {item.stock_quantity}</span>
            )}
          </div>

          {/* Action Button */}
          <TossButton 
            variant={disabled ? "outline" : "primary"} 
            size="sm" 
            fullWidth
            disabled={disabled} 
            onClick={() => onSelect(item)}
          >
            {disabled ? "교환 불가" : "교환하기"}
          </TossButton>
        </div>
      </TossCardContent>
    </TossCard>
  );
}

