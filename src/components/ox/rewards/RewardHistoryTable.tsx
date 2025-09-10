"use client";

import { useMyRedemptions } from "@/hooks/useRewards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RewardStatusChip } from "./RewardStatusChip";
import { Button } from "@/components/ui/button";

export function RewardHistoryTable() {
  const { data, isLoading, error } = useMyRedemptions({ limit: 20, offset: 0 });
  const items = data?.history ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>리워드 교환 내역</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">불러오는 중...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-600 dark:text-red-400">내역을 불러오지 못했습니다.</div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">교환 내역이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b bg-gray-50 text-left dark:bg-gray-900">
                <tr>
                  <th className="px-3 py-2">리워드</th>
                  <th className="px-3 py-2">수량</th>
                  <th className="px-3 py-2">포인트</th>
                  <th className="px-3 py-2">상태</th>
                  <th className="px-3 py-2">요청일</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="px-3 py-2">{r.reward_name}</td>
                    <td className="px-3 py-2">{r.quantity}</td>
                    <td className="px-3 py-2">{r.points_spent.toLocaleString()} P</td>
                    <td className="px-3 py-2"><RewardStatusChip status={r.status} /></td>
                    <td className="px-3 py-2">{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

