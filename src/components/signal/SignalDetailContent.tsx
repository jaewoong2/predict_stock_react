"use client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { MahaneyAnalysisCard } from "./MahaneyAnalysisCard";

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

export const SignalDetailContent: React.FC<SignalDetailContentProps> = ({
  symbol,
  aiModel,
  date,
}) => {
  const router = useRouter();
  const { strategy_type } = useSignalSearchParams();

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

  return (
    <div className="mx-auto w-full p-10">
      <div className="p-6">
        {marketNews?.result && (
          <div className="mb-6">
            <MarketNewsCarousel items={marketNews?.result} />
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                {data.signal.ticker}
              </h1>
              <p className="text-muted-foreground">
                {data.signal.timestamp &&
                  format(data.signal.timestamp, "yyyy년 MM월 dd일")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {data.signal.action && (
                <Badge
                  className={cn(
                    "px-4 py-2 text-sm font-semibold",
                    data.signal.action.toLowerCase() === "buy"
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : data.signal.action.toLowerCase() === "sell"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-amber-500 text-white hover:bg-amber-600",
                  )}
                >
                  {data.signal.action.toUpperCase()}
                </Badge>
              )}
              {data.signal.probability && (
                <Badge
                  className={cn(
                    "px-3 py-1 text-sm",
                    data.signal.probability.toLowerCase() === "high"
                      ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                      : data.signal.probability.toLowerCase() === "medium"
                        ? "border-amber-300 bg-amber-100 text-amber-800"
                        : "border-red-300 bg-red-100 text-red-800",
                  )}
                  variant="outline"
                >
                  확률:{" "}
                  {data.signal.probability === "high"
                    ? "높음"
                    : data.signal.probability === "medium"
                      ? "보통"
                      : "낮음"}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="analysis">분석</TabsTrigger>
            <TabsTrigger value="data">시장 데이터</TabsTrigger>
            <TabsTrigger value="results">결과</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-3">
                  <label className="text-muted-foreground text-sm font-medium">
                    전략
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {data.signal.strategy?.split(",").map((strategy) => (
                      <Badge
                        key={strategy}
                        variant="secondary"
                        className="border-blue-200 bg-blue-50 text-blue-700"
                      >
                        {strategy.trim()}
                      </Badge>
                    )) ?? (
                      <span className="text-muted-foreground">
                        전략 정보 없음
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-muted-foreground text-sm font-medium">
                    LLM 모델
                  </label>
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
                      router.push(
                        `/dashboard/d/${symbol}?model=${value}&date=${date}`,
                      );
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                    <label className="text-sm font-medium text-blue-700">
                      💰 진입 가격
                    </label>
                    <p className="mt-1 text-lg font-bold text-blue-900">
                      {formatCurrency(data.signal.entry_price)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {data.signal.stop_loss && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                    <label className="text-sm font-medium text-red-700">
                      🛑 손절
                    </label>
                    <p className="mt-1 text-base font-bold text-red-900">
                      {formatCurrency(data.signal.stop_loss)}
                    </p>
                  </div>
                )}

                {data.signal.take_profit && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center">
                    <label className="text-sm font-medium text-emerald-700">
                      🎯 익절
                    </label>
                    <p className="mt-1 text-base font-bold text-emerald-900">
                      {formatCurrency(data.signal.take_profit)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-foreground text-lg font-semibold">
                    7일간 주식 움직임
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {priceMovement.data?.tickers[0]?.count.map(
                      (count, index) => (
                        <Tooltip
                          key={priceMovement.data?.tickers[0]?.date[index]}
                        >
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className={cn(
                                "cursor-pointer transition-all hover:scale-105",
                                count > 0
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-red-200 bg-red-50 text-red-700",
                              )}
                            >
                              {count > 0 ? "📈 상승" : "📉 하락"}
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

                {weeklySignalData.data?.signals?.[0].count?.length && (
                  <div className="space-y-3">
                    <h3 className="text-foreground text-lg font-semibold">
                      7일간 상승 시그널
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {weeklySignalData.data?.signals?.[0].count.map(
                        (count, index) => (
                          <Tooltip
                            key={
                              weeklySignalData.data?.signals?.[0].date[index]
                            }
                          >
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "cursor-pointer transition-all hover:scale-105",
                                  count > 0
                                    ? "border-blue-200 bg-blue-50 text-blue-700"
                                    : "border-gray-200 bg-gray-50 text-gray-700",
                                )}
                              >
                                🔄 {count}개
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
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="analysis" className="mt-6 space-y-6">
            {data.signal.chart_pattern && (
              <div className="bg-card rounded-lg border p-6">
                <div className="mb-6">
                  <h2 className="text-foreground text-xl font-bold">
                    📈 차트 패턴 분석
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-muted-foreground text-sm font-medium">
                        패턴명
                      </label>
                      <Badge
                        className={cn(
                          "px-4 py-2 text-sm font-semibold",
                          data.signal.chart_pattern.pattern_type ===
                            "bullish" &&
                            "border-emerald-300 bg-emerald-100 text-emerald-800",
                          data.signal.chart_pattern.pattern_type ===
                            "bearish" &&
                            "border-red-300 bg-red-100 text-red-800",
                          data.signal.chart_pattern.pattern_type ===
                            "neutral" &&
                            "border-amber-300 bg-amber-100 text-amber-800",
                        )}
                        variant="outline"
                      >
                        {data.signal.chart_pattern.name}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <label className="text-muted-foreground text-sm font-medium">
                        패턴 유형
                      </label>
                      <Badge
                        className={cn(
                          "px-4 py-2 text-sm font-semibold",
                          data.signal.chart_pattern.pattern_type ===
                            "bullish" && "bg-emerald-500 text-white",
                          data.signal.chart_pattern.pattern_type ===
                            "bearish" && "bg-red-500 text-white",
                          data.signal.chart_pattern.pattern_type ===
                            "neutral" && "bg-amber-500 text-white",
                        )}
                      >
                        {data.signal.chart_pattern.pattern_type === "bullish"
                          ? "📈 상승 패턴"
                          : data.signal.chart_pattern.pattern_type === "bearish"
                            ? "📉 하락 패턴"
                            : "➡️ 중립 패턴"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                        🎯 신뢰도
                        <span className="text-foreground text-lg font-bold">
                          {Math.round(confidenceLevel * 100)}%
                        </span>
                      </label>
                      <div className="space-y-2">
                        <Progress
                          value={confidenceLevel * 100}
                          className="h-3"
                        />
                        <div className="text-muted-foreground flex justify-between text-xs">
                          <span>낮음</span>
                          <span>보통</span>
                          <span>높음</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 lg:col-span-2">
                    <label className="text-muted-foreground text-sm font-medium">
                      패턴 설명
                    </label>
                    <div className="bg-muted/50 rounded-lg border p-4">
                      <p className="text-sm leading-relaxed">
                        {data.signal.chart_pattern.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(data.signal.senario ||
              data.signal.good_things ||
              data.signal.bad_things ||
              data.signal.report_summary ||
              data.signal.result_description) && (
              <div className="bg-card rounded-lg border p-6">
                <div className="mb-6">
                  <h2 className="text-foreground text-xl font-bold">
                    📋 종합 분석
                  </h2>
                </div>

                <div className="space-y-6">
                  {data.signal.senario && (
                    <div className="space-y-3">
                      <label className="text-muted-foreground text-sm font-medium">
                        🎬 시나리오
                      </label>
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <p className="text-sm leading-relaxed text-blue-900">
                          {data.signal.senario}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {data.signal.good_things && (
                      <div className="space-y-3">
                        <label className="text-muted-foreground text-sm font-medium">
                          ✅ 긍정적 요인
                        </label>
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                          <p className="text-sm leading-relaxed text-emerald-900">
                            {data.signal.good_things}
                          </p>
                        </div>
                      </div>
                    )}

                    {data.signal.bad_things && (
                      <div className="space-y-3">
                        <label className="text-muted-foreground text-sm font-medium">
                          ⚠️ 부정적 요인
                        </label>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                          <p className="text-sm leading-relaxed text-red-900">
                            {data.signal.bad_things}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {data.signal.report_summary && (
                    <div className="space-y-3">
                      <label className="text-muted-foreground text-sm font-medium">
                        📊 리포트 요약
                      </label>
                      <div className="bg-muted/50 rounded-lg border p-4">
                        <p className="text-sm leading-relaxed">
                          {data.signal.report_summary}
                        </p>
                      </div>
                    </div>
                  )}

                  {data.signal.result_description && (
                    <div className="space-y-3">
                      <label className="text-muted-foreground text-sm font-medium">
                        📋 결과 설명
                      </label>
                      <div className="bg-muted/50 rounded-lg border p-4">
                        <p className="text-sm leading-relaxed">
                          {data.signal.result_description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="data" className="mt-6 space-y-6">
            {data.ticker?.name && (
              <div className="bg-card rounded-lg border p-6">
                <div className="mb-6">
                  <h2 className="text-foreground text-xl font-bold">
                    💹 {data.ticker.name}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    종가 기준 [{formatDate(data.ticker.ticker_date)}]
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                    <label className="text-sm font-medium text-blue-700">
                      현재가
                    </label>
                    <p className="mt-1 text-xl font-bold text-blue-900">
                      {formatCurrency(data.ticker.price)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                    <label className="text-sm font-medium text-gray-700">
                      시가
                    </label>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {formatCurrency(data.ticker.open_price)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
                    <label className="text-sm font-medium text-emerald-700">
                      고가
                    </label>
                    <p className="mt-1 text-xl font-bold text-emerald-900">
                      {formatCurrency(data.ticker.high_price)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-4">
                    <label className="text-sm font-medium text-red-700">
                      저가
                    </label>
                    <p className="mt-1 text-xl font-bold text-red-900">
                      {formatCurrency(data.ticker.low_price)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                    <label className="text-sm font-medium text-purple-700">
                      종가
                    </label>
                    <p className="mt-1 text-xl font-bold text-purple-900">
                      {formatCurrency(data.ticker.close_price)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-4">
                    <label className="text-sm font-medium text-amber-700">
                      거래량
                    </label>
                    <p className="mt-1 text-xl font-bold text-amber-900">
                      {data.ticker.volume?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="mt-6 space-y-6">
            {data.result && (
              <div className="bg-card rounded-lg border p-6">
                <div className="mb-6">
                  <h2 className="text-foreground text-xl font-bold">
                    🎯 실제 결과
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    예측 대비 실제 성과
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
                    <label className="text-sm font-medium text-blue-700">
                      실행 액션
                    </label>
                    <Badge className="mt-2 bg-blue-500 px-4 py-2 text-sm text-white">
                      {data.result.action.toUpperCase()}
                    </Badge>
                  </div>

                  <div
                    className="rounded-lg border p-4 text-center"
                    style={{
                      backgroundColor: data.result.is_correct
                        ? "#dcfce7"
                        : "#fef2f2",
                      borderColor: data.result.is_correct
                        ? "#bbf7d0"
                        : "#fecaca",
                    }}
                  >
                    <label
                      className={`text-sm font-medium ${data.result.is_correct ? "text-emerald-700" : "text-red-700"}`}
                    >
                      예측 결과
                    </label>
                    <div className="mt-2">
                      {data.result.is_correct ? (
                        <Badge className="bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-600">
                          ✅ 성공
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">
                          ❌ 실패
                        </Badge>
                      )}
                    </div>
                  </div>

                  {data.ticker?.close_price && data.ticker?.open_price && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                      <label className="text-sm font-medium text-gray-700">
                        가격 변화
                      </label>
                      <p
                        className={`mt-1 text-lg font-bold ${
                          data.ticker.close_price - data.ticker.open_price > 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(
                          data.ticker.close_price - data.ticker.open_price,
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-card rounded-lg border">
              <MahaneyAnalysisCard symbol={symbol} date={date} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
