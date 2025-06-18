import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewsRecommendations } from "@/hooks/useMarketNews";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";

const RecommendationCard: FC<{
  title: string;
  recommendation: "Buy" | "Hold" | "Sell";
  badgeColor: string;
}> = ({ title, recommendation, badgeColor }) => {
  const { setParams, date } = useSignalSearchParams();
  const { data, isLoading, error } = useNewsRecommendations({
    recommendation,
    limit: 5,
    date: format(new Date(date ?? new Date()), "yyyy-MM-dd"),
  });

  const onClickTicker = (ticker: string) => {
    setParams({ signalId: `${ticker}_OPENAI` });
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <Badge className={badgeColor}>{recommendation.toUpperCase()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin h-8 w-8" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <Badge className={badgeColor}>{recommendation.toUpperCase()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">데이터 로딩 중 오류가 발생했습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-none w-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge className={badgeColor}>{recommendation.toUpperCase()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.results.length === 0 ? (
          <p className="text-muted-foreground">
            해당 추천 유형의 종목이 없습니다.
          </p>
        ) : (
          <div className="flex gap-2">
            {data.results.map((item) => (
              <Badge
                key={item.ticker}
                variant={"outline"}
                className="border rounded-md p-3 cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => onClickTicker(item.ticker)}
              >
                <h3 className="text-xs">{item.ticker}</h3>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
