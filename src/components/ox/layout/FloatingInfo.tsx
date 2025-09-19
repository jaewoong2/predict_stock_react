"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Coins, Timer } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTodaySession } from "@/hooks/useSession";
import {
  useRemainingPredictions,
  usePredictionsForDay,
} from "@/hooks/usePrediction";
import { usePointsBalance } from "@/hooks/usePoints";
import { cn } from "@/lib/utils";
import { useCooldownStatus } from "@/hooks/useCooldownStatus";

interface FloatingInfoProps {
  className?: string;
}

export function FloatingInfo({ className }: FloatingInfoProps) {
  const [showDock, setShowDock] = useState(false);

  const { data: session } = useTodaySession();
  const tradingDay = session?.session?.trading_day || "";
  const { data: remaining } = useRemainingPredictions(tradingDay);
  const { data: todayPredictions } = usePredictionsForDay(tradingDay);
  const { data: pointsBalance } = usePointsBalance();
  const {
    data: cooldown,
    isLoading,
    error: cooldownError,
  } = useCooldownStatus({ refetchInterval: 15 * 1000, staleTime: 15 * 1000 });
  const [cooldownCountdown, setCooldownCountdown] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const threshold = 32;
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      setShowDock(y > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isMarketOpen = session?.session?.phase === "OPEN";
  const sessionPhase = session?.session?.phase || "UNKNOWN";
  const totalPredictions = todayPredictions?.predictions?.length || 0;
  const remainingSlots = typeof remaining === "number" ? remaining : 0;

  useEffect(() => {
    if (!cooldown?.has_active_cooldown || !cooldown.next_refill_at) {
      setCooldownCountdown(null);
      return;
    }

    const target = new Date(cooldown.next_refill_at).getTime();
    if (Number.isNaN(target)) {
      setCooldownCountdown(null);
      return;
    }

    const formatTime = (ms: number) => {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const hh = hours > 0 ? `${hours.toString().padStart(2, "0")}:` : "";
      const mm = minutes.toString().padStart(2, "0");
      const ss = seconds.toString().padStart(2, "0");
      return `${hh}${mm}:${ss}`;
    };

    const updateLabel = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setCooldownCountdown(null);
        return true;
      }
      setCooldownCountdown(formatTime(diff));
      return false;
    };

    const shouldStopImmediately = updateLabel();
    if (shouldStopImmediately) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (updateLabel()) {
        window.clearInterval(intervalId);
      }
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [cooldown?.has_active_cooldown, cooldown?.next_refill_at]);

  const predictionStatusLabel = isMarketOpen
    ? `예측 가능 ${remainingSlots}회`
    : "예측 마감";

  const predictionStatusDescription = isMarketOpen
    ? `오늘 예측 ${totalPredictions}회`
    : "세션이 열리면 다시 예측할 수 있어요.";

  const cooldownSummaryText = useMemo(() => {
    if (isLoading) return "슬롯 상태 확인 중";
    if (cooldownError) return "슬롯 상태를 불러오지 못했습니다";
    if (!cooldown) return "슬롯 정보 없음";

    if (cooldown.has_active_cooldown) {
      if (cooldownCountdown) {
        return `충전 까지 ${cooldownCountdown}`;
      }
      return "진행 중";
    }

    return "";
  }, [isLoading, cooldownError, cooldown, cooldownCountdown]);

  return (
    <AnimatePresence>
      {showDock && (
        <motion.div
          className={cn(
            "fixed inset-x-0 top-4 z-[60] px-4 supports-[env(safe-area-inset-top)]:pt-[calc(env(safe-area-inset-top)+8px)] sm:left-1/2 sm:top-20 sm:w-auto sm:-translate-x-1/2 sm:px-0 sm:right-auto",
            className,
          )}
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 28,
            mass: 0.8,
          }}
        >
          <Card
            className={cn(
              "relative mx-auto flex w-full max-w-[440px] items-center gap-2 overflow-hidden rounded-[20px] border border-white/35 bg-white/60 px-3 py-2 text-[11px] shadow-[0_24px_55px_-28px_rgba(15,23,42,0.48)] backdrop-blur-[22px] transition-[border,background] hover:border-white/55 hover:bg-white/70 dark:border-white/12 dark:bg-[#121624]/70 dark:hover:border-white/18 dark:hover:bg-[#121624]/80 sm:px-4 sm:py-[10px] sm:gap-3",
            )}
          >
            <span className="pointer-events-none absolute inset-[-30%] h-[200%] w-[200%] rotate-6 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_65%)]" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-white/25 dark:bg-white/10" />
            <div className="flex w-full items-center gap-2 sm:gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-1 items-center gap-2 rounded-[16px] px-2 py-1.5 transition-colors hover:bg-white/35 dark:hover:bg-white/10 sm:px-3">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-[16px]",
                        isMarketOpen
                          ? "bg-emerald-400/18 text-emerald-500"
                          : "bg-rose-400/18 text-rose-500",
                      )}
                    >
                      <span
                        className={cn(
                          "block h-1.5 w-1.5 rounded-full",
                          isMarketOpen ? "bg-emerald-400" : "bg-rose-400",
                        )}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5 text-slate-900 dark:text-slate-50">
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold">
                        <span>{sessionPhase}</span>
                        <span className={cn(
                          "rounded-full px-2 py-[3px] text-[9px] font-medium tracking-[0.18em] shadow-sm ring-1",
                          isMarketOpen
                            ? "bg-white/70 text-emerald-500 ring-white/50 dark:bg-white/10 dark:text-emerald-200 dark:ring-white/15"
                            : "bg-white/70 text-slate-500 ring-white/50 dark:bg-white/10 dark:text-slate-200 dark:ring-white/15",
                        )}>
                          {isMarketOpen ? "LIVE" : "CLOSED"}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-300">
                        {isMarketOpen
                          ? `예측 ${remainingSlots}회 남음`
                          : `오늘 예측 ${totalPredictions}회`}
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent sideOffset={12} className="max-w-xs text-xs">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">세션 정보</div>
                    <div className="text-slate-500 dark:text-slate-300">Phase: {sessionPhase}</div>
                    {tradingDay && (
                      <div className="text-slate-500 dark:text-slate-300">거래일: {tradingDay}</div>
                    )}
                  </div>
                  <div className="space-y-1 pt-2">
                    <div className="text-sm font-semibold">예측 현황</div>
                    <div className="text-slate-500 dark:text-slate-300">
                      예측 가능: {remainingSlots}회
                    </div>
                    <div className="text-slate-500 dark:text-slate-300">
                      {predictionStatusDescription}
                    </div>
                    <div className="text-slate-500 dark:text-slate-300">
                      오늘 등록: {totalPredictions}회
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>

              <span className="hidden h-7 w-px bg-white/30 dark:bg-white/10 sm:block" />

              {cooldownSummaryText ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-1 items-center gap-2 rounded-[16px] px-2 py-1.5 transition-colors hover:bg-white/35 dark:hover:bg-white/10 sm:px-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-[16px] bg-sky-400/18 text-sky-500 dark:bg-sky-500/18 dark:text-sky-200">
                        <Timer className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate text-[11px] font-semibold text-slate-900 dark:text-slate-50">
                        {cooldownSummaryText}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={12} className="text-xs">
                    {cooldownError
                      ? "슬롯 상태를 확인하는 중 문제가 발생했습니다"
                      : cooldown?.next_refill_at
                        ? `다음 충전: ${new Date(cooldown.next_refill_at).toLocaleString()}`
                        : "쿨다운이 활성화되어 있지 않습니다"}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div className="hidden flex-1 items-center text-[10px] font-medium text-slate-500 dark:text-slate-300 sm:flex">
                  쿨다운 없음
                </div>
              )}

              <span className="hidden h-7 w-px bg-white/30 dark:bg-white/10 sm:block" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex min-w-[96px] items-center justify-end gap-2 rounded-[16px] px-2 py-1.5 text-right transition-colors hover:bg-white/35 dark:hover:bg-white/10 sm:justify-center sm:px-3 sm:text-left">
                    <div className="flex h-7 w-7 items-center justify-center rounded-[16px] bg-amber-400/18 text-amber-500 dark:bg-amber-500/18 dark:text-amber-200">
                      <Coins className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11.5px] font-semibold text-slate-900 dark:text-slate-50">
                      {(pointsBalance?.balance ?? 0).toLocaleString()} P
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent sideOffset={12} className="text-xs">
                  현재 적립된 포인트 잔액입니다.
                </TooltipContent>
              </Tooltip>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
