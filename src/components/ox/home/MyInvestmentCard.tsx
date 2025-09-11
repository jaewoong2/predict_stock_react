"use client";

import { TossCard, TossCardContent } from "@/components/ui/toss-card";
import { TossStatCard } from "@/components/ui/toss-stat-card";
import { TossButton } from "@/components/ui/toss-button";
import { Coins, Target, Gift, Play, Zap } from "lucide-react";
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
    <div className="space-y-4">
      {/* 포인트 & 예측 상태 */}
      <TossCard variant="gradient" padding="lg" className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-white/5" />
        
        <TossCardContent className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">내 투자 현황</h2>
              <p className="text-sm text-gray-600">오늘의 예측으로 포인트를 획득하세요</p>
            </div>
            <Link href="/ox/points">
              <TossButton variant="ghost" size="sm">
                자세히
              </TossButton>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <TossStatCard
              title="보유 포인트"
              value={balance.toLocaleString()}
              subtitle="P"
              icon={<Coins className="h-5 w-5" />}
              variant="minimal"
              onClick={() => window.location.href = "/ox/points"}
            />
            <TossStatCard
              title="남은 예측"
              value={remainingPredictions}
              subtitle="회"
              icon={<Target className="h-5 w-5" />}
              variant="minimal"
              change={remainingPredictions > 0 ? {
                value: "사용 가능",
                type: "positive"
              } : {
                value: "충전 필요",
                type: "negative"
              }}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/ox/rewards" className="block">
              <TossButton variant="outline" fullWidth size="sm" className="h-12">
                <Gift className="h-4 w-4" />
                리워드
              </TossButton>
            </Link>
            <TossButton variant="secondary" fullWidth size="sm" className="h-12">
              <Play className="h-4 w-4" />
              광고 시청
            </TossButton>
          </div>

          {/* Bottom tip */}
          {remainingPredictions === 0 && (
            <div className="bg-white/50 rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span>광고 시청하면 예측 기회를 1회 추가할 수 있어요</span>
              </div>
            </div>
          )}
        </TossCardContent>
      </TossCard>
    </div>
  );
}
