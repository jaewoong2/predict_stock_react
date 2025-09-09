import { Suspense } from "react";
import { Metadata } from "next";
import { PointsPageClient } from "@/components/ox/points/points-page-client";
import { PointsPageServer } from "@/components/ox/points/points-page-server";

// export const metadata: Metadata = {
//   title: "포인트 관리 | O/X 예측",
//   description: "포인트 잔액 조회, 거래 내역 확인, 포인트 내보내기",
// };

function LoadingSpinner() {
  return (
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
  );
}

export default function PointsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          포인트 관리
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          포인트 잔액과 거래 내역을 확인하세요
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* SSR: 포인트 통계 및 기본 정보 */}
        <div className="lg:col-span-1">
          <Suspense fallback={<LoadingSpinner />}>
            <PointsPageServer />
          </Suspense>
        </div>

        {/* CSR: 실시간 포인트 관리 */}
        <div className="lg:col-span-2">
          <Suspense fallback={<LoadingSpinner />}>
            <PointsPageClient />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
