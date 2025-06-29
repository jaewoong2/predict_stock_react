import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeeklyActionCount } from "@/hooks/useSignal";
import { GetWeeklyActionCountParams } from "@/types/signal";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { CardSkeleton } from "../ui/skeletons";

interface WeeklyActionCountCardProps {
  title: string;
  params: GetWeeklyActionCountParams;
}

export const WeeklyActionCountCard: FC<WeeklyActionCountCardProps> = ({
  title,
  params,
}) => {
  const { setParams } = useSignalSearchParams();

  const { data, isLoading, error } = useWeeklyActionCount(params, {
    select(data) {
      return {
        signals: data.signals
          .sort((a, b) => {
            if (a.count && b.count) {
              const aCount = a.count.reduce((sum, val) => sum + (val || 0), 0);
              const bCount = b.count.reduce((sum, val) => sum + (val || 0), 0);
              return bCount - aCount;
            }
            return 0;
          })
          .slice(0, 10),
      };
    },
  });

  const onClickTicker = (ticker: string) => {
    setParams({ signalId: `${ticker}_OPENAI` });
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
        {data?.signals && data.signals.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.signals.map(({ ticker, count }) => (
              <Badge
                key={ticker}
                variant="secondary"
                className="flex gap-2 hover:bg-green-100 cursor-pointer transition-colors"
                onClick={() => onClickTicker(ticker)}
              >
                <span>{ticker}</span>
                <span
                  className={cn(
                    "font-bold",
                    params.action === "Buy" ? "text-green-600" : "text-red-600"
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
