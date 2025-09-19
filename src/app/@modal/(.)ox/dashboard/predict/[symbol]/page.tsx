"use client";

import { Suspense, use } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { PredictionModalOverlay } from "@/components/ox/predict/PredictionModal";

export default function PredictModalPage({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ probability?: string; model?: string }>;
}) {
  const router = useRouter();
  const { symbol } = use(params);
  const { probability = null, model = null } = use(searchParams);

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
