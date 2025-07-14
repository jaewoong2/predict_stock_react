"use client";
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { CardSkeleton } from "../ui/skeletons";
import { useSignalDataByNameAndDate } from "@/hooks/useSignal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SignalAPIResponse } from "@/types/signal";
import Link from "next/link";

const RecommendationByAiCard: FC<{
  title: string;
  data?: SignalAPIResponse;
  pageSize?: number;
}> = ({ title, data: initialData, pageSize = 10 }) => {
  const { date } = useSignalSearchParams();
  const [page, setPage] = React.useState(initialData?.pagination.page ?? 1);

  const { data, isLoading, error } = useSignalDataByNameAndDate(
    [],
    date ? date : format(new Date(), "yyyy-MM-dd"),
    "AI_GENERATED",
    page,
    pageSize,
    {
      initialData,
      keepPreviousData: true,
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
        {data.data.length === 0 ? (
          <p className="text-muted-foreground">
            해당 추천 유형의 종목이 없습니다.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.data.map(
              ({ signal: item }, index) =>
                item.action === "buy" && (
                  <Link
                    key={item.ticker + item.ai_model + item.timestamp + index}
                    href={`/dashboard/d/${item.ticker}?model=${item.ai_model || "OPENAI"}&strategy_type=AI_GENERATED&date=${date}`}
                  >
                    <Badge
                      variant={"secondary"}
                      className="cursor-pointer rounded-md border px-3 transition-colors hover:bg-green-100"
                    >
                      <h3 className="text-xs">{item.ticker}</h3>
                    </Badge>
                  </Link>
                ),
            )}
          </div>
        )}
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="text-sm text-muted-foreground">
            {(() => {
              const total = data.pagination.total_items;
              const start = (page - 1) * pageSize + 1;
              const end = Math.min(page * pageSize, total);
              return `${start}-${end} / ${total}`;
            })()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!data.pagination.has_previous}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!data.pagination.has_next}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationByAiCard;
