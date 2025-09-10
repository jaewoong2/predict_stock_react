"use client";

import { useAvailableSlots } from "@/hooks/useAds";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function CooldownStatusCard() {
  const { data, isLoading, error } = useAvailableSlots();

  const total = data?.total_slots ?? 0;
  const used = data?.used_slots ?? 0;
  const available = data?.available_slots ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>슬롯/쿨다운 상태</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">불러오는 중...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-600 dark:text-red-400">상태를 불러오지 못했습니다.</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>사용 {used}/{total}</span>
              <span>남은 {available}</span>
            </div>
            <Progress value={total ? (used / total) * 100 : 0} />

            <div className="space-y-2 text-sm">
              {(data?.slots ?? []).slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-md border p-2">
                  <span>슬롯 #{s.id}</span>
                  {s.is_available ? (
                    <span className="text-green-600 dark:text-green-400">사용 가능</span>
                  ) : s.next_available_at ? (
                    <span className="text-gray-500 dark:text-gray-400">{new Date(s.next_available_at).toLocaleTimeString()}</span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">잠김</span>
                  )}
                </div>
              ))}
              {(data?.slots?.length ?? 0) > 5 && (
                <div className="text-xs text-gray-400">...총 {data?.slots?.length}개 슬롯 표시 중</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

