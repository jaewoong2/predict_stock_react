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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-card max-h-[90%] w-[70%] animate-pulse rounded-lg" />
        </div>
      }
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          onClick={handleClose}
          className="absolute inset-0 cursor-pointer bg-black/80"
        />
        <div className="bg-background relative z-10 h-full max-h-[90%] w-full max-w-[700px] overflow-y-auto rounded-lg max-lg:max-w-[calc(100%-1rem)]">
          <div className="p-4">
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:bg-muted absolute top-3 right-3 z-20 rounded-full p-1 transition-colors"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
            <PredictionModalOverlay
              symbol={symbol}
              aiProbability={probability}
              aiModel={model}
              onClose={handleClose}
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
