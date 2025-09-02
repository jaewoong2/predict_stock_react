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
import { useTodayUniverseWithPrices } from "@/hooks/useUniverse";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function DashboardUniverse() {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>오늘의 종목</CardTitle>
            <CardDescription>오늘 예측 가능한 종목 목록</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/ox/predict">전체 보기</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {universe?.symbols?.slice(0, 5).map((item) => (
            <div
              key={item.symbol}
              className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
            >
              <div className="flex items-center space-x-3">
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
              <div className="text-right">
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
            </div>
          ))}
        </div>

        {universe?.symbols && universe.symbols.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/ox/predict">
                {universe.symbols.length - 5}개 더 보기
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
