import { pointService } from "@/services/pointService";
import { PointsBalanceCard } from "./points-balance-card";
import { PointsStatsCard } from "./points-stats-card";

export async function PointsPageServer() {
  try {
    // SSR: 포인트 잔액 및 통계 조회
    const [balance, stats] = await Promise.all([
      pointService.getPointsBalance(),
      pointService.getMyFinancialSummary(),
    ]);

    return (
      <div className="space-y-6">
        {/* 포인트 잔액 카드 */}
        <PointsBalanceCard balance={balance} />

        {/* 포인트 통계 카드 */}
        <PointsStatsCard stats={stats as any} />
      </div>
    );
  } catch (error) {
    console.error("포인트 데이터 로딩 실패:", error);
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">
            포인트 정보를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    );
  }
}
