"use client";

import { usePointsLedger } from "@/hooks/usePoints";
import { TossCard, TossCardContent } from "@/components/ui/toss-card";
import { TossButton } from "@/components/ui/toss-button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

function LoadingSpinner() {
  return (
    <TossCard padding="lg">
      <TossCardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </TossCardContent>
    </TossCard>
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
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <TossCard padding="lg">
        <TossCardContent>
          <div className="py-12 text-center">
            <div className="text-red-600 mb-2">
              거래 내역을 불러오는 중 오류가 발생했습니다.
            </div>
            <TossButton variant="outline" size="sm">
              다시 시도
            </TossButton>
          </div>
        </TossCardContent>
      </TossCard>
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
    <TossCard padding="lg">
      <TossCardContent>
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                거래 내역이 없습니다
              </h3>
              <p className="text-sm text-gray-500">
                예측을 통해 포인트를 획득해보세요
              </p>
            </div>
          ) : (
            <>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full p-2.5 ${
                        item.delta_points > 0
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {item.delta_points > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {item.reason}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
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
                      className={`font-bold text-sm ${
                        item.delta_points > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.delta_points > 0 ? "+" : ""}
                      {item.delta_points.toLocaleString()}P
                    </div>
                    <div className="text-xs text-gray-500">
                      잔액: {item.balance_after.toLocaleString()}P
                    </div>
                  </div>
                </div>
              ))}

              {hasNextPage && (
                <div className="flex justify-center pt-4">
                  <TossButton
                    variant="outline"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "로딩 중..." : "더 보기"}
                  </TossButton>
                </div>
              )}
            </>
          )}
        </div>
      </TossCardContent>
    </TossCard>
  );
}
