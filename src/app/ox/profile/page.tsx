import { Suspense } from "react";
import { Metadata } from "next";
import { ProfilePageClient } from "@/components/ox/profile/profile-page-client";
import { ProfilePageServer } from "@/components/ox/profile/profile-page-server";
import { Loader2Icon } from "lucide-react";

// export const metadata: Metadata = {
//   title: "프로필 관리 | O/X 예측",
//   description: "프로필 정보 수정, 계정 설정, 활동 내역 확인",
// };

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-8">
      <Loader2Icon className="h-6 w-6 animate-spin" />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          프로필 관리
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          프로필 정보와 계정 설정을 관리하세요
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* SSR: 사용자 정보 및 재정 요약 */}
        <div className="lg:col-span-1">
          <Suspense fallback={<LoadingSpinner />}>
            <ProfilePageServer />
          </Suspense>
        </div>

        {/* CSR: 프로필 수정 및 설정 변경 */}
        <div className="lg:col-span-2">
          <Suspense fallback={<LoadingSpinner />}>
            <ProfilePageClient />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
