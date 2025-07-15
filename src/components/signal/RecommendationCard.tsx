"use client";
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewsRecommendations } from "@/hooks/useMarketNews";
import { NewsRecommendationsResponse } from "@/types/news";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { useRouter } from "next/navigation";
import { CardSkeleton } from "../ui/skeletons";
import Link from "next/link";

const RecommendationCard: FC<{
  title: string;
  recommendation: "Buy" | "Hold" | "Sell";
  badgeColor: string;
  data?: NewsRecommendationsResponse;
}> = ({ title, recommendation, badgeColor, data: initialData }) => {
  const { date } = useSignalSearchParams();
  const { data, isLoading, error } = useNewsRecommendations(
    {
      recommendation,
      limit: 10,
      date: date ? date : format(new Date(), "yyyy-MM-dd"),
    },
    {
      initialData,
      enabled: !initialData,
    },
  );

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
    <Card className="h-full w-fit shadow-none max-md:w-full">
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
          <div className="flex flex-wrap gap-2">
            {data.results.map((item) => (
              <Link
                href={`/dashboard/d/${item.ticker}?model=OPENAI&date=${date}`}
                key={item.ticker + date}
              >
                <Badge
                  variant={"secondary"}
                  className="cursor-pointer rounded-md border px-3 transition-colors hover:bg-green-100"
                >
                  <h3 className="text-xs">{item.ticker}</h3>
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
