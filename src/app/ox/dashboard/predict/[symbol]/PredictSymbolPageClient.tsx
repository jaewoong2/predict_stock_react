"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PredictionModalOverlay } from "@/components/ox/predict/PredictionModal";
import { Button } from "@/components/ui/button";

export default function PredictSymbolPageClient({
  params,
  searchParams,
}: {
  params: { symbol: string };
  searchParams: { probability?: string | null; model?: string | null };
}) {
  const router = useRouter();
  const { symbol } = params;
  const { probability = null, model = null } = searchParams;

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        대시보드로 돌아가기
      </Button>

      <div className="rounded-lg border bg-background p-6 shadow-sm">
        <PredictionModalOverlay
          symbol={symbol}
          aiProbability={probability}
          aiModel={model}
          onClose={() => router.back()}
        />
      </div>
    </div>
  );
}
