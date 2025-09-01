"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePredictionsForDay } from "@/hooks/usePrediction";
import { useTodaySession } from "@/hooks/useSession";
import {
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function DashboardPredictions() {
  const { data: session } = useTodaySession();
  const { data: predictions } = usePredictionsForDay(
    session?.session?.trading_day || new Date().toISOString().split("T")[0],
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CORRECT":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "INCORRECT":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CORRECT":
        return "text-green-500";
      case "INCORRECT":
        return "text-red-500";
      case "PENDING":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CORRECT":
        return "정답";
      case "INCORRECT":
        return "오답";
      case "PENDING":
        return "대기중";
      case "LOCKED":
        return "확정";
      case "VOID":
        return "무효";
      default:
        return "알 수 없음";
    }
  };

  const getChoiceIcon = (choice: string) => {
    switch (choice) {
      case "UP":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "DOWN":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>오늘의 예측</CardTitle>
            <CardDescription>오늘 제출한 예측 내역</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/ox/history">전체 보기</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {predictions && predictions.length > 0 ? (
          <div className="space-y-4">
            {predictions.slice(0, 5).map((prediction) => (
              <div
                key={prediction.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(prediction.status)}
                  <div>
                    <div className="font-medium">{prediction.symbol}</div>
                    <div className="text-muted-foreground text-sm">
                      {new Date(prediction.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {getChoiceIcon(prediction.choice)}
                    <span className="text-sm font-medium">
                      {prediction.choice === "UP" ? "상승" : "하락"}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getStatusColor(prediction.status))}
                  >
                    {getStatusText(prediction.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">
              아직 예측을 하지 않았습니다.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/ox/predict">예측하기</Link>
            </Button>
          </div>
        )}

        {predictions && predictions.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/ox/history">{predictions.length - 5}개 더 보기</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
