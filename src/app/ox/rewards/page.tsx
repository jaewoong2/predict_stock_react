"use client";

import { RewardCatalogGrid } from "@/components/ox/rewards/RewardCatalogGrid";

export default function RewardsCatalogPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">리워드 카탈로그</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">포인트로 교환 가능한 리워드를 확인하세요.</p>
      </div>
      <RewardCatalogGrid />
    </div>
  );
}

