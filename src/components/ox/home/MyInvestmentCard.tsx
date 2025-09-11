"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { usePointsBalance } from "@/hooks/usePoints";
import { useTodaySession } from "@/hooks/useSession";
import { useRemainingPredictions } from "@/hooks/usePrediction";
import Link from "next/link";

export function MyInvestmentCard() {
  const { data: points } = usePointsBalance();
  const { data: today } = useTodaySession();
  const tradingDay = today?.session?.trading_day ?? "";
  const { data: remaining } = useRemainingPredictions(tradingDay);

  const balance = points?.balance ?? 0;
  const remainingPredictions = typeof remaining === "number" ? remaining : 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">내 포인트</div>
          <Link href="/ox/points" className="text-xs text-gray-400">자세히</Link>
        </div>
        <div className="mb-1 flex items-end justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span>{balance.toLocaleString()} P</span>
          </div>
          <div className="text-right text-sm">
            <div className="text-gray-500 dark:text-gray-400">남은 예측 수</div>
            <div className="font-semibold">{remainingPredictions}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div>예측 기회가 부족하면 광고 시청으로 +1</div>
          <Link href="/ox/rewards" className="text-blue-600 dark:text-blue-400">리워드</Link>
        </div>
      </CardContent>
    </Card>
  );
}
