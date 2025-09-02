"use client";

import { usePredictionHistory } from "@/hooks/usePrediction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, Target } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Prediction,
  PredictionChoice,
  PredictionStatus,
} from "@/types/prediction";

function LoadingSpinner() {
  return (
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
  );
}

export function PredictionHistory() {
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePredictionHistory({ limit: 20 });

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
            예측 내역을 불러오는 중 오류가 발생했습니다.
          </div>
        </CardContent>
      </Card>
    );
  }

  const allPredictions =
    data?.pages.flatMap((page: Prediction[]) => page) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          예측 히스토리
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allPredictions.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              예측 내역이 없습니다.
            </div>
          ) : (
            <>
              {allPredictions.map((prediction) => (
                <div
                  key={prediction.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full p-2 ${
                        prediction.choice === PredictionChoice.UP
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      {prediction.choice === PredictionChoice.UP ? (
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {prediction.symbol}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(
                          new Date(prediction.submitted_at),
                          {
                            addSuffix: true,
                            locale: ko,
                          },
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          prediction.status === PredictionStatus.CORRECT
                            ? "default"
                            : prediction.status === PredictionStatus.INCORRECT
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {prediction.status === PredictionStatus.CORRECT
                          ? "정답"
                          : prediction.status === PredictionStatus.INCORRECT
                            ? "오답"
                            : "대기중"}
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {prediction.points_earned
                        ? `+${prediction.points_earned} 포인트`
                        : ""}
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
