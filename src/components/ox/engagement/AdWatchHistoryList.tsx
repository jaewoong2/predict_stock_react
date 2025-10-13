"use client";

import { useAdWatchHistory, useTodayAdWatchCount } from "@/hooks/useAds";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Film } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function AdWatchHistoryList() {
  const { data, isLoading, error } = useAdWatchHistory({
    limit: 20,
    offset: 0,
  });
  const { data: today } = useTodayAdWatchCount();

  const items = data?.items ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>광고 시청 내역</span>
          {today && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              오늘 {today.count}/{today.limit}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            불러오는 중...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-600 dark:text-red-400">
            내역을 불러오지 못했습니다.
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            광고 시청 내역이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
                    <Film className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{h.ad_provider}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {h.ad_unit_id}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="flex items-center justify-end gap-2 text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(h.watched_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </div>
                  {h.points_earned ? (
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      +{h.points_earned}P
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
