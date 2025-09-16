"use client";

import { PredictionButton } from "@/components/ox/predict/PredictionButton";
import { PredictionCancelButton } from "@/components/ox/predict/PredictionCancelButton";
import { PredictionChoice } from "@/types/prediction";

type PredictActionBarProps = {
  symbol: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "compact";
  showCancel?: boolean;
};

export function PredictActionBar({ symbol, size = "sm", variant = "outline", showCancel = true }: PredictActionBarProps) {
  return (
    <div className="flex items-center gap-2">
      <PredictionButton symbol={symbol} choice={PredictionChoice.UP} size={size} variant={variant} />
      <PredictionButton symbol={symbol} choice={PredictionChoice.DOWN} size={size} variant={variant} />
      {showCancel && <PredictionCancelButton symbol={symbol} size={size} variant="outline" />}
    </div>
  );
}

