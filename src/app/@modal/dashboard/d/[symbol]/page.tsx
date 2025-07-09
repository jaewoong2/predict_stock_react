import { SignalDetailView } from "@/components/signal/SignalDetailView";
import { Suspense } from "react";

export default function ModalPage({
  params,
  searchParams,
}: {
  params: { symbol: string };
  searchParams: { model?: string; date?: string; strategy_type?: string };
}) {
  const { symbol } = params;
  const { model = "OPENAI", date } = searchParams;

  return (
    <Suspense>
      <SignalDetailView
        symbol={symbol}
        aiModel={model}
        date={date ?? new Date().toISOString().split("T")[0]}
      />
    </Suspense>
  );
}
