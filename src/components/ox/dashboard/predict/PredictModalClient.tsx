"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { PredictionModalOverlay } from "@/components/ox/predict/PredictionModal";

type PredictModalClientProps = {
  symbol: string;
  probability: string | null;
  model: string | null;
};

export function PredictModalClient({
  symbol,
  probability,
  model,
}: PredictModalClientProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-card max-h-[90%] w-[70%] animate-pulse rounded-lg" />
        </div>
      }
    >
      <PredictionModalOverlay
        symbol={symbol}
        aiProbability={probability}
        aiModel={model}
        onClose={handleClose}
      />
    </Suspense>
  );
}
