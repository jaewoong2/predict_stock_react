import { Suspense } from "react";
import { Metadata } from "next";
import { ProfilePageClient } from "@/components/ox/profile/profile-page-client";
import { ProfilePageServer } from "@/components/ox/profile/profile-page-server";
import { MobileTabBar } from "@/components/ox/home/MobileTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Settings } from "lucide-react";

// export const metadata: Metadata = {
//   title: "프로필 관리 | O/X 예측",
//   description: "프로필 정보 수정, 계정 설정, 활동 내역 확인",
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

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-md px-4 py-6 md:max-w-xl">
        {/* Page Header with Toss style */}
        <div className="text-center space-y-3 mb-6">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">프로필 관리</h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            프로필 정보와 계정 설정을 관리하세요
          </p>
        </div>

        <div className="space-y-6 pb-20">
          {/* SSR: 사용자 정보 및 재정 요약 */}
          <Suspense fallback={<LoadingSpinner />}>
            <ProfilePageServer />
          </Suspense>

          {/* CSR: 프로필 수정 및 설정 변경 */}
          <Suspense fallback={<LoadingSpinner />}>
            <ProfilePageClient />
          </Suspense>
        </div>
      </div>
      
      {/* Fixed Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
}
