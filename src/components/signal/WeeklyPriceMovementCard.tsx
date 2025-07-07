"use client";
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeeklyPriceMovement } from "@/hooks/useTicker";
import { GetWeeklyPriceMovementParams, WeeklyPriceMovementResponse } from "@/types/ticker";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CardSkeleton } from "../ui/skeletons";

interface WeeklyPriceMovementCardProps {
  title: string;
  params: GetWeeklyPriceMovementParams;
  data?: WeeklyPriceMovementResponse;
}

export const WeeklyPriceMovementCard: FC<WeeklyPriceMovementCardProps> = ({
  title,
  params,
  data: initialData,
}) => {
  const router = useRouter();

  const { data, isLoading, error } = useWeeklyPriceMovement(params, {
    select(data) {
      return {
        tickers: data.tickers
          .sort((a, b) => {
            const aSum = a.count.reduce((sum, val) => sum + (val || 0), 0);
            const bSum = b.count.reduce((sum, val) => sum + (val || 0), 0);
            return bSum - aSum;
          })
          .slice(0, 10),
      };
    },
    initialData,
    enabled: !initialData,
  });

  const onClickTicker = (ticker: string) => {
    router.push(`/dashboard/d/${ticker}?model=OPENAI`);
  };

  if (isLoading) {
    return (
      <CardSkeleton
        titleHeight={6}
        cardClassName="shadow-none"
        contentHeight={24}
      />
    );
  }

  if (error) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">데이터 로딩 오류</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-medium">
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data?.tickers && data.tickers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.tickers.map(({ ticker, count }) => (
              <Badge
                key={ticker + count.join("-")}
                variant="secondary"
                className="flex cursor-pointer gap-2 transition-colors hover:bg-green-100"
                onClick={() => onClickTicker(ticker)}
              >
                <span>{ticker}</span>
                <span
                  className={cn(
                    "font-bold",
                    params.direction === "up"
                      ? "text-green-600"
                      : "text-red-600",
                  )}
                >
                  {count.reduce((sum, val) => sum + (val || 0), 0)}
                </span>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">데이터가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
};
