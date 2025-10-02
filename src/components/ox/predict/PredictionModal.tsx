"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Prediction, PredictionChoice } from "@/types/prediction";
import { cn } from "@/lib/utils";
import { useSignalDataByNameAndDate } from "@/hooks/useSignal";
import { useDashboardFilters } from "@/hooks/useDashboard";
import {
  useCancelPrediction,
  usePredictionsForDay,
  useSubmitPrediction,
  useUpdatePrediction,
} from "@/hooks/usePrediction";
import { useTodaySession } from "@/hooks/useSession";
import { useAuth } from "@/hooks/useAuth";
import { SessionPhase } from "@/types/session";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";
import { useCurrentPrice, useEodPrice } from "@/hooks/usePrice";
import { UnauthorizedError } from "@/services/api";

type BasePredictionModalProps = {
  symbol?: string | null;
  aiProbability?: string | null;
  aiModel?: string | null;
};

type UsePredictionModalStateProps = BasePredictionModalProps & {
  open: boolean;
  onClose: () => void;
};

type PriceValue = number | null;
type PercentageValue = number | null;
type ChangeDirection = "UP" | "DOWN" | "FLAT" | null;

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

interface ValidatedPriceData {
  readonly currentPrice: PriceValue;
  readonly previousClose: PriceValue;
  readonly priceDiff: PriceValue;
  readonly changePct: PercentageValue;
  readonly changeDirection: ChangeDirection;
}

type PredictionModalState = {
  readonly shouldRender: boolean;
  readonly normalizedSymbol: string;
  readonly logoUrl: string;
  readonly aiModel: string | null;
  readonly resolvedProbability: string | null;
  readonly isCurrentPriceLoading: boolean;
  readonly isCurrentPriceError: boolean;
  readonly priceData: ValidatedPriceData;
  readonly isPriceDifferenceLoading: boolean;
  readonly isPriceDifferenceError: boolean;
  readonly existingPrediction: Prediction | null;
  readonly isMutating: boolean;
  readonly isPredictionsLoading: boolean;
  readonly effectiveDate: string;
  readonly strategyType: string;
  readonly formatPrice: (value: PriceValue) => string;
  readonly handlePrediction: (choice: PredictionChoice) => Promise<void>;
  readonly handleCancel: () => Promise<void>;
  readonly close: () => void;
};

function usePredictionModalState({
  symbol,
  aiProbability,
  aiModel,
  open,
  onClose,
}: UsePredictionModalStateProps): PredictionModalState {
  const { date, strategy_type } = useDashboardFilters();
  const effectiveDate = date || new Date().toISOString().split("T")[0];

  const normalizedSymbol = symbol?.toUpperCase() ?? "";
  const symbolsForQuery = useMemo(
    () => (normalizedSymbol ? [normalizedSymbol] : []),
    [normalizedSymbol],
  );
  const { data: signalData } = useSignalDataByNameAndDate(
    symbolsForQuery,
    effectiveDate,
    strategy_type,
    { enabled: open && symbolsForQuery.length > 0 },
  );

  const { data: session } = useTodaySession();
  const tradingDay =
    session?.session?.trading_day || new Date().toISOString().split("T")[0];
  const { data: predictionsForDay, isLoading: isPredictionsLoading } =
    usePredictionsForDay(tradingDay);
  const existingPrediction = useMemo(() => {
    const list = predictionsForDay?.predictions ?? [];
    if (!normalizedSymbol) return null;
    return list.find((p) => p.symbol === normalizedSymbol) || null;
  }, [predictionsForDay?.predictions, normalizedSymbol]);

  const { isAuthenticated, showLogin } = useAuth();
  const isMarketOpen = session?.session?.phase === SessionPhase.OPEN;

  const submitPrediction = useSubmitPrediction();
  const updatePrediction = useUpdatePrediction();
  const cancelPrediction = useCancelPrediction();
  const isMutating =
    submitPrediction.isPending ||
    updatePrediction.isPending ||
    cancelPrediction.isPending;

  const {
    data: currentPriceResponse,
    isLoading: isCurrentPriceLoading,
    isError: isCurrentPriceError,
  } = useCurrentPrice(normalizedSymbol, {
    enabled: open && !!normalizedSymbol,
  });

  const currentPriceData = currentPriceResponse?.price;

  const previousTradingDay = useMemo(() => {
    if (!effectiveDate) return null;
    const base = dayjs(effectiveDate);
    if (!base.isValid()) return null;

    let cursor = base.subtract(1, "day");
    for (let i = 0; i < 7; i++) {
      if (cursor.day() === 0 || cursor.day() === 6) {
        cursor = cursor.subtract(1, "day");
        continue;
      }
      return cursor.format("YYYY-MM-DD");
    }
    return null;
  }, [effectiveDate]);

  const {
    data: previousEodResponse,
    isLoading: isPreviousEodLoading,
    isError: isPreviousEodError,
    error: previousEodError,
    isFetching: isPreviousEodFetching,
    status: previousEodStatus,
  } = useEodPrice(normalizedSymbol, previousTradingDay ?? "", {
    enabled: open && !!previousTradingDay && !!normalizedSymbol,
  });

  const previousEodPrice = previousEodResponse?.eod_price;

  // Type guards
  const isValidPrice = (value: unknown): value is number => {
    return typeof value === "number" && !isNaN(value) && isFinite(value);
  };

  const isValidPriceValue = (value: PriceValue): value is number => {
    return value !== null && isValidPrice(value);
  };

  const validateAndExtractPrice = useCallback((value: unknown): PriceValue => {
    return isValidPrice(value) ? value : null;
  }, []);

  const priceData = useMemo((): ValidatedPriceData => {
    const currentPrice = validateAndExtractPrice(
      currentPriceData?.current_price,
    );
    const previousClose =
      validateAndExtractPrice(previousEodPrice?.close_price) ??
      validateAndExtractPrice(currentPriceData?.previous_close);

    if (
      !isValidPriceValue(currentPrice) ||
      !isValidPriceValue(previousClose) ||
      previousClose === 0
    ) {
      return {
        currentPrice,
        previousClose,
        priceDiff: null,
        changePct: null,
        changeDirection: null,
      };
    }

    const calculatedDiff = currentPrice - previousClose;
    const calculatedPct = (calculatedDiff / previousClose) * 100;

    const priceDiff =
      validateAndExtractPrice(currentPriceData?.change) ?? calculatedDiff;
    const changePct =
      validateAndExtractPrice(currentPriceData?.change_percent) ??
      calculatedPct;

    const changeDirection: ChangeDirection = !isValidPriceValue(changePct)
      ? null
      : changePct > 0
        ? "UP"
        : changePct < 0
          ? "DOWN"
          : "FLAT";

    return {
      currentPrice,
      previousClose,
      priceDiff,
      changePct,
      changeDirection,
    };
  }, [
    currentPriceData?.current_price,
    currentPriceData?.change,
    currentPriceData?.change_percent,
    currentPriceData?.previous_close,
    previousEodPrice?.close_price,
    validateAndExtractPrice,
    normalizedSymbol,
    isCurrentPriceLoading,
    isCurrentPriceError,
    isPreviousEodLoading,
    isPreviousEodError,
  ]);

  const isPriceDifferenceLoading =
    isCurrentPriceLoading || isPreviousEodLoading;
  const isPriceDifferenceError =
    isCurrentPriceError ||
    (isPreviousEodError && !isValidPriceValue(priceData.previousClose));

  const formatPrice = useCallback((value: PriceValue): string => {
    if (!isValidPriceValue(value)) return "--";
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  const logoBase = process.env.NEXT_PUBLIC_IMAGE_URL || "";
  const logoUrl = `${logoBase}/logos/${normalizedSymbol}.png`;

  const resolvedProbability = useMemo(() => {
    const list = signalData?.signals ?? [];
    if (list.length === 0) return aiProbability ?? null;
    const byModel = aiModel
      ? list.find((s) => s.signal.ai_model === aiModel)
      : list[0];
    return byModel?.signal.probability ?? aiProbability ?? null;
  }, [signalData?.signals, aiModel, aiProbability]);

  const handlePrediction = useCallback(
    async (choice: PredictionChoice): Promise<void> => {
      // Early validation with type guards
      if (!normalizedSymbol || normalizedSymbol.trim() === "") {
        console.warn("Invalid symbol provided to handlePrediction");
        return;
      }

      if (!Object.values(PredictionChoice).includes(choice)) {
        console.error("Invalid prediction choice:", choice);
        return;
      }

      if (!isAuthenticated) {
        showLogin();
        return;
      }

      if (!isMarketOpen) {
        toast.error("예측 불가", {
          description: "현재 예측이 마감되었습니다.",
        });
        return;
      }

      try {
        if (!existingPrediction) {
          await submitPrediction.mutateAsync({
            symbol: normalizedSymbol.trim(),
            choice,
          });
          toast.success("예측 완료", {
            description: `${normalizedSymbol} ${choice === PredictionChoice.UP ? "상승" : "하락"} 예측이 제출되었습니다.`,
          });
        } else if (existingPrediction.choice !== choice) {
          await updatePrediction.mutateAsync({
            predictionId: existingPrediction.id,
            choice,
          });
          toast.success("예측 수정", {
            description: `${normalizedSymbol} 예측이 ${choice === PredictionChoice.UP ? "상승" : "하락"}으로 변경되었습니다.`,
          });
        } else {
          toast.info("이미 제출된 예측입니다.", {
            description: "동일한 방향으로 이미 예측했습니다.",
          });
          return;
        }

        onClose();
      } catch (error) {
        if (isAuthenticationError(error)) {
          showLogin();
          toast.error("로그인이 필요합니다", {
            description: "예측을 제출하려면 로그인이 필요합니다.",
          });
          return;
        }
        console.error("Prediction submission failed:", error);
        toast.error("예측 처리 실패", {
          description:
            "예측 요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.",
        });
      }
    },
    [
      existingPrediction,
      isAuthenticated,
      isMarketOpen,
      normalizedSymbol,
      onClose,
      showLogin,
      submitPrediction,
      updatePrediction,
    ],
  );

  const handleCancel = useCallback(async (): Promise<void> => {
    if (!existingPrediction?.id) {
      console.warn("No existing prediction to cancel");
      return;
    }

    if (!isAuthenticated) {
      showLogin();
      return;
    }

    if (!isMarketOpen) {
      toast.error("예측 불가", {
        description: "현재 예측이 마감되었습니다.",
      });
      return;
    }

    try {
      await cancelPrediction.mutateAsync(existingPrediction.id);
      toast.success("예측 취소", {
        description: `${normalizedSymbol} 예측이 취소되었습니다.`,
      });
      onClose();
    } catch (error) {
      if (isAuthenticationError(error)) {
        showLogin();
        toast.error("로그인이 필요합니다", {
          description: "예측을 취소하려면 로그인이 필요합니다.",
        });
        return;
      }
      console.error("Prediction cancellation failed:", error);
      toast.error("예측 취소 실패", {
        description: "예측을 취소하지 못했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  }, [
    cancelPrediction,
    existingPrediction?.id,
    isAuthenticated,
    isMarketOpen,
    normalizedSymbol,
    onClose,
    showLogin,
  ]);

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  return {
    shouldRender: normalizedSymbol.length > 0,
    normalizedSymbol,
    logoUrl,
    aiModel: aiModel ?? null,
    resolvedProbability,
    isCurrentPriceLoading,
    isCurrentPriceError,
    priceData,
    isPriceDifferenceLoading,
    isPriceDifferenceError,
    existingPrediction,
    isMutating,
    isPredictionsLoading,
    effectiveDate,
    strategyType: strategy_type ?? "",
    formatPrice,
    handlePrediction,
    handleCancel,
    close,
  } as const;
}

function PredictionModalContent(state: PredictionModalState) {
  const {
    shouldRender,
    normalizedSymbol,
    logoUrl,
    aiModel,
    resolvedProbability,
    isCurrentPriceLoading,
    isCurrentPriceError,
    priceData,
    isPriceDifferenceLoading,
    isPriceDifferenceError,
    existingPrediction,
    isMutating,
    isPredictionsLoading,
    effectiveDate,
    formatPrice,
    handlePrediction,
    handleCancel,
  } = state;

  const { currentPrice, priceDiff, changePct, changeDirection } = priceData;

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <DialogHeader className="space-y-1.5">
        <DialogTitle className="flex items-center gap-2.5 text-xl font-semibold">
          <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-100 p-1.5">
            <img
              width={24}
              height={24}
              loading="lazy"
              src={logoUrl}
              alt={`${normalizedSymbol} logo`}
              className="h-6 w-6"
            />
          </div>
          {normalizedSymbol}
        </DialogTitle>
        <DialogDescription className="flex w-full justify-start text-sm text-gray-600">
          오늘 주가를 예측해보세요
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="mb-1.5 text-xs font-medium text-gray-500">
                현재가
              </div>
              {isCurrentPriceLoading ? (
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  로딩 중...
                </div>
              ) : isCurrentPriceError ? (
                <div className="text-xs text-red-500">데이터 오류</div>
              ) : (
                <div className="text-base font-semibold text-gray-900">
                  {formatPrice(currentPrice)}
                </div>
              )}
            </div>
            <div>
              <div className="mb-1.5 text-xs font-medium text-gray-500">
                전일 대비
              </div>
              {isPriceDifferenceLoading ? (
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  로딩 중...
                </div>
              ) : isPriceDifferenceError ? (
                <div className="text-xs text-red-500">데이터 오류</div>
              ) : (
                <>
                  <div
                    className={cn(
                      "text-base font-semibold",
                      changeDirection === "UP" && "text-green-600",
                      changeDirection === "DOWN" && "text-red-600",
                      changeDirection === "FLAT" && "text-gray-900",
                    )}
                  >
                    {priceDiff === null
                      ? "--"
                      : `${priceDiff > 0 ? "+" : ""}${formatPrice(priceDiff)}`}
                  </div>
                  {changePct !== null && (
                    <div
                      className={cn(
                        "text-xs",
                        changeDirection === "UP" && "text-green-600",
                        changeDirection === "DOWN" && "text-red-600",
                        changeDirection === "FLAT" && "text-gray-600",
                      )}
                    >
                      {`(${changePct > 0 ? "+" : ""}${changePct.toFixed(2)}%)`}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="text-right sm:text-left">
              <div className="mb-1.5 text-xs font-medium text-gray-500">
                AI 상승 확률
              </div>
              {resolvedProbability ? (
                <Link
                  href={{
                    pathname: `/dashboard/d/${normalizedSymbol}`,
                    query: {
                      model: aiModel || "OPENAI",
                      date: effectiveDate,
                    },
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-[#3182F6] px-3 py-1.5 text-base font-bold text-white transition-colors hover:bg-[#1B64DA]"
                >
                  {resolvedProbability}%
                </Link>
              ) : (
                <div className="text-base font-semibold text-gray-400">N/A</div>
              )}
            </div>
          </div>
        </div>

        {existingPrediction ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-0.5 text-xs font-medium text-gray-500">
                    내 예측
                  </div>
                  <div className="text-base font-semibold text-gray-900">
                    {existingPrediction.choice === PredictionChoice.UP
                      ? "상승"
                      : "하락"}
                  </div>
                </div>
                <Badge
                  variant={
                    existingPrediction.choice === PredictionChoice.UP
                      ? "default"
                      : "destructive"
                  }
                  className="text-xs font-medium"
                >
                  {existingPrediction.choice === PredictionChoice.UP
                    ? "UP"
                    : "DOWN"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                size="default"
                disabled={
                  isMutating ||
                  isPredictionsLoading ||
                  existingPrediction?.choice === PredictionChoice.UP
                }
                className="h-10 rounded-lg bg-green-500 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50"
                onClick={() => handlePrediction(PredictionChoice.UP)}
              >
                상승으로 수정
              </Button>
              <Button
                size="default"
                disabled={
                  isMutating ||
                  isPredictionsLoading ||
                  existingPrediction?.choice === PredictionChoice.DOWN
                }
                className="h-10 rounded-lg bg-red-500 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                onClick={() => handlePrediction(PredictionChoice.DOWN)}
              >
                하락으로 수정
              </Button>
            </div>

            <Button
              variant="outline"
              disabled={isMutating || isPredictionsLoading}
              onClick={handleCancel}
              className="h-10 w-full rounded-lg text-sm font-medium"
            >
              예측 취소
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="default"
              className="h-10 rounded-lg bg-green-500 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50"
              disabled={isMutating || isPredictionsLoading}
              onClick={() => handlePrediction(PredictionChoice.UP)}
            >
              상승 예측
            </Button>
            <Button
              size="default"
              className="h-10 rounded-lg bg-red-500 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
              disabled={isMutating || isPredictionsLoading}
              onClick={() => handlePrediction(PredictionChoice.DOWN)}
            >
              하락 예측
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export type PredictionModalProps = BasePredictionModalProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PredictionModal({
  open,
  onOpenChange,
  symbol,
  aiProbability,
  aiModel,
}: PredictionModalProps) {
  const state = usePredictionModalState({
    open,
    symbol,
    aiProbability,
    aiModel,
    onClose: () => onOpenChange(false),
  });

  if (!state.shouldRender) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onOpenChange(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <PredictionModalContent {...state} />
      </DialogContent>
    </Dialog>
  );
}

type PredictionModalOverlayProps = BasePredictionModalProps & {
  onClose: () => void;
};

export function PredictionModalOverlay({
  symbol,
  aiProbability,
  aiModel,
  onClose,
}: PredictionModalOverlayProps) {
  const state = usePredictionModalState({
    symbol,
    aiProbability,
    aiModel,
    open: true,
    onClose,
  });

  if (!state.shouldRender) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <PredictionModalContent {...state} />
      </DialogContent>
    </Dialog>
  );
}
