import { PredictModalClient } from "@/components/ox/dashboard/predict/PredictModalClient";

export default async function PredictModalPage({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ probability?: string; model?: string; date?: string }>;
}) {
  const { symbol } = await params;
  const { probability = null, model = null, date = null } = await searchParams;

  return (
    <PredictModalClient
      symbol={symbol}
      probability={probability ?? null}
      model={model ?? null}
    />
  );
}
