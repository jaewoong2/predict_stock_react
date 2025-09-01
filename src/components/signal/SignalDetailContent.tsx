"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useSignalDataByNameAndDate,
  useWeeklyActionCount,
} from "@/hooks/useSignal";
import useMounted from "@/hooks/useMounted";
import { useMarketNewsSummary } from "@/hooks/useMarketNews";
import { useWeeklyPriceMovement } from "@/hooks/useTicker";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AiModelSelect } from "./AiModelSelect";
import { MarketNewsCarousel } from "../news/MarketNewsCarousel";
import { MahaneyAnalysisCard } from "./MahaneyAnalysisCard";
import { useDashboardFilters } from "@/hooks/useDashboard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SignalDetailContentProps {
  symbol: string;
  aiModel: string;
  date: string;
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

// 최근 2주 영업일 날짜 옵션 생성 (주말 제외)
const generateDateOptions = () => {
  const options = [];
  const today = new Date();
  let daysAdded = 0;
  let currentDate = 0;

  // 최대 2주 영업일 (14일)만 포함
  while (daysAdded < 14) {
    const date = new Date(today);
    date.setDate(today.getDate() - currentDate);

    // 주말이 아닌 경우에만 추가 (0 = 일요일, 6 = 토요일)
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dateString = date.toISOString().split("T")[0];
      const displayDate = format(date, "yyyy년 MM월 dd일");

      options.push({
        value: dateString,
        label: displayDate,
      });

      daysAdded++;
    }

    currentDate++;
  }

  return options;
};

export const SignalDetailContent: React.FC<SignalDetailContentProps> = ({
  symbol,
  aiModel,
  date,
}) => {
  const router = useRouter();
  const { strategy_type, setParams } = useDashboardFilters();

  const dateOptions = useMemo(() => generateDateOptions(), []);

  const signals = useSignalDataByNameAndDate([symbol], date, strategy_type);

  const data = useMemo(() => {
    try {
      return signals.data?.signals.find(
        (value) =>
          value.signal.ai_model === aiModel && value.signal.ticker === symbol,
      );
    } catch (error) {
      console.error("Error in useMemo:", error);
      return null;
    }
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

  const probabilityMap = {
    high: { text: "높음", className: "text-green-600 border-green-600" },
    medium: { text: "보통", className: "text-amber-600 border-amber-600" },
    low: { text: "낮음", className: "text-red-600 border-red-600" },
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action.toLowerCase()) {
      case "buy":
        return "success";
      case "sell":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      {marketNews?.result && marketNews.result.length > 0 && (
        <div className="mb-6">
          <MarketNewsCarousel items={marketNews.result} />
        </div>
      )}

      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">
              {data.signal.ticker}
            </h1>
            <div className="flex flex-col space-y-2">
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
                  router.replace(
                    `/dashboard/d/${symbol}?model=${value}&date=${date}`,
                  );
                }}
              />
            </div>
          </div>
          <Select
            value={date}
            onValueChange={(newDate) => {
              setParams({ date: newDate });
            }}
          >
            <SelectTrigger className="w-[200px] shadow-none">
              <SelectValue placeholder="날짜 선택" />
            </SelectTrigger>
            <SelectContent>
              {dateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {data.signal.action && (
            <Badge
              variant={getActionBadgeVariant(data.signal.action)}
              className="px-3 py-1 text-sm font-semibold"
            >
              {data.signal.action.toUpperCase()}
            </Badge>
          )}
          {data.signal.probability && (
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1 text-sm",
                probabilityMap[
                  data.signal.probability.toLowerCase() as keyof typeof probabilityMap
                ]?.className,
              )}
            >
              확률:{" "}
              {probabilityMap[
                data.signal.probability.toLowerCase() as keyof typeof probabilityMap
              ]?.text || data.signal.probability}
            </Badge>
          )}
          <Link href={`/dashboard/predict/${data.signal.ticker}`}>
            <Button size="sm" variant="secondary">예측</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex w-full">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="analysis">분석</TabsTrigger>
          {data.ticker && <TabsTrigger value="data">시장 데이터</TabsTrigger>}
          {data.result && <TabsTrigger value="results">결과</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card className="shadow-none">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex flex-col space-y-2">
                  <label className="text-muted-foreground text-sm font-medium">
                    전략
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {data.signal.strategy?.split(",").map((strategy) => (
                      <Badge key={strategy} variant="secondary">
                        {strategy.trim()}
                      </Badge>
                    )) ?? (
                      <span className="text-muted-foreground text-sm">
                        정보 없음
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-muted flex flex-col space-y-1 rounded-lg p-4">
                  <span className="text-muted-foreground text-sm">
                    진입 가격
                  </span>
                  <span className="text-foreground text-lg font-semibold">
                    {formatCurrency(data.signal.entry_price)}
                  </span>
                </div>
                {data.signal.stop_loss && (
                  <div className="bg-muted flex flex-col space-y-1 rounded-lg p-4">
                    <span className="text-muted-foreground text-sm">손절</span>
                    <span className="text-lg font-semibold text-red-500">
                      {formatCurrency(data.signal.stop_loss)}
                    </span>
                  </div>
                )}
                {data.signal.take_profit && (
                  <div className="bg-muted flex flex-col space-y-1 rounded-lg p-4">
                    <span className="text-muted-foreground text-sm">익절</span>
                    <span className="text-lg font-semibold text-green-600">
                      {formatCurrency(data.signal.take_profit)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>주간 동향</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-foreground font-semibold">
                  7일간 주식 움직임
                </h3>
                <div className="flex flex-wrap gap-2">
                  {priceMovement.data?.tickers[0]?.count.map((count, index) => (
                    <Tooltip key={priceMovement.data?.tickers[0]?.date[index]}>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className={cn(
                            "cursor-pointer",
                            count > 0
                              ? "border-green-200 text-green-600"
                              : "border-red-200 text-red-600",
                          )}
                        >
                          {count > 0 ? "📈 상승" : "📉 하락"}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {priceMovement.data?.tickers?.[0]?.date[index] ??
                            "N/A"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

              {weeklySignalData.data?.signals?.[0].count?.length && (
                <div className="space-y-3">
                  <h3 className="text-foreground font-semibold">
                    7일간 상승 시그널
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {weeklySignalData.data?.signals?.[0].count.map(
                      (count, index) => (
                        <Tooltip
                          key={weeklySignalData.data?.signals?.[0].date[index]}
                        >
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className={cn(
                                "cursor-pointer",
                                count > 0
                                  ? "border-blue-200 text-blue-600"
                                  : "border-gray-200 text-gray-500",
                              )}
                            >
                              {count}개
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {priceMovement.data?.tickers?.[0]?.date[index] ??
                                "N/A"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      ),
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <MahaneyAnalysisCard symbol={symbol} date={date} />
        </TabsContent>

        <TabsContent value="analysis" className="mt-6 space-y-6">
          {data.signal.chart_pattern && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>📈 차트 패턴 분석</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-muted-foreground text-sm font-medium">
                        패턴명
                      </label>
                      <Badge variant="secondary">
                        {data.signal.chart_pattern.name}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <label className="text-muted-foreground text-sm font-medium">
                        패턴 유형
                      </label>
                      <Badge>
                        {data.signal.chart_pattern.pattern_type === "bullish"
                          ? "📈 상승 패턴"
                          : data.signal.chart_pattern.pattern_type === "bearish"
                            ? "📉 하락 패턴"
                            : "➡️ 중립 패턴"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-muted-foreground text-sm font-medium">
                      신뢰도
                    </label>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={confidenceLevel * 100}
                        className="bg-muted h-2 w-full [&_div]:bg-green-300"
                      />
                      <span className="text-foreground font-semibold">
                        {Math.round(confidenceLevel * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-muted-foreground text-sm font-medium">
                    패턴 설명
                  </label>
                  <div className="bg-muted/50 rounded-md p-4 text-sm">
                    <p className="leading-relaxed">
                      {data.signal.chart_pattern.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(data.signal.senario ||
            data.signal.good_things ||
            data.signal.bad_things) && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>📋 종합 분석</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.signal.senario && (
                  <div className="space-y-2">
                    <label className="text-muted-foreground text-sm font-medium">
                      시나리오
                    </label>
                    <div className="bg-muted/50 rounded-md border-blue-500 p-4 text-sm">
                      <p className="leading-relaxed">{data.signal.senario}</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {data.signal.good_things && (
                    <div className="space-y-2">
                      <label className="text-muted-foreground text-sm font-medium">
                        긍정적 요인
                      </label>
                      <div className="bg-muted/50 rounded-md border-green-500 p-4 text-sm">
                        <p className="leading-relaxed">
                          {data.signal.good_things}
                        </p>
                      </div>
                    </div>
                  )}
                  {data.signal.bad_things && (
                    <div className="space-y-2">
                      <label className="text-muted-foreground text-sm font-medium">
                        부정적 요인
                      </label>
                      <div className="bg-muted/50 rounded-md p-4 text-sm">
                        <p className="leading-relaxed">
                          {data.signal.bad_things}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {data.signal.report_summary && (
                  <div className="space-y-2">
                    <label className="text-muted-foreground text-sm font-medium">
                      리포트 요약
                    </label>
                    <div className="bg-muted/50 rounded-md p-4 text-sm">
                      <p className="leading-relaxed">
                        {data.signal.report_summary}
                      </p>
                    </div>
                  </div>
                )}

                {data.signal.result_description && (
                  <div className="space-y-2">
                    <label className="text-muted-foreground text-sm font-medium">
                      결과 설명
                    </label>
                    <div className="bg-muted/50 rounded-md p-4 text-sm">
                      <p className="leading-relaxed">
                        {data.signal.result_description}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="data" className="mt-6 space-y-6">
          {data.ticker?.name && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>{data.ticker.name} 가격 정보</CardTitle>
                <p className="text-muted-foreground text-sm">
                  종가 기준 [{formatDate(data.ticker.ticker_date)}]
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="bg-muted flex flex-col space-y-1 rounded-lg p-4">
                  <span className="text-muted-foreground text-sm">현재가</span>
                  <span className="text-foreground text-lg font-semibold">
                    {formatCurrency(data.ticker.price)}
                  </span>
                </div>
                <div className="bg-muted flex flex-col space-y-1 rounded-lg p-4">
                  <span className="text-muted-foreground text-sm">시가</span>
                  <span className="text-foreground text-lg font-semibold">
                    {formatCurrency(data.ticker.open_price)}
                  </span>
                </div>
                <div className="bg-muted flex flex-col space-y-1 rounded-lg p-4">
                  <span className="text-muted-foreground text-sm">고가</span>
                  <span className="text-foreground text-lg font-semibold">
                    {formatCurrency(data.ticker.high_price)}
                  </span>
                </div>
                <div className="bg-muted flex flex-col space-y-1 rounded-lg p-4">
                  <span className="text-muted-foreground text-sm">저가</span>
                  <span className="text-foreground text-lg font-semibold">
                    {formatCurrency(data.ticker.low_price)}
                  </span>
                </div>
                <div className="bg-muted flex flex-col space-y-1 rounded-lg p-4">
                  <span className="text-muted-foreground text-sm">종가</span>
                  <span className="text-foreground text-lg font-semibold">
                    {formatCurrency(data.ticker.close_price)}
                  </span>
                </div>
                <div className="bg-muted flex flex-col space-y-1 rounded-lg p-4">
                  <span className="text-muted-foreground text-sm">거래량</span>
                  <span className="text-foreground text-lg font-semibold">
                    {data.ticker.volume?.toLocaleString() ?? "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="mt-6 space-y-6">
          {data.result && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>🎯 실제 결과</CardTitle>
                <p className="text-muted-foreground text-sm">
                  예측 대비 실제 성과
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="bg-muted flex flex-col items-center justify-center space-y-2 rounded-lg p-4">
                  <span className="text-muted-foreground text-sm">
                    실행 액션
                  </span>
                  <Badge variant="secondary" className="text-base">
                    {data.result.action.toUpperCase()}
                  </Badge>
                </div>
                <div
                  className={cn(
                    "bg-muted flex flex-col items-center justify-center space-y-2 rounded-lg p-4",
                    data.result.is_correct ? "text-green-600" : "text-red-600",
                  )}
                >
                  <span className="text-sm">예측 결과</span>
                  <div className="flex items-center gap-2">
                    {data.result.is_correct ? (
                      <>
                        <CheckCircle className="h-6 w-6" />
                        <span className="text-base font-semibold">성공</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-6 w-6" />
                        <span className="text-base font-semibold">실패</span>
                      </>
                    )}
                  </div>
                </div>
                {data.ticker?.close_price && data.ticker?.open_price && (
                  <div className="bg-muted flex flex-col items-center justify-center space-y-2 rounded-lg p-4">
                    <span className="text-muted-foreground text-sm">
                      가격 변화
                    </span>
                    <p
                      className={cn(
                        "text-lg font-bold",
                        data.ticker.close_price - data.ticker.open_price >= 0
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {formatCurrency(
                        data.ticker.close_price - data.ticker.open_price,
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
