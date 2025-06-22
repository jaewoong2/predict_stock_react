import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewsRecommendations } from "@/hooks/useMarketNews";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { CardSkeleton } from "../ui/skeletons";

const RecommendationCard: FC<{
  title: string;
  recommendation: "Buy" | "Hold" | "Sell";
  badgeColor: string;
}> = ({ title, recommendation, badgeColor }) => {
  const { setParams, date } = useSignalSearchParams();
  const { data, isLoading, error } = useNewsRecommendations({
    recommendation,
    limit: 10,
    date: date ? date : format(new Date(), "yyyy-MM-dd"),
  });

  const onClickTicker = (ticker: string) => {
    setParams({ signalId: `${ticker}_OPENAI` });
  };

  if (isLoading) {
    return (
      <CardSkeleton
        titleHeight={6}
        cardClassName="shadow-none h-full"
        contentHeight={24}
        withBadge={true}
      />
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
    <Card className="h-full shadow-none w-fit max-md:w-full">
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
          <div className="gap-2 flex flex-wrap">
            {data.results.map((item) => (
              <Badge
                key={item.ticker}
                variant={"secondary"}
                className="border rounded-md px-3 cursor-pointer hover:bg-green-100 transition-colors"
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
