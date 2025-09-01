"use client";

import { usePointsLedger } from "@/hooks/usePoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

function LoadingSpinner() {
  return (
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
  );
}

interface PointsLedgerListProps {
  filterType: string;
}

export function PointsLedgerList({ filterType }: PointsLedgerListProps) {
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePointsLedger({ limit: 20 });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-red-600 dark:text-red-400">
            거래 내역을 불러오는 중 오류가 발생했습니다.
          </div>
        </CardContent>
      </Card>
    );
  }

  const allItems = data?.pages.flatMap((page) => page.entries) || [];
  const filteredItems =
    filterType === "all"
      ? allItems
      : allItems.filter((item) =>
          filterType === "earned"
            ? item.delta_points > 0
            : item.delta_points < 0,
        );

  return (
    <Card>
      <CardHeader>
        <CardTitle>거래 내역</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              거래 내역이 없습니다.
            </div>
          ) : (
            <>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full p-2 ${
                        item.delta_points > 0
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      {item.delta_points > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.reason}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(item.created_at), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-semibold ${
                        item.delta_points > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {item.delta_points > 0 ? "+" : ""}
                      {item.delta_points.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      잔액: {item.balance_after.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}

              {hasNextPage && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {isFetchingNextPage ? "로딩 중..." : "더 보기"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
