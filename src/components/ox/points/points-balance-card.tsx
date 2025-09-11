import { PointsBalanceResponse } from "@/types/points";
import { TossCard, TossCardContent } from "@/components/ui/toss-card";
import { Coins } from "lucide-react";

interface PointsBalanceCardProps {
  balance: { balance: number };
}

export function PointsBalanceCard({ balance }: PointsBalanceCardProps) {
  return (
    <TossCard variant="gradient" padding="lg" className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-white/5" />
      
      <TossCardContent className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Coins className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <div>
          <div className="text-3xl font-bold text-white mb-1">
            {balance.balance.toLocaleString()}
          </div>
          <div className="text-sm text-white/80">
            현재 보유 포인트
          </div>
        </div>
      </TossCardContent>
    </TossCard>
  );
}
