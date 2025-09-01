"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTodayUniverseWithPrices } from "@/hooks/useUniverse";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function UniverseList() {
  const { data: universe } = useTodayUniverseWithPrices();

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

  const handlePrediction = (symbol: string, direction: "UP" | "DOWN") => {
    // TODO: 예측 로직 구현
    console.log(`Predicting ${symbol} will go ${direction}`);
  };

  if (!universe?.symbols) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>오늘의 종목</CardTitle>
          <CardDescription>오늘 예측 가능한 종목 목록</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">
            종목 정보를 불러오는 중...
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

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                  onClick={() => handlePrediction(item.symbol, "UP")}
                >
                  상승 ⬆️
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  onClick={() => handlePrediction(item.symbol, "DOWN")}
                >
                  하락 ⬇️
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
