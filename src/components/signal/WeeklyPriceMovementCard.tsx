import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeeklyPriceMovement } from "@/hooks/useTicker";
import { GetWeeklyPriceMovementParams } from "@/types/ticker";
import { Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface WeeklyPriceMovementCardProps {
  title: string;
  params: GetWeeklyPriceMovementParams;
}

export const WeeklyPriceMovementCard: FC<WeeklyPriceMovementCardProps> = ({
  title,
  params,
}) => {
  const { data, isLoading, error } = useWeeklyPriceMovement(params);

  const badgeColor =
    params.direction === "up"
      ? "bg-green-500 text-white"
      : "bg-red-500 text-white";

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            <span>{title}</span>
            <Badge className={badgeColor}>{params.direction}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-24">
          <Loader2 className="animate-spin h-8 w-8" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">데이터 로딩 오류</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span>{title}</span>
          <Badge className={badgeColor}>{params.direction}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data?.tickers && data.tickers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.tickers.map(({ ticker, count }) => (
              <Badge key={ticker} variant="secondary" className="flex gap-2">
                <span>{ticker}</span>
                <span
                  className={cn(
                    "font-bold",
                    params.direction === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {count}
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
