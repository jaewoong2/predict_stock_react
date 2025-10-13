"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  motion,
  type TargetAndTransition,
  type Transition,
  type Variants,
} from "framer-motion";
import { usePointsBalance } from "@/hooks/usePoints";
import { useTodaySession } from "@/hooks/useSession";
import {
  useRemainingPredictions,
  usePredictionStats,
  usePredictionsForDay,
} from "@/hooks/usePrediction";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

import { TickerAvatar } from "@/components/atomic/atoms/TickerAvatar";
import { PredictionStatus, getPredictionStatusColor } from "@/types/prediction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";

const AVATAR_SIZE = 32;
const REST_OVERLAP = 14;
const HOVER_OVERLAP = 36;
const DEFAULT_MAX_STACK_COLUMNS = 6;
const REST_ROW_OFFSET = 18;
const HOVER_ROW_OFFSET = AVATAR_SIZE + 12;

const resolveMaxStackColumns = (viewportWidth: number) => {
  if (viewportWidth >= 1280) return 8;
  if (viewportWidth >= 1024) return 6;
  if (viewportWidth >= 768) return 5;
  return 4;
};

const getStackMetrics = (count: number, maxColumns: number) => {
  const columns = Math.min(count, maxColumns);
  const rows = Math.max(Math.ceil(count / maxColumns), 1);

  return { columns, rows };
};

const calculateStackDimensions = (
  count: number,
  overlap: number,
  rowOffset: number,
  maxColumns: number,
) => {
  const { columns, rows } = getStackMetrics(count, maxColumns);

  return {
    width: AVATAR_SIZE + Math.max(columns - 1, 0) * overlap,
    height: AVATAR_SIZE + Math.max(rows - 1, 0) * rowOffset,
  };
};

const calculatePosition = (
  index: number,
  overlap: number,
  rowOffset: number,
  maxColumns: number,
) => {
  const column = index % maxColumns;
  const row = Math.floor(index / maxColumns);

  return {
    x: column * overlap,
    y: row * rowOffset,
  };
};

const STACK_TRANSITION: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
};

const AVATAR_TRANSITION: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 32,
};

const buildStackVariant = (
  count: number,
  overlap: number,
  rowOffset: number,
  maxColumns: number,
): TargetAndTransition => ({
  ...calculateStackDimensions(count, overlap, rowOffset, maxColumns),
  transition: { ...STACK_TRANSITION },
});

const buildAvatarVariant = (
  index: number,
  overlap: number,
  rowOffset: number,
  maxColumns: number,
): TargetAndTransition => ({
  ...calculatePosition(index, overlap, rowOffset, maxColumns),
  transition: { ...AVATAR_TRANSITION },
});

const stackVariants = {
  rest: ({ count, maxColumns }: { count: number; maxColumns: number }) =>
    buildStackVariant(count, REST_OVERLAP, REST_ROW_OFFSET, maxColumns),
  hover: ({ count, maxColumns }: { count: number; maxColumns: number }) =>
    buildStackVariant(count, HOVER_OVERLAP, HOVER_ROW_OFFSET, maxColumns),
} satisfies Variants;

const avatarVariants = {
  rest: ({ index, maxColumns }: { index: number; maxColumns: number }) =>
    buildAvatarVariant(index, REST_OVERLAP, REST_ROW_OFFSET, maxColumns),
  hover: ({ index, maxColumns }: { index: number; maxColumns: number }) =>
    buildAvatarVariant(index, HOVER_OVERLAP, HOVER_ROW_OFFSET, maxColumns),
} satisfies Variants;

export function DashboardStats() {
  const { isAuthenticated, showLogin } = useAuth();
  const { data: pointsBalance } = usePointsBalance();
  const { data: session } = useTodaySession();
  const { data: predictionStats } = usePredictionStats();
  const { date: urlDate, setParams } = useSignalSearchParams();

  const initialTradingDay =
    session?.session?.trading_day || new Date().toISOString().split("T")[0];

  const effectiveDay = urlDate || initialTradingDay;

  const [selectedDay, setSelectedDay] = useState(effectiveDay);
  const [maxStackColumns, setMaxStackColumns] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_MAX_STACK_COLUMNS;
    }
    return resolveMaxStackColumns(window.innerWidth);
  });
  const [isStackFocused, setIsStackFocused] = useState(false);

  useEffect(() => {
    if (effectiveDay) {
      setSelectedDay(effectiveDay);
    }
  }, [effectiveDay]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setMaxStackColumns(resolveMaxStackColumns(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDayChange = useCallback(
    (day: string) => {
      setSelectedDay(day);
      setParams({ date: day });
    },
    [setParams],
  );

  const { data: remainingPredictions } = useRemainingPredictions(selectedDay);
  const { data: todayPredictions } = usePredictionsForDay(selectedDay);

  const sessionStatus =
    session?.session?.phase === "OPEN" ? "예측 가능" : "예측 마감";
  const isMarketOpen = session?.session?.phase === "OPEN";

  const predictions = todayPredictions?.predictions ?? [];

  const dayOptions = useMemo(() => {
    const baseDate = new Date(`${initialTradingDay}T00:00:00Z`);
    const options = Array.from({ length: 7 }, (_, i) => -i).map((offset) => {
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
    if (
      selectedDay &&
      !options.some((option) => option.value === selectedDay)
    ) {
      const target = new Date(`${selectedDay}T00:00:00Z`);
      if (!Number.isNaN(target.getTime())) {
        const month = String(target.getUTCMonth() + 1).padStart(2, "0");
        const day = String(target.getUTCDate()).padStart(2, "0");
        options.unshift({
          value: selectedDay,
          label: `${month}월 ${day}일`,
        });
      } else {
        options.unshift({ value: selectedDay, label: selectedDay });
      }
    }
    return options;
  }, [initialTradingDay, selectedDay]);

  const sortedPredictions = useMemo(
    () =>
      [...predictions].sort(
        (a, b) =>
          new Date(b.submitted_at).getTime() -
          new Date(a.submitted_at).getTime(),
      ),
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

  const factChips = useMemo(() => {
    if (!isAuthenticated) {
      return [];
    }

    return [
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
    ];
  }, [
    isAuthenticated,
    pointsBalance?.balance,
    predictionStats?.accuracy_rate,
    remainingPredictions,
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2 rounded-2xl bg-white shadow-none dark:bg-[#11131a]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase dark:text-slate-500">
            <Select value={selectedDay} onValueChange={handleDayChange}>
              <SelectTrigger
                size="sm"
                className="h-auto rounded-full border-none bg-transparent px-0 py-0 font-semibold text-slate-500 shadow-none focus-visible:ring-0 dark:text-slate-400"
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

          {isAuthenticated
            ? predictions.length > 0 && (
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  ? `${predictions.length}건 · 정답 ${summary.correct}, 오답 $
                  {summary.incorrect}, 대기 ${summary.pending}$
                  {summary.void ? `, 무효 ${summary.void}` : ""}` : "해당 날짜에
                  등록된 예측이 없어요"
                </div>
              )
            : null}
          {factChips.length > 0 && (
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
          )}
        </div>

        {sortedPredictions.length > 0 ? (
          <motion.div
            className="relative flex min-h-[2.5rem] items-start"
            initial="rest"
            animate={isStackFocused ? "hover" : "rest"}
            whileHover="hover"
            onFocusCapture={() => setIsStackFocused(true)}
            onBlurCapture={(event) => {
              const next = event.relatedTarget as HTMLElement | null;
              if (!event.currentTarget.contains(next)) {
                setIsStackFocused(false);
              }
            }}
          >
            <motion.div
              variants={stackVariants}
              custom={{
                count: sortedPredictions.length,
                maxColumns: maxStackColumns,
              }}
            >
              {sortedPredictions.map((prediction, index) => (
                <Link
                  href={`/ox/dashboard/predict/${prediction.symbol}`}
                  scroll={false}
                  key={prediction.symbol}
                  prefetch={false}
                  className="focus-visible:ring-offset-background absolute top-0 left-0 block rounded-full focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                  style={{
                    zIndex: sortedPredictions.length - index,
                  }}
                  aria-label={`${prediction.symbol} 예측 열기`}
                >
                  <motion.div
                    variants={avatarVariants}
                    custom={{ index, maxColumns: maxStackColumns }}
                  >
                    <div
                      className={cn(
                        "absolute top-0 right-0 z-50 flex h-2 w-2 items-center justify-center rounded-full text-xs font-semibold text-white",
                        getPredictionStatusColor(prediction.status),
                      )}
                    />
                    <TickerAvatar
                      symbol={prediction.symbol}
                      status={prediction.status}
                      size={AVATAR_SIZE}
                      className="shadow-sm backdrop-blur"
                    />
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </motion.div>
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
