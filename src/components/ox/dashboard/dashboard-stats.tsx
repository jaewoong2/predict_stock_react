"use client";

import { useEffect, useMemo, useState } from "react";
import { usePointsBalance } from "@/hooks/usePoints";
import { useTodaySession } from "@/hooks/useSession";
import {
  useRemainingPredictions,
  usePredictionStats,
  usePredictionsForDay,
} from "@/hooks/usePrediction";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TickerAvatar } from "@/components/atomic/atoms/TickerAvatar";
import { PredictionStatus, getPredictionStatusText } from "@/types/prediction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DashboardStats() {
  const { data: pointsBalance } = usePointsBalance();
  const { data: session } = useTodaySession();
  const { data: predictionStats } = usePredictionStats();

  const initialTradingDay =
    session?.session?.trading_day || new Date().toISOString().split("T")[0];

  const [selectedDay, setSelectedDay] = useState(initialTradingDay);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  useEffect(() => {
    setSelectedDay(initialTradingDay);
  }, [initialTradingDay]);

  const { data: remainingPredictions } = useRemainingPredictions(selectedDay);
  const { data: todayPredictions } = usePredictionsForDay(selectedDay);

  const sessionStatus =
    session?.session?.phase === "OPEN" ? "예측 가능" : "예측 마감";
  const isMarketOpen = session?.session?.phase === "OPEN";

  const predictions = todayPredictions?.predictions ?? [];

  const dayOptions = useMemo(() => {
    const baseDate = new Date(`${initialTradingDay}T00:00:00Z`);
    return Array.from({ length: 7 }, (_, i) => -i).map((offset) => {
      const target = new Date(baseDate);
      target.setUTCDate(baseDate.getUTCDate() + offset);
      const value = target.toISOString().split("T")[0];
      const month = String(target.getUTCMonth() + 1).padStart(2, "0");
      const day = String(target.getUTCDate()).padStart(2, "0");
      const dateLabel = `${month}월 ${day}일`;
      return {
        value,
        label: `${dateLabel}`,
      };
    });
  }, [initialTradingDay]);

  const sortedPredictions = useMemo(
    () =>
      [...predictions]
        .sort(
          (a, b) =>
            new Date(b.submitted_at).getTime() -
            new Date(a.submitted_at).getTime(),
        )
        .slice(0, 8),
    [predictions],
  );

  const summary = useMemo(() => {
    return predictions.reduce(
      (acc, { status }) => {
        switch (status) {
          case PredictionStatus.CORRECT:
            acc.correct += 1;
            break;
          case PredictionStatus.INCORRECT:
            acc.incorrect += 1;
            break;
          case PredictionStatus.VOID:
            acc.void += 1;
            break;
          default:
            acc.pending += 1;
        }
        return acc;
      },
      { correct: 0, incorrect: 0, pending: 0, void: 0 },
    );
  }, [predictions]);

  const factChips = useMemo(
    () => [
      {
        label: "누적 정확도",
        value: `${
          predictionStats?.accuracy_rate
            ? predictionStats.accuracy_rate.toFixed(1)
            : "0"
        }%`,
      },
      {
        label: "남은 슬롯",
        value: `${remainingPredictions ?? 0}회`,
      },
      {
        label: "포인트",
        value: `${(pointsBalance?.balance ?? 0).toLocaleString()} P`,
      },
    ],
    [
      pointsBalance?.balance,
      predictionStats?.accuracy_rate,
      remainingPredictions,
    ],
  );

  return (
    <div className="space-y-6">
      {/* 세션 상태 배너 */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-slate-50 p-6 text-sm shadow-none dark:bg-[#151b24]",
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  isMarketOpen ? "bg-emerald-500" : "bg-slate-400",
                )}
              />
              <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                시장 현황
              </span>
            </div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {sessionStatus}
            </div>
          </div>
          <div
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
              isMarketOpen
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300",
            )}
          >
            {isMarketOpen ? "LIVE" : "CLOSED"}
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-none dark:bg-[#11131a]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase dark:text-slate-500">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger
                size="sm"
                className="h-auto rounded-full border-none bg-transparent px-0 py-0 text-[11px] font-semibold text-slate-500 uppercase shadow-none focus-visible:ring-0 dark:text-slate-400"
              >
                <SelectValue placeholder="오늘" />
              </SelectTrigger>
              <SelectContent className="min-w-[8rem] rounded-xl border border-slate-200 bg-white p-1 text-xs shadow-xl dark:border-slate-700 dark:bg-[#11131a]">
                {dayOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg px-2 py-1.5 text-xs font-medium"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {predictions.length > 0
              ? `${predictions.length}건 · 정답 ${summary.correct}, 오답 ${summary.incorrect}, 대기 ${summary.pending}${
                  summary.void ? `, 무효 ${summary.void}` : ""
                }`
              : "해당 날짜에 등록된 예측이 없어요"}
          </div>
          <div className="flex flex-wrap gap-2">
            {factChips.map((chip) => (
              <div
                key={chip.label}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-[#161b26] dark:text-slate-300"
              >
                <span className="mr-1 text-slate-400 dark:text-slate-500">
                  {chip.label}
                </span>
                <span>{chip.value}</span>
              </div>
            ))}
          </div>
        </div>

        {sortedPredictions.length > 0 ? (
          <div
            className="relative flex h-10 items-center"
            onPointerEnter={() => setIsAvatarHovered(true)}
            onPointerLeave={() => setIsAvatarHovered(false)}
            onFocus={() => setIsAvatarHovered(true)}
            onBlur={() => setIsAvatarHovered(false)}
          >
            <div
              className="relative h-8"
              style={{
                width:
                  32 +
                  Math.max(sortedPredictions.length - 1, 0) *
                    (isAvatarHovered ? 36 : 14),
              }}
            >
              {sortedPredictions.map((prediction, index) => {
                const translateX = index * (isAvatarHovered ? 36 : 14);
                return (
                  <Tooltip key={`${prediction.symbol}-${prediction.id}`}>
                    <TooltipTrigger asChild>
                      <div
                        className="absolute top-0 left-0 transition-transform duration-300 ease-out"
                        style={{
                          transform: `translateX(${translateX}px)`,
                          zIndex: sortedPredictions.length - index,
                        }}
                      >
                        <TickerAvatar
                          symbol={prediction.symbol}
                          status={prediction.status}
                          size={32}
                          className="shadow-sm backdrop-blur"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={12} className="text-xs">
                      <div className="font-semibold">{prediction.symbol}</div>
                      <div className="text-slate-500 dark:text-slate-300">
                        {new Date(prediction.submitted_at).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                      <div className="text-slate-500 dark:text-slate-300">
                        결과: {getPredictionStatusText(prediction.status)}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-2 rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500 dark:bg-[#151b24] dark:text-slate-300">
            <div>오늘 예측한 종목이 없습니다.</div>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              새 예측을 등록하면 최근 예측한 종목들이 여기에 표시됩니다.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
