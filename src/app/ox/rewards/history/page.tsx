"use client";

import { RewardHistoryTable } from "@/components/ox/rewards/RewardHistoryTable";

export default function RewardsHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">리워드 내역</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">교환 요청과 처리 상태를 확인하세요.</p>
      </div>
      <RewardHistoryTable />
    </div>
  );
}

