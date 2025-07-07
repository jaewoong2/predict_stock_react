"use client";
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { useRouter } from "next/navigation";
import { CardSkeleton } from "../ui/skeletons";
import { useSignalDataByNameAndDate } from "@/hooks/useSignal";
import { SignalAPIResponse } from "@/types/signal";

const RecommendationByAiCard: FC<{
  title: string;
  data?: SignalAPIResponse;
}> = ({ title, data: initialData }) => {
  const { date } = useSignalSearchParams();
  const router = useRouter();
  const { data, isLoading, error } = useSignalDataByNameAndDate(
    [],
    date ? date : format(new Date(), "yyyy-MM-dd"),
    "AI_GENERATED",
  );

  const onClickTicker = (ticker: string, model: string) => {
    router.push(`/dashboard/d/${ticker}?model=${model}&strategy_type=AI_GENERATED`);
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.signals.length === 0 ? (
          <p className="text-muted-foreground">
            해당 추천 유형의 종목이 없습니다.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.signals.map(
              ({ signal: item }, index) =>
                item.action === "buy" && (
                  <Badge
                    key={item.ticker + item.ai_model + item.timestamp + index}
                    variant={"secondary"}
                    className="cursor-pointer rounded-md border px-3 transition-colors hover:bg-green-100"
                    onClick={() =>
                      onClickTicker(item.ticker, item.ai_model || "OPENAI")
                    }
                  >
                    <h3 className="text-xs">{item.ticker}</h3>
                  </Badge>
                ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationByAiCard;
