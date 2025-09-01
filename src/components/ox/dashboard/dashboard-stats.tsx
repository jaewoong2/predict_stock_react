"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMyPointsBalance } from "@/hooks/usePoints";
import { useTodaySession } from "@/hooks/useSession";
import { usePredictionStats } from "@/hooks/usePrediction";
import { useRemainingPredictions } from "@/hooks/usePrediction";
import {
  Coins,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardStats() {
  const { data: pointsBalance } = useMyPointsBalance();
  const { data: session } = useTodaySession();
  const { data: predictionStats } = usePredictionStats();
  const { data: remainingPredictions } = useRemainingPredictions(
    session?.session.trading_day || new Date().toISOString().split("T")[0],
  );

  const stats = [
    {
      title: "포인트 잔액",
      value: pointsBalance?.balance?.toLocaleString() || "0",
      description: "현재 보유 포인트",
      icon: Coins,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "예측 정확도",
      value: predictionStats?.accuracy_percentage
        ? `${predictionStats.accuracy_percentage.toFixed(1)}%`
        : "0%",
      description: "전체 예측 정확도",
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "남은 예측",
      value: remainingPredictions?.toString() || "0",
      description: "오늘 남은 예측 횟수",
      icon: Clock,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "세션 상태",
      value: session?.session.status === "OPEN" ? "예측 가능" : "예측 마감",
      description: "현재 세션 상태",
      icon: session?.session.status === "OPEN" ? CheckCircle : XCircle,
      color:
        session?.session.status === "OPEN" ? "text-green-500" : "text-red-500",
      bgColor:
        session?.session.status === "OPEN"
          ? "bg-green-500/10"
          : "bg-red-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={cn("rounded-lg p-2", stat.bgColor)}>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-muted-foreground text-xs">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
