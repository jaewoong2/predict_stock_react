"use client";

import { PredictionButton } from "@/components/ox/predict/PredictionButton";
import { PredictionChoice } from "@/types/prediction";

type PredictActionBarProps = {
  symbol: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "compact";
};

export function PredictActionBar({ symbol, size = "sm", variant = "outline" }: PredictActionBarProps) {
  return (
    <div className="flex items-center gap-2">
      <PredictionButton symbol={symbol} choice={PredictionChoice.UP} size={size} variant={variant} />
      <PredictionButton symbol={symbol} choice={PredictionChoice.DOWN} size={size} variant={variant} />
    </div>
  );
}
