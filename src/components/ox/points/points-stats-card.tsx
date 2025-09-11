import { UserFinancialSummary } from "@/types/points";
import { TossCard, TossCardContent, TossCardHeader, TossCardTitle } from "@/components/ui/toss-card";
import { TossStatCard } from "@/components/ui/toss-stat-card";
import { BarChart3, Target, Award, Calendar } from "lucide-react";

interface PointsStatsCardProps {
  stats: UserFinancialSummary;
}

export function PointsStatsCard({ stats }: PointsStatsCardProps) {
  return (
    <TossCard padding="lg">
      <TossCardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <TossCardTitle>포인트 통계</TossCardTitle>
        </div>
      </TossCardHeader>
      <TossCardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <TossStatCard
            title="예측 가능"
            value={stats.can_make_predictions ? "가능" : "불가"}
            icon={<Target className="h-4 w-4" />}
            variant="minimal"
            change={stats.can_make_predictions ? {
              value: "활성",
              type: "positive"
            } : {
              value: "비활성",
              type: "negative"
            }}
          />
          <TossStatCard
            title="오늘 획득"
            value={stats.points_earned_today.toLocaleString()}
            subtitle="P"
            icon={<Award className="h-4 w-4" />}
            variant="minimal"
          />
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="text-lg font-bold text-gray-900 mb-1">
            {stats.current_balance.toLocaleString()}P
          </div>
          <div className="text-sm text-gray-600">
            현재 포인트 잔액
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">
              {new Date(stats.summary_date).toLocaleDateString()}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            통계 기준일
          </div>
        </div>
      </TossCardContent>
    </TossCard>
  );
}
