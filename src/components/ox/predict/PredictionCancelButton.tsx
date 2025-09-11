"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  useCancelPrediction,
  usePredictionsForDay,
} from "@/hooks/usePrediction";
import { useTodaySession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";

interface PredictionCancelButtonProps {
  symbol: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "destructive" | "outline" | "secondary";
}

export function PredictionCancelButton({
  symbol,
  className,
  size = "sm",
  variant = "outline",
}: PredictionCancelButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const { data: session } = useTodaySession();
  const tradingDay = session?.session?.trading_day || "";
  const { data: todayPredictions } = usePredictionsForDay(tradingDay);
  const cancelPrediction = useCancelPrediction();

  // 현재 심볼에 대한 예측 찾기
  const prediction = todayPredictions?.predictions.find(
    (p) => p.symbol === symbol,
  );

  // 취소 가능 시간 계산 (5분 제한)
  useEffect(() => {
    if (!prediction?.submitted_at) return;

    const updateTimeLeft = () => {
      const createdAt = new Date(prediction.submitted_at);
      const fiveMinutesLater = new Date(createdAt.getTime() + 5 * 60 * 1000);
      const now = new Date();
      const remaining = Math.max(
        0,
        Math.floor((fiveMinutesLater.getTime() - now.getTime()) / 1000),
      );

      setTimeLeft(remaining);

      if (remaining === 0) {
        setIsConfirming(false);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [prediction?.submitted_at]);

  const canCancel = prediction?.status === "PENDING" && (timeLeft || 0) > 0;

  const handleCancel = useCallback(async () => {
    if (!prediction || !canCancel) return;

    try {
      await cancelPrediction.mutateAsync(prediction.id);

      toast.success("예측 취소 완료", {
        description: `${symbol} 예측이 취소되었습니다.`,
      });

      setIsConfirming(false);
    } catch (error) {
      toast.error("취소 실패", {
        description: "예측 취소에 실패했습니다. 다시 시도해주세요.",
      });
    }
  }, [prediction, canCancel, cancelPrediction, symbol]);

  const handleClick = useCallback(() => {
    if (!canCancel) {
      toast.error("취소 불가", {
        description: "예측 제출 후 5분이 지나 취소할 수 없습니다.",
      });
      return;
    }

    if (isConfirming) {
      handleCancel();
    } else {
      setIsConfirming(true);
      // 3초 후 확인 상태 해제
      setTimeout(() => setIsConfirming(false), 3000);
    }
  }, [canCancel, isConfirming, handleCancel]);

  // 예측이 없으면 표시하지 않음
  if (!prediction) return null;

  // 시간 포맷팅 (mm:ss)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getButtonContent = () => {
    if (cancelPrediction.isPending) {
      return (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          취소 중...
        </>
      );
    }

    if (isConfirming) {
      return (
        <>
          <AlertTriangle className="h-3 w-3" />
          확인
        </>
      );
    }

    return (
      <>
        <X className="h-3 w-3" />
        취소
      </>
    );
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-7 px-2 text-xs";
      case "lg":
        return "h-10 px-4 text-base";
      default:
        return "h-8 px-3 text-sm";
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        disabled={!canCancel || cancelPrediction.isPending}
        variant={isConfirming ? "destructive" : variant}
        className={cn(
          "gap-1 transition-all duration-200",
          getSizeClasses(),
          isConfirming && "animate-pulse",
          className,
        )}
      >
        {getButtonContent()}
      </Button>

      {/* 남은 시간 표시 */}
      {canCancel && timeLeft !== null && timeLeft > 0 && (
        <div className="absolute -bottom-5 left-0 flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      )}

      {/* 취소 불가 안내 */}
      {prediction && !canCancel && prediction.status === "PENDING" && (
        <div className="absolute -bottom-5 left-0 text-xs text-red-500">
          취소 시간 초과
        </div>
      )}
    </div>
  );
}
