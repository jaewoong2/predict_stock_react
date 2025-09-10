"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RewardItem } from "@/types/rewards";
import { RewardCheckoutDialog } from "./RewardCheckoutDialog";
import { Badge } from "@/components/ui/badge";

interface RewardDetailSheetProps {
  item: RewardItem | null;
  onOpenChange: (open: boolean) => void;
}

export function RewardDetailSheet({ item, onOpenChange }: RewardDetailSheetProps) {
  const [qty, setQty] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const open = !!item;
  const totalCost = useMemo(() => (item ? item.points_cost * qty : 0), [item, qty]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{item?.name ?? "리워드"}</span>
            {!item?.is_available && <Badge variant="outline">품절</Badge>}
          </DialogTitle>
        </DialogHeader>
        {item && (
          <div className="mt-4 space-y-6">
            {/* Image */}
            {item.image_url ? (
              <div className="relative h-48 w-full overflow-hidden rounded-md bg-gray-50 dark:bg-gray-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
              </div>
            ) : null}

            {/* Description */}
            <div>
              <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {item.description}
              </p>
            </div>

            {/* Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qty">수량</Label>
                <Input
                  id="qty"
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div className="space-y-2">
                <Label>예상 차감 포인트</Label>
                <div className="rounded-md border p-2 text-sm font-semibold">
                  {totalCost.toLocaleString()} P
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>닫기</Button>
              <Button disabled={!item.is_available} onClick={() => setCheckoutOpen(true)}>
                교환 진행
              </Button>
            </div>

            <RewardCheckoutDialog
              open={checkoutOpen}
              onOpenChange={setCheckoutOpen}
              item={item}
              quantity={qty}
              onCompleted={() => {
                setCheckoutOpen(false);
                onOpenChange(false);
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
