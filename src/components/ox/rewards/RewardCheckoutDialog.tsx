"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRewardExchange } from "@/hooks/useRewards";
import { usePointsBalance } from "@/hooks/usePoints";
import { RewardItem } from "@/types/rewards";

interface RewardCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: RewardItem;
  quantity: number;
  onCompleted?: () => void;
}

export function RewardCheckoutDialog({ open, onOpenChange, item, quantity, onCompleted }: RewardCheckoutDialogProps) {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const { data: points } = usePointsBalance();
  const { exchangeReward, isLoading, error } = useRewardExchange();

  const total = item.points_cost * quantity;
  const insufficient = (points?.balance ?? 0) < total;

  const handleSubmit = async () => {
    if (insufficient) return;
    try {
      await exchangeReward({
        reward_id: item.id,
        quantity,
        delivery_address: deliveryAddress || undefined,
        contact_phone: contactPhone || undefined,
        additional_notes: additionalNotes || undefined,
      });
      onCompleted?.();
    } catch (e) {
      // 에러는 상위 토스트에서 처리하거나 이곳에서 간단히 표시
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item.name} 교환</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>필요 포인트</Label>
              <div className="mt-1 rounded-md border p-2 text-sm">
                {total.toLocaleString()} P
              </div>
            </div>
            <div>
              <Label>내 잔액</Label>
              <div className="mt-1 rounded-md border p-2 text-sm">
                {(points?.balance ?? 0).toLocaleString()} P
              </div>
            </div>
          </div>

          {/* 물리/디지털 공통: 배송정보는 선택적 */}
          <div className="space-y-2">
            <Label htmlFor="address">배송지 (선택)</Label>
            <Input id="address" placeholder="도로명, 상세주소" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">연락처 (선택)</Label>
            <Input id="phone" placeholder="010-0000-0000" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">요청사항 (선택)</Label>
            <Input id="notes" placeholder="요청사항을 입력하세요" value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} />
          </div>

          {insufficient && (
            <div className="rounded-md border border-yellow-300 bg-yellow-50 p-2 text-sm text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-200">
              포인트가 부족합니다. 활동으로 포인트를 적립하거나 리워드를 조정하세요.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>취소</Button>
            <Button onClick={handleSubmit} disabled={isLoading || insufficient}>
              {isLoading ? "처리 중..." : "교환 요청"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

