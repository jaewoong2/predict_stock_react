"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTodayUniverseWithPrices } from "@/hooks/useUniverse";
import { TrendingUp, TrendingDown, Minus, Loader2Icon } from "lucide-react";
import { PredictActionBar } from "@/components/atomic/molecules/PredictActionBar";
import { cn } from "@/lib/utils";

export function UniverseList() {
  const { data: universe, isLoading } = useTodayUniverseWithPrices();

  const getChangeIcon = (changeDirection: string) => {
    switch (changeDirection) {
      case "UP":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "DOWN":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChangeColor = (changeDirection: string) => {
    switch (changeDirection) {
      case "UP":
        return "text-green-500";
      case "DOWN":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>오늘의 종목</CardTitle>
          <CardDescription>오늘 예측 가능한 종목 목록</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex flex-col items-center justify-center">
            <span className="ml-2">오늘 예측 가능한 종목을 불러오는 중...</span>
            <Loader2Icon className="mt-2 h-4 w-4 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!universe?.symbols) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>오늘의 종목</CardTitle>
          <CardDescription>오늘 예측 가능한 종목 목록</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center justify-center">
            오늘 예측 가능한 종목이 없습니다.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>오늘의 종목 ({universe.symbols.length}개)</CardTitle>
        <CardDescription>오늘 예측 가능한 종목 목록</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {universe.symbols.map((item) => (
            <div
              key={item.symbol}
              className="rounded-lg border p-4 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getChangeIcon(item.change_direction)}
                  <div>
                    <div className="font-medium">{item.symbol}</div>
                    <div className="text-muted-foreground text-sm">
                      {item.company_name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3 space-y-1">
                <div className="font-medium">
                  ₩{item.current_price?.toLocaleString()}
                </div>
                <div
                  className={cn(
                    "text-sm",
                    getChangeColor(item.change_direction),
                  )}
                >
                  {item.change_percent > 0 ? "+" : ""}
                  {item.change_percent?.toFixed(2)}%
                </div>
              </div>

              <PredictActionBar symbol={item.symbol} size="sm" variant="outline" showCancel />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
