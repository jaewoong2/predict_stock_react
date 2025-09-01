import { userService } from "@/services/userService";
import { pointService } from "@/services/pointService";
import { UserProfileCard } from "./user-profile-card";
import { UserStatsCard } from "./user-stats-card";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_COOKIE_KEY } from "@/lib/cookies";

export async function ProfilePageServer() {
  // SSR 보호: 토큰이 없으면 홈으로 리다이렉트하며 로그인 모달 트리거
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_KEY)?.value;
  if (!token) {
    redirect("/?login=1");
  }
  try {
    // SSR: 사용자 프로필 및 포인트 정보 조회
    const [profile, balance] = await Promise.all([
      userService.getMyProfile(),
      pointService.getMyPointsBalance(),
    ]);

    return (
      <div className="space-y-6">
        {/* 사용자 프로필 카드 */}
        <UserProfileCard profile={profile} />

        {/* 사용자 통계 카드 */}
        {/* <UserStatsCard balance={balance} /> */}
      </div>
    );
  } catch (error) {
    console.error("프로필 데이터 로딩 실패:", error);
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">
            프로필 정보를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    );
  }
}
