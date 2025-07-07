"use client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// This file originally duplicated the content of `SignalDetailView` which
// renders inside a `Drawer`. The content has been extracted so that it can be
// reused both in a modal and in a standalone page.
import { format } from "date-fns";
import { useMarketNewsSummary } from "@/hooks/useMarketNews";
import { MarketNewsCarousel } from "../news/MarketNewsCarousel";
import { cn } from "@/lib/utils";
import {
  useSignalDataByNameAndDate,
  useWeeklyActionCount,
} from "@/hooks/useSignal";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AiModelSelect } from "./AiModelSelect";
import { Progress } from "../ui/progress";
import { useWeeklyPriceMovement } from "@/hooks/useTicker";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import useMounted from "@/hooks/useMounted";

interface SignalDetailContentProps {
  symbol: string;
  aiModel: string;
  date?: string;
}

const formatDate = (
  dateString: string | null | undefined,
  includeTime = false,
) => {
  if (!dateString) return "N/A";
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    if (includeTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
      options.second = "2-digit";
    }
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  } catch (error) {
    console.error("Invalid date format:", dateString, error);
    return dateString;
  }
};

const formatCurrency = (amount: number | undefined | null) => {
  if (amount == null) return "N/A"; // undefined와 null 모두 체크
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // 필요시 변경
  }).format(amount);
};

export const SignalDetailContent: React.FC<SignalDetailContentProps> = ({
  symbol,
  aiModel,
  date,
}) => {
  const router = useRouter();
  const { strategy_type } = useSignalSearchParams();

  const signals = useSignalDataByNameAndDate(
    [symbol],
    date ?? new Date().toISOString().split("T")[0],
    strategy_type,
  );

  const data = useMemo(() => {
    return signals.data?.signals.find(
      (value) =>
        value.signal.ai_model === aiModel && value.signal.ticker === symbol,
    );
  }, [aiModel, signals.data?.signals, symbol]);


  const { data: marketNews } = useMarketNewsSummary({
    news_type: "ticker",
    ticker: data?.signal.ticker,
    news_date: date,
  });

  const priceMovement = useWeeklyPriceMovement(
    { direction: "up", reference_date: date, tickers: data?.signal.ticker },
    {
      enabled: !!data?.signal.ticker && !!date,
    },
  );

  const weeklySignalData = useWeeklyActionCount(
    {
      action: "Buy",
      tickers: data?.signal.ticker,
      reference_date: date,
    },
    {
      enabled: !!data?.signal.ticker && !!date,
    },
  );

  const mounted = useMounted();

  if (!data || !mounted) {
    return null;
  }

  const confidenceLevel = data.signal.chart_pattern?.confidence_level
    ? data.signal.chart_pattern?.confidence_level > 1
      ? data.signal.chart_pattern.confidence_level * 0.01
      : data.signal.chart_pattern?.confidence_level
    : 0;

  return (
    <div className="mx-auto w-full max-w-4xl pb-10 select-text">
      <div className="mx-auto h-full w-full max-w-4xl overflow-y-scroll px-8 max-sm:px-1">
        <div className="px-0 mb-4">
          <button
            className="absolute right-4 top-4 cursor-pointer text-3xl"
            onClick={() => router.back()}
          >
            &times;
          </button>
          {marketNews?.result && (
            <div className="px-0 pb-4">
              <MarketNewsCarousel items={marketNews?.result} />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="m-0 p-0 text-left text-2xl">
                {data.signal.ticker}
              </h2>
              <span className="text-muted-foreground text-sm font-light">
                {data.signal.timestamp &&
                  format(data.signal.timestamp, "yyyy년 MM월 dd일")}
              </span>
            </div>
            {data.signal.action && (
              <Badge
                className={cn(
                  "px-3 py-1 text-xs",
                  data.signal.action.toLowerCase() === "buy"
                    ? "bg-green-600 text-white"
                    : data.signal.action.toLowerCase() === "sell"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-white",
                )}
              >
                {data.signal.action.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>

          <div className="">
            <section className="mb-4 flex flex-col gap-2">
              <div className="flex flex-col">
                <strong>7일간 주식 움직임</strong>
                <div className="flex flex-wrap gap-1">
                  {priceMovement.data?.tickers[0]?.count.map((count, index) => (
                    <Tooltip key={priceMovement.data?.tickers[0]?.date[index]}>
                      <TooltipTrigger className="cursor-pointer">
                        <Badge
                          key={count}
                          className={cn(
                            "in-checked: justify-center bg-blue-500 text-xs text-white",
                            count > 0 ? "bg-green-600" : "bg-red-400",
                          )}
                        >
                          {count > 0 ? "상승" : "하락"}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {priceMovement.data?.tickers?.[0]?.date[index] ?? "N/A"}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                {weeklySignalData.data?.signals[0].count?.length && (
                  <strong>7일간 상승 시그널</strong>
                )}
                <div className="flex flex-wrap gap-1">
                  {weeklySignalData.data?.signals[0].count.map(
                    (count, index) => (
                      <Tooltip
                        key={weeklySignalData.data?.signals[0].date[index]}
                      >
                        <TooltipTrigger className="cursor-pointer">
                          <Badge
                            key={count}
                            className={cn(
                              "in-checked: justify-center bg-blue-500 text-xs text-white",
                              count > 0 ? "bg-green-600" : "bg-red-400",
                            )}
                          >
                            {count}개
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          {priceMovement.data?.tickers?.[0]?.date[index] ??
                            "N/A"}
                        </TooltipContent>
                      </Tooltip>
                    ),
                  )}
                </div>
              </div>
            </section>
            {/* 시그널 정보 */}
            <section>
              <h3 className="mb-2 border-b pb-1 text-lg font-semibold">
                예측 정보
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex w-full flex-col">
                  <strong>전략:</strong>{" "}
                  <div className="flex flex-wrap gap-1">
                    {data.signal.strategy
                      ?.split(",")
                      .map((strategy) => (
                        <Badge key={strategy}>{strategy}</Badge>
                      )) ?? "N/A"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <strong>LLM 모델:</strong>
                  <AiModelSelect
                    options={[
                      ...new Set(
                        signals.data?.signals.map(
                          (signal) => signal.signal.ai_model ?? "",
                        ),
                      ),
                    ]}
                    value={aiModel}
                    onChange={(value) => {
                      router.replace(`/dashboard/d/${symbol}?model=${value}`);
                    }}
                  />
                </div>
                {data.signal.probability && (
                  <div>
                    <strong>확률:</strong>{" "}
                    <Badge
                      variant={
                        data.signal.probability.toLowerCase() === "high"
                          ? "default"
                          : data.signal.probability.toLowerCase() === "medium"
                            ? "secondary"
                            : data.signal.probability.toLowerCase() === "low"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {data.signal.probability}
                    </Badge>
                  </div>
                )}
                <div>
                  <strong>진입 가격:</strong>{" "}
                  {formatCurrency(data.signal.entry_price)}
                </div>
                {data.signal.stop_loss && (
                  <div>
                    <strong>손절 가격:</strong>{" "}
                    {formatCurrency(data.signal.stop_loss)}
                  </div>
                )}
                {data.signal.take_profit && (
                  <div>
                    <strong>익절 가격:</strong>{" "}
                    {formatCurrency(data.signal.take_profit)}
                  </div>
                )}
                {data.signal.chart_pattern && (
                  <div className="mt-4 w-full md:col-span-2">
                    <h3 className="mb-2 border-b pb-1 text-lg font-semibold">
                      차트 패턴 분석
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong>패턴:</strong>
                        <Badge
                          className={cn(
                            "flex flex-wrap text-wrap whitespace-pre-wrap capitalize",
                            data.signal.chart_pattern.pattern_type ===
                              "bullish" && "bg-green-600 text-white",
                            data.signal.chart_pattern.pattern_type ===
                              "bearish" && "bg-red-500 text-white",
                            data.signal.chart_pattern.pattern_type ===
                              "neutral" && "bg-yellow-500 text-white",
                          )}
                        >
                          {data.signal.chart_pattern.name}
                        </Badge>
                      </div>
                      <div>
                        <strong>패턴 유형:</strong>{" "}
                        <Badge
                          className={cn(
                            "capitalize",
                            data.signal.chart_pattern.pattern_type ===
                              "bullish" && "bg-green-600 text-white",
                            data.signal.chart_pattern.pattern_type ===
                              "bearish" && "bg-red-500 text-white",
                            data.signal.chart_pattern.pattern_type ===
                              "neutral" && "bg-yellow-500 text-white",
                          )}
                        >
                          {data.signal.chart_pattern.pattern_type === "bullish"
                            ? "상승"
                            : data.signal.chart_pattern.pattern_type ===
                                "bearish"
                              ? "하락"
                              : "중립"}
                        </Badge>
                      </div>
                      <div>
                        <strong className="flex items-center">
                          신뢰도:
                          <span className="ml-2 text-sm">
                            {confidenceLevel * 100}%
                          </span>
                        </strong>{" "}
                        <Progress value={confidenceLevel * 100} />
                      </div>
                      <div className="md:col-span-2">
                        <strong>차트 설명:</strong>{" "}
                        <p className="text-muted-foreground text-sm">
                          {data.signal.chart_pattern.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {data.signal.senario && (
                  <div className="md:col-span-2">
                    <strong>시나리오:</strong> {data.signal.senario}
                  </div>
                )}
                {data.signal.good_things && (
                  <div className="md:col-span-2">
                    <strong>긍정적 요인:</strong> {data.signal.good_things}
                  </div>
                )}
                {data.signal.bad_things && (
                  <div className="md:col-span-2">
                    <strong>부정적 요인:</strong> {data.signal.bad_things}
                  </div>
                )}
              </div>
              {data.signal.report_summary && (
                <div className="mt-2">
                  <strong>리포트 요약:</strong>{" "}
                  <p className="text-muted-foreground text-sm">
                    {data.signal.report_summary}
                  </p>
                </div>
              )}
              {data.signal.result_description && (
                <div className="mt-2">
                  <strong>결과 설명:</strong>{" "}
                  <p className="text-muted-foreground text-sm">
                    {data.signal.result_description}
                  </p>
                </div>
              )}
            </section>

            {/* 티커 정보 */}
            {data.ticker?.name && (
              <section>
                <div className="mb-2 flex flex-col border-b pb-1">
                  <h3 className="text-lg font-semibold">{data.ticker.name}</h3>
                  <span className="text-muted-foreground text-sm font-light">
                    Close Price [{formatDate(data.ticker.ticker_date)}]
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>항목</TableHead>
                        <TableHead>가격</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>현재가</TableCell>
                        <TableCell>
                          {formatCurrency(data.ticker.price)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>시가</TableCell>
                        <TableCell>
                          {formatCurrency(data.ticker.open_price)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>고가</TableCell>
                        <TableCell>
                          {formatCurrency(data.ticker.high_price)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>저가</TableCell>
                        <TableCell>
                          {formatCurrency(data.ticker.low_price)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>종가</TableCell>
                        <TableCell>
                          {formatCurrency(data.ticker.close_price)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>거래량</TableCell>
                        <TableCell>
                          {data.ticker.volume?.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </section>
            )}

            {/* 결과 정보 */}
            {data.result && (
              <section>
                <h3 className="mb-2 border-b pb-1 text-lg font-semibold">
                  실제 결과
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <Badge>{data.result.action.toUpperCase()}</Badge>
                  </div>
                  <div>
                    {data.result.is_correct ? (
                      <Badge className="bg-green-600 text-white hover:bg-green-600">
                        성공
                      </Badge>
                    ) : (
                      <Badge variant="destructive">실패</Badge>
                    )}
                  </div>
                  <div>
                    <strong>가격 변화:</strong>{" "}
                    {data.ticker?.close_price &&
                      data.ticker?.open_price &&
                      formatCurrency(
                        data.ticker.close_price - data.ticker.open_price,
                      )}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
