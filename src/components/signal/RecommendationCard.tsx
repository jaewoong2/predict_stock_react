import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewsRecommendations } from "@/hooks/useMarketNews";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useSignalDataByNameAndDate } from "@/hooks/useSignal";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";

const RecommendationCard: FC<{
  title: string;
  recommendation: "Buy" | "Hold" | "Sell";
  badgeColor: string;
}> = ({ title, recommendation, badgeColor }) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const { setParams, date } = useSignalSearchParams();
  const { data, isLoading, error } = useNewsRecommendations({
    recommendation,
    limit: 5,
    date: format(new Date(date ?? new Date()), "yyyy-MM-dd"),
  });

  const signalData = useSignalDataByNameAndDate(
    data?.results.map((item) => item.ticker) || [],
    today
  );
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
    <Card className="h-full shadow-none">
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
          <div className="space-y-4">
            {data.results.map((item) => (
              <div
                key={item.ticker}
                className="border rounded-md p-3 cursor-pointer"
                onClick={() => onClickTicker(item.ticker)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{item.ticker}</h3>
                  {signalData.isLoading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    signalData?.data?.signals?.find(
                      (signal) => signal.signal.ticker === item.ticker
                    ) && (
                      <Badge
                        className={
                          signalData?.data?.signals?.find(
                            (signal) => signal.signal.ticker === item.ticker
                          )?.signal
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {signalData?.data?.signals?.find(
                          (signal) => signal.signal.ticker === item.ticker
                        )?.signal
                          ? "상승예상"
                          : "하락예상"}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const RecommendationsDashboard: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <RecommendationCard
        title="호재가 많은 종목"
        recommendation="Buy"
        badgeColor="bg-green-100 text-green-800"
      />
      <RecommendationCard
        title="관망 중인 종목"
        recommendation="Hold"
        badgeColor="bg-yellow-100 text-yellow-800"
      />
      <RecommendationCard
        title="악재가 많은 종목"
        recommendation="Sell"
        badgeColor="bg-red-100 text-red-800"
      />
    </div>
  );
};
