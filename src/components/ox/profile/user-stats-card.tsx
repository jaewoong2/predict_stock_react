import { UserFinancialSummary } from "@/types/points";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Calendar, Coins } from "lucide-react";

interface UserStatsCardProps {
  balance: UserFinancialSummary;
}

export function UserStatsCard({ balance }: UserStatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          활동 통계
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400">
              <Coins className="h-4 w-4" />
              <span className="font-semibold">
                {balance.current_balance.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              현재 포인트
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
              <Award className="h-4 w-4" />
              <span className="font-semibold">
                {balance.points_earned_today.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              오늘 획득 포인트
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {balance.can_make_predictions ? "예측 가능" : "예측 불가"}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            예측 상태
          </div>
        </div>

        {balance.can_make_predictions && (
          <div className="flex justify-center">
            <Badge variant="success" className="text-xs">
              예측 가능
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
