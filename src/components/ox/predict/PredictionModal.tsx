"use client";

import { useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Prediction,
  PredictionChoice,
} from "@/types/prediction";
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
    error: currentPriceError,
    isFetching: isCurrentPriceFetching,
    status: currentPriceStatus,
  } = useCurrentPrice(normalizedSymbol, {
    enabled: open && !!normalizedSymbol,
  });

  const currentPriceData = currentPriceResponse?.price;

  // 간단한 상태 로그
  console.log(`🔍 [${normalizedSymbol}] Current Price:`, {
    hasData: !!currentPriceData,
    loading: isCurrentPriceLoading,
    error: isCurrentPriceError
  });

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

  // 간단한 상태 로그
  console.log(`🔍 [${normalizedSymbol}] EOD Price:`, {
    hasData: !!previousEodPrice,
    loading: isPreviousEodLoading,
    error: isPreviousEodError
  });

  // Type guards
  const isValidPrice = (value: unknown): value is number => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  };

  const isValidPriceValue = (value: PriceValue): value is number => {
    return value !== null && isValidPrice(value);
  };

  const validateAndExtractPrice = useCallback((value: unknown): PriceValue => {
    return isValidPrice(value) ? value : null;
  }, []);

  const priceData = useMemo((): ValidatedPriceData => {

    const currentPrice = validateAndExtractPrice(currentPriceData?.current_price);
    const previousClose = validateAndExtractPrice(previousEodPrice?.close_price) ??
                         validateAndExtractPrice(currentPriceData?.previous_close);

    // 4. 검증 실패 이유 상세 분석
    if (!isValidPriceValue(currentPrice) || !isValidPriceValue(previousClose) || previousClose === 0) {
      console.group('🚨 가격 데이터 검증 실패 상세 분석');

      console.log('현재가 검증 실패 이유:', {
        '값': currentPrice,
        'null 여부': currentPrice === null,
        'number 타입 여부': typeof currentPrice === 'number',
        'NaN 여부': currentPrice !== null ? isNaN(currentPrice) : 'N/A',
        'Finite 여부': currentPrice !== null ? isFinite(currentPrice) : 'N/A',
      });

      console.log('전일종가 검증 실패 이유:', {
        '값': previousClose,
        'null 여부': previousClose === null,
        'number 타입 여부': typeof previousClose === 'number',
        'NaN 여부': previousClose !== null ? isNaN(previousClose) : 'N/A',
        'Finite 여부': previousClose !== null ? isFinite(previousClose) : 'N/A',
        '0인지 여부': previousClose === 0,
      });

      console.groupEnd();
      console.groupEnd();

      return {
        currentPrice,
        previousClose,
        priceDiff: null,
        changePct: null,
        changeDirection: null,
      };
    }

    // 5. 계산 과정 상세 로그
    const calculatedDiff = currentPrice - previousClose;
    const calculatedPct = (calculatedDiff / previousClose) * 100;

    console.log('🧮 계산 과정:', {
      '현재가': currentPrice,
      '전일종가': previousClose,
      '계산된 차이': calculatedDiff,
      '계산된 퍼센트': calculatedPct,
    });

    const priceDiff = validateAndExtractPrice(currentPriceData?.change) ?? calculatedDiff;
    const changePct = validateAndExtractPrice(currentPriceData?.change_percent) ?? calculatedPct;

    console.log('📈 최종 데이터 선택:', {
      'API 제공 차이': currentPriceData?.change,
      'API 제공 퍼센트': currentPriceData?.change_percent,
      '최종 선택된 차이': priceDiff,
      '최종 선택된 퍼센트': changePct,
      '계산값 사용여부 (차이)': priceDiff === calculatedDiff,
      '계산값 사용여부 (퍼센트)': changePct === calculatedPct,
    });

    const changeDirection: ChangeDirection =
      !isValidPriceValue(changePct) ? null :
      changePct > 0 ? "UP" :
      changePct < 0 ? "DOWN" : "FLAT";

    console.log('🎯 최종 결과:', {
      currentPrice,
      previousClose,
      priceDiff,
      changePct,
      changeDirection,
    });

    console.groupEnd();

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
    isCurrentPriceError || (isPreviousEodError && !isValidPriceValue(priceData.previousClose));

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
      if (!normalizedSymbol || normalizedSymbol.trim() === '') {
        console.warn('Invalid symbol provided to handlePrediction');
        return;
      }

      if (!Object.values(PredictionChoice).includes(choice)) {
        console.error('Invalid prediction choice:', choice);
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
            choice
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
        console.error('Prediction submission failed:', error);
        toast.error("예측 처리 실패", {
          description: "예측 요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.",
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
      console.warn('No existing prediction to cancel');
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
      console.error('Prediction cancellation failed:', error);
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
    formatPrice,
    handlePrediction,
    handleCancel,
    close,
  } = state;

  const { currentPrice, priceDiff, changePct, changeDirection } = priceData;

  console.group(`🎨 [${normalizedSymbol}] PredictionModal 렌더링 분석`);

  console.log('🔄 로딩/에러 상태:', {
    '현재가 로딩중': isCurrentPriceLoading,
    '현재가 에러': isCurrentPriceError,
    '가격차이 로딩중': isPriceDifferenceLoading,
    '가격차이 에러': isPriceDifferenceError,
    '렌더링 가능여부': shouldRender,
  });

  console.log('💸 렌더링에 사용될 가격 데이터:', {
    '현재가': currentPrice,
    '가격차이': priceDiff,
    '변동퍼센트': changePct,
    '변동방향': changeDirection,
    '현재가 포맷결과': formatPrice(currentPrice),
    '가격차이 포맷결과': formatPrice(priceDiff),
  });

  console.log('🖼️ UI 표시 조건 분석:', {
    '현재가 섹션': {
      '로딩중': isCurrentPriceLoading,
      '에러': isCurrentPriceError,
      '정상표시': !isCurrentPriceLoading && !isCurrentPriceError,
      '표시할값': formatPrice(currentPrice),
    },
    '전일대비 섹션': {
      '로딩중': isPriceDifferenceLoading,
      '에러': isPriceDifferenceError,
      '정상표시': !isPriceDifferenceLoading && !isPriceDifferenceError,
      '차이값': priceDiff,
      '퍼센트값': changePct,
      '퍼센트 null여부': changePct === null,
    },
  });

  console.groupEnd();

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <div className="flex items-center justify-center overflow-hidden rounded-full bg-black/10 p-[3px]">
            <img
              width={28}
              height={28}
              loading="lazy"
              src={logoUrl}
              alt={`${normalizedSymbol} logo`}
              className="h-7 w-7"
            />
          </div>
          {normalizedSymbol}
        </DialogTitle>
        <DialogDescription>
          전일 대비 변동과 AI 확률을 확인하고 예측을 제출하세요.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="rounded-xl border p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-gray-500">현재가</div>
              {isCurrentPriceLoading ? (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  로딩 중...
                </div>
              ) : isCurrentPriceError ? (
                <div className="text-sm text-red-500">
                  데이터를 불러오지 못했습니다
                </div>
              ) : (
                <div className="text-lg font-semibold">
                  {formatPrice(currentPrice)}
                </div>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-500">전일 대비</div>
              {isPriceDifferenceLoading ? (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  로딩 중...
                </div>
              ) : isPriceDifferenceError ? (
                <div className="text-sm text-red-500">
                  데이터를 불러오지 못했습니다
                </div>
              ) : (
                <>
                  <div
                    className={cn(
                      "text-lg font-semibold",
                      changeDirection === "UP" && "text-green-600",
                      changeDirection === "DOWN" && "text-red-600",
                      changeDirection === "FLAT" && "text-gray-600",
                    )}
                  >
                    {priceDiff === null
                      ? "--"
                      : `${priceDiff > 0 ? "+" : ""}${formatPrice(priceDiff)}`}
                  </div>
                  {changePct !== null && (
                    <div
                      className={cn(
                        "text-sm",
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
              <div className="text-sm text-gray-500">AI 상승 확률</div>
              <div className="text-lg font-semibold">
                {resolvedProbability ? `[상승] ${resolvedProbability}` : "N/A"}
              </div>
              {aiModel && (
                <div className="mt-1 text-xs text-gray-500">{aiModel}</div>
              )}
            </div>
          </div>
        </div>

        {existingPrediction ? (
          <div className="space-y-3">
            <div className="bg-muted/40 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">내 예측</div>
                  <div className="text-base font-semibold">
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
                >
                  {existingPrediction.choice === PredictionChoice.UP
                    ? "UP"
                    : "DOWN"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                size="lg"
                disabled={
                  isMutating ||
                  isPredictionsLoading ||
                  existingPrediction?.choice === PredictionChoice.UP
                }
                className="bg-green-500 text-white hover:bg-green-600"
                onClick={() => handlePrediction(PredictionChoice.UP)}
              >
                상승으로 수정
              </Button>
              <Button
                size="lg"
                disabled={
                  isMutating ||
                  isPredictionsLoading ||
                  existingPrediction?.choice === PredictionChoice.DOWN
                }
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => handlePrediction(PredictionChoice.DOWN)}
              >
                하락으로 수정
              </Button>
            </div>

            <Button
              variant="outline"
              disabled={isMutating || isPredictionsLoading}
              onClick={handleCancel}
            >
              예측 취소
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="lg"
              className="bg-green-500 text-white hover:bg-green-600"
              disabled={isMutating || isPredictionsLoading}
              onClick={() => handlePrediction(PredictionChoice.UP)}
            >
              상승 예측
            </Button>
            <Button
              size="lg"
              className="bg-red-500 text-white hover:bg-red-600"
              disabled={isMutating || isPredictionsLoading}
              onClick={() => handlePrediction(PredictionChoice.DOWN)}
            >
              하락 예측
            </Button>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={close}>
            닫기
          </Button>
        </div>
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
      <DialogContent className="sm:max-w-md">
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
      <DialogContent className="sm:max-w-md">
        <PredictionModalContent {...state} />
      </DialogContent>
    </Dialog>
  );
}
