import { Suspense } from "react";
import { Metadata } from "next";
import { PointsPageClient } from "@/components/ox/points/points-page-client";
import { PointsPageServer } from "@/components/ox/points/points-page-server";
import { MobileTabBar } from "@/components/ox/home/MobileTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, TrendingUp } from "lucide-react";

// export const metadata: Metadata = {
//   title: "포인트 관리 | O/X 예측",
//   description: "포인트 잔액 조회, 거래 내역 확인, 포인트 내보내기",
// };

function LoadingSpinner() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function PointsPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-md px-4 py-6 md:max-w-xl">
        {/* Page Header with Toss style */}
        <div className="mb-6 space-y-3 text-center">
          <div className="flex justify-center">
            <div className="rounded-2xl bg-green-100 p-3">
              <Coins className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">포인트 관리</h1>
          <p className="mx-auto max-w-md text-sm text-gray-600">
            포인트 잔액과 거래 내역을 확인하세요
          </p>
        </div>

        <div className="space-y-6 pb-20">
          {/* SSR: 포인트 통계 및 기본 정보 */}
          <Suspense fallback={<LoadingSpinner />}>
            <PointsPageServer />
          </Suspense>

          {/* CSR: 실시간 포인트 관리 */}
          <Suspense fallback={<LoadingSpinner />}>
            <PointsPageClient />
          </Suspense>
        </div>
      </div>

      {/* Fixed Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
}
