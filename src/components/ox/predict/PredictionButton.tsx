"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Loader2,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  useSubmitPrediction,
  useRemainingPredictions,
  usePredictionsForDay,
} from "@/hooks/usePrediction";
import { useTodaySession } from "@/hooks/useSession";
import { PredictionChoice } from "@/types/prediction";
import { cn } from "@/lib/utils";
import { UnauthorizedError } from "@/services/api";

interface PredictionButtonProps {
  symbol: string;
  choice: PredictionChoice;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "compact";
}

type PredictionState =
  | "idle"
  | "optimistic"
  | "confirming"
  | "confirmed"
  | "failed";

const isAuthenticationError = (error: unknown): boolean => {
  if (error instanceof UnauthorizedError) return true;
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { status?: number } }).response?.status ===
      "number"
  ) {
    const status = (error as { response: { status: number } }).response.status;
    return status === 401 || status === 403;
  }
  return false;
};

export function PredictionButton({
  symbol,
  choice,
  disabled = false,
  className,
  size = "md",
  variant = "default",
}: PredictionButtonProps) {
  const [predictionState, setPredictionState] =
    useState<PredictionState>("idle");
  const [optimisticId, setOptimisticId] = useState<string | null>(null);

  const { isAuthenticated, showLogin } = useAuth();
  const { data: session } = useTodaySession();
  const tradingDay = session?.session?.trading_day || "";
  const { data: remaining } = useRemainingPredictions(tradingDay);
  const { data: todayPredictions } = usePredictionsForDay(tradingDay);
  const submitPrediction = useSubmitPrediction();

  // 현재 심볼에 대한 기존 예측 확인
  const existingPrediction = todayPredictions?.predictions.find(
    (p) => p.symbol === symbol,
  );
  const hasExistingPrediction = !!existingPrediction;
  const isCorrectChoice = existingPrediction?.choice === choice;

  // 예측 가능 상태 확인
  const isMarketOpen = session?.session?.phase === "OPEN";
  const hasSlots = (remaining || 0) > 0;
  const canPredict =
    isAuthenticated && isMarketOpen && hasSlots && !hasExistingPrediction;

  // 버튼 상태 계산
  const isLoading =
    predictionState === "optimistic" || predictionState === "confirming";
  const isConfirmed =
    predictionState === "confirmed" ||
    (hasExistingPrediction && isCorrectChoice);
  const isFailed = predictionState === "failed";

  const handleClick = useCallback(async () => {
    // 1. 로그인 체크
    if (!isAuthenticated) {
      showLogin();
      return;
    }

    // 2. 마켓 상태 체크
    if (!isMarketOpen) {
      toast.error("예측 불가", {
        description: "현재 예측이 마감되었습니다.",
      });
      return;
    }

    // 3. 슬롯 체크
    if (!hasSlots) {
      toast.error("슬롯 부족", {
        description:
          "예측 슬롯이 부족합니다. 광고 시청 또는 쿨다운을 기다려주세요.",
      });
      return;
    }

    // 4. 중복 예측 체크
    if (hasExistingPrediction) {
      toast.error("중복 예측", {
        description: "이미 해당 종목에 대한 예측이 있습니다.",
      });
      return;
    }

    // 5. Optimistic UI 업데이트 시작
    const tempId = `optimistic-${symbol}-${choice}-${Date.now()}`;
    setOptimisticId(tempId);
    setPredictionState("optimistic");

    try {
      // 6. 서버 요청
      setPredictionState("confirming");
      await submitPrediction.mutateAsync({ symbol, choice });

      // 7. 성공 처리
      setPredictionState("confirmed");
      toast.success("예측 완료", {
        description: `${symbol} ${choice === "UP" ? "상승" : "하락"} 예측이 제출되었습니다.`,
      });

      // 8. 일정 시간 후 상태 초기화
      setTimeout(() => {
        setPredictionState("idle");
        setOptimisticId(null);
      }, 2000);
    } catch (error) {
      if (isAuthenticationError(error)) {
        setPredictionState("idle");
        setOptimisticId(null);
        showLogin();
        toast.error("로그인이 필요합니다", {
          description: "예측을 제출하려면 로그인이 필요합니다.",
        });
        return;
      }

      // 9. 실패 처리 - Optimistic 상태 롤백
      setPredictionState("failed");
      toast.error("예측 실패", {
        description: "예측 제출에 실패했습니다. 다시 시도해주세요.",
      });

      // 10. 실패 상태도 일정 시간 후 초기화
      setTimeout(() => {
        setPredictionState("idle");
        setOptimisticId(null);
      }, 3000);
    }
  }, [
    isAuthenticated,
    showLogin,
    isMarketOpen,
    hasSlots,
    hasExistingPrediction,
    symbol,
    choice,
    submitPrediction,
  ]);

  // 버튼 텍스트 및 아이콘 결정
  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {predictionState === "optimistic" ? "제출 중..." : "확인 중..."}
        </>
      );
    }

    if (isConfirmed) {
      return (
        <>
          <Check className="h-4 w-4" />
          {choice === "UP" ? "상승 예측됨" : "하락 예측됨"}
        </>
      );
    }

    if (isFailed) {
      return (
        <>
          <X className="h-4 w-4" />
          실패
        </>
      );
    }

    return (
      <>
        {choice === "UP" ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        {choice === "UP" ? "상승" : "하락"}
      </>
    );
  };

  // 버튼 variant 및 color 결정
  const getButtonVariant = () => {
    if (isConfirmed) return "default";
    if (isFailed) return "destructive";
    if (variant === "outline") return "outline";
    return "default";
  };

  const getButtonColorClasses = () => {
    if (isConfirmed) {
      return choice === "UP"
        ? "bg-green-500 hover:bg-green-600 text-white"
        : "bg-red-500 hover:bg-red-600 text-white";
    }
    if (isFailed) return "bg-red-500 hover:bg-red-600";
    if (predictionState === "optimistic") {
      return choice === "UP"
        ? "bg-green-400 hover:bg-green-500 text-white animate-pulse"
        : "bg-red-400 hover:bg-red-500 text-white animate-pulse";
    }

    // 기본 상태
    if (variant === "outline") {
      return choice === "UP"
        ? "border-green-500 text-green-600 hover:bg-green-50"
        : "border-red-500 text-red-600 hover:bg-red-50";
    }

    return choice === "UP"
      ? "bg-green-500 hover:bg-green-600 text-white"
      : "bg-red-500 hover:bg-red-600 text-white";
  };

  // 크기별 클래스
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 px-3 text-xs";
      case "lg":
        return "h-12 px-6 text-base";
      default:
        return "h-10 px-4 text-sm";
    }
  };

  // 비활성화 조건
  const isButtonDisabled =
    disabled ||
    isLoading ||
    !canPredict ||
    (hasExistingPrediction && !isCorrectChoice);

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        disabled={isButtonDisabled}
        variant={getButtonVariant()}
        className={cn(
          "relative gap-2 transition-all duration-200",
          getSizeClasses(),
          getButtonColorClasses(),
          className,
        )}
      >
        {getButtonContent()}
      </Button>

      {/* 상태 배지 (compact variant가 아닐 때만) */}
      {variant !== "compact" &&
        (hasExistingPrediction || predictionState !== "idle") && (
          <Badge
            variant={
              isConfirmed ? "default" : isFailed ? "destructive" : "secondary"
            }
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
          >
            {isConfirmed ? (
              <Check className="h-3 w-3" />
            ) : isFailed ? (
              <X className="h-3 w-3" />
            ) : isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <AlertTriangle className="h-3 w-3" />
            )}
          </Badge>
        )}
    </div>
  );
}
