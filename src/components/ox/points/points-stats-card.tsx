import { UserFinancialSummary } from "@/types/points";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Target, Award, Calendar } from "lucide-react";

interface PointsStatsCardProps {
  stats: UserFinancialSummary;
}

export function PointsStatsCard({ stats }: PointsStatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          포인트 통계
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400">
              <Target className="h-4 w-4" />
              <span className="font-semibold">
                {stats.can_make_predictions ? "가능" : "불가"}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              예측 가능 여부
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
              <Award className="h-4 w-4" />
              <span className="font-semibold">
                {stats.points_earned_today.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              오늘 획득 포인트
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.current_balance.toLocaleString()}P
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            현재 포인트
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400">
            <Calendar className="h-4 w-4" />
            <span className="font-semibold">
              {new Date(stats.summary_date).toLocaleDateString()}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            통계 기준일
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
