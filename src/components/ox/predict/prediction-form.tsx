"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useSubmitPrediction } from "@/hooks/usePrediction";
import { useTodayUniverseWithPrices } from "@/hooks/useUniverse";
import { useTodaySession } from "@/hooks/useSession";
import { useRemainingPredictions } from "@/hooks/usePrediction";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Coins,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePointsBalance } from "@/hooks/usePoints";
import { PredictionChoice } from "@/types/prediction";
import { SessionPhase } from "@/types/session";

interface PredictionFormProps {
  initialSymbol?: string;
}

export function PredictionForm({ initialSymbol }: PredictionFormProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(
    initialSymbol || "",
  );
  const [selectedChoice, setSelectedChoice] = useState<PredictionChoice | null>(
    null,
  );

  const { data: universe } = useTodayUniverseWithPrices();
  const { data: session } = useTodaySession();
  const { data: remainingPredictions } = useRemainingPredictions(
    session?.session?.trading_day || new Date().toISOString().split("T")[0],
  );
  const { data: pointsBalance } = usePointsBalance();

  const submitPrediction = useSubmitPrediction();

  // 초기 심볼 프리셀렉트 지원 (prop → state 동기화)
  // 사용자가 변경 가능하도록 Select는 그대로 노출
  useEffect(() => {
    if (initialSymbol && selectedSymbol !== initialSymbol) {
      setSelectedSymbol(initialSymbol);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSymbol]);

  const handleSubmit = async () => {
    if (!selectedSymbol || !selectedChoice) {
      toast.error("입력 오류", {
        description: "종목과 예측 방향을 모두 선택해주세요.",
      });
      return;
    }

    if (remainingPredictions === 0) {
      toast.error("예측 한도 초과", {
        description: "오늘의 예측 한도를 모두 사용했습니다.",
      });
      return;
    }

    try {
      await submitPrediction.mutateAsync({
        symbol: selectedSymbol,
        choice: selectedChoice,
      });

      toast.success("예측 제출 완료", {
        description: `${selectedSymbol} ${selectedChoice === "UP" ? "상승" : "하락"} 예측이 제출되었습니다.`,
      });

      // 폼 초기화
      setSelectedSymbol("");
      setSelectedChoice(null);
    } catch (error) {
      toast.error("예측 제출 실패", {
        description: "예측 제출 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    }
  };

  const selectedStock = universe?.symbols?.find(
    (item) => item.symbol === selectedSymbol,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>예측 제출</span>
        </CardTitle>
        <CardDescription>
          오늘의 종목에 대해 O/X 예측을 제출하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Session Status */}
        <div className="bg-muted flex items-center justify-between rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                session?.session?.phase === SessionPhase.OPEN
                  ? "bg-green-500"
                  : "bg-red-500",
              )}
            />
            <span className="text-sm font-medium">
              {session?.session?.phase === SessionPhase.OPEN
                ? "예측 가능"
                : "예측 마감"}
            </span>
          </div>
          <div className="text-muted-foreground flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Coins className="h-4 w-4" />
              <span>{pointsBalance?.balance?.toLocaleString() || 0} P</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4" />
              <span>남은 예측: {remainingPredictions || 0}회</span>
            </div>
          </div>
        </div>

        {/* Stock Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">종목 선택</label>
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger>
              <SelectValue placeholder="예측할 종목을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {universe?.symbols?.map((item) => (
                <SelectItem key={item.symbol} value={item.symbol}>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.symbol}</span>
                    <span className="text-muted-foreground">
                      ({item.company_name})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Stock Info */}
        {selectedStock && (
          <div className="bg-muted/50 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{selectedStock.symbol}</h4>
                <p className="text-muted-foreground text-sm">
                  {selectedStock.company_name}
                </p>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  ₩{selectedStock.current_price?.toLocaleString()}
                </div>
                <div
                  className={cn(
                    "text-sm",
                    selectedStock.change_direction === PredictionChoice.UP
                      ? "text-green-500"
                      : "text-red-500",
                  )}
                >
                  {selectedStock.change_percent > 0 ? "+" : ""}
                  {selectedStock.change_percent?.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prediction Choice */}
        <div className="space-y-2">
          <label className="text-sm font-medium">예측 방향</label>
          <div className="flex space-x-2">
            <Button
              variant={
                selectedChoice === PredictionChoice.UP ? "default" : "outline"
              }
              className={cn(
                "flex-1",
                selectedChoice === PredictionChoice.UP &&
                  "bg-green-500 hover:bg-green-600",
              )}
              onClick={() => setSelectedChoice(PredictionChoice.UP)}
              disabled={session?.session?.phase !== SessionPhase.OPEN}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              상승 (O)
            </Button>
            <Button
              variant={
                selectedChoice === PredictionChoice.DOWN ? "default" : "outline"
              }
              className={cn(
                "flex-1",
                selectedChoice === PredictionChoice.DOWN &&
                  "bg-red-500 hover:bg-red-600",
              )}
              onClick={() => setSelectedChoice(PredictionChoice.DOWN)}
              disabled={session?.session?.phase !== SessionPhase.OPEN}
            >
              <TrendingDown className="mr-2 h-4 w-4" />
              하락 (X)
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={
            !selectedSymbol ||
            !selectedChoice ||
            session?.session?.phase !== SessionPhase.OPEN ||
            remainingPredictions === 0 ||
            submitPrediction.isPending
          }
          className="w-full"
        >
          {submitPrediction.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
              예측 제출 중...
            </>
          ) : (
            "예측 제출"
          )}
        </Button>

        {/* Warning Messages */}
        {session?.session?.phase !== SessionPhase.OPEN && (
          <div className="flex items-center space-x-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              현재 예측이 불가능한 상태입니다.
            </span>
          </div>
        )}

        {remainingPredictions === 0 && (
          <div className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800">
              오늘의 예측 한도를 모두 사용했습니다.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
