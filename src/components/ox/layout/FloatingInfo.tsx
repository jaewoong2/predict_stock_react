"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingUp, Coins } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTodaySession } from "@/hooks/useSession";
import {
  useRemainingPredictions,
  usePredictionsForDay,
} from "@/hooks/usePrediction";
import { usePointsBalance } from "@/hooks/usePoints";
import { cn } from "@/lib/utils";

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

  // 전역(window) 스크롤만 감지하여 이중 스크롤 이슈 제거
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

  return (
    <AnimatePresence>
      {showDock && (
        <motion.div
          className={cn(
            "fixed top-20 left-1/2 z-[60] max-w-full -translate-x-1/2",
            className,
          )}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 28,
            mass: 0.8,
          }}
        >
          <div
            className={cn(
              "flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/85 px-2 py-1.5 text-xs shadow-md backdrop-blur-xl",
            )}
          >
            {/* 세션 상태 칩 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex cursor-default items-center gap-2 rounded-full border px-3 py-1.5 font-medium select-none",
                    isMarketOpen
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-gray-200 bg-gray-50 text-gray-700",
                  )}
                >
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      isMarketOpen ? "bg-green-500" : "bg-red-500",
                    )}
                  />

                  <span>{isMarketOpen ? "예측 가능" : "예측 마감"}</span>
                  <span>{remainingSlots}회</span>
                  <Badge
                    variant={isMarketOpen ? "default" : "secondary"}
                    className="ml-1"
                  >
                    {sessionPhase}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>
                <div className="space-y-1">
                  <div className="font-semibold">세션 상태</div>
                  <div className="opacity-90">Phase: {sessionPhase}</div>
                  {tradingDay && (
                    <div className="opacity-90">거래일: {tradingDay}</div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="font-semibold">예측 현황</div>
                  <div className="opacity-90">
                    오늘 예측: {totalPredictions}회
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>

            {/* 포인트 칩 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex cursor-default items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 font-medium text-amber-800 select-none">
                  <Coins className="h-3.5 w-3.5 text-amber-500" />
                  <span>
                    {(pointsBalance?.balance ?? 0).toLocaleString()} P
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>내 포인트 잔액</TooltipContent>
            </Tooltip>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
