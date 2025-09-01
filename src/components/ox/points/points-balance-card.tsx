import { PointsBalanceResponse } from "@/types/points";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, TrendingDown } from "lucide-react";

interface PointsBalanceCardProps {
  balance: { balance: number };
}

export function PointsBalanceCard({ balance }: PointsBalanceCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          포인트 잔액
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {balance.balance.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            현재 보유 포인트
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
