import { SignalDetailView } from "@/components/signal/SignalDetailView";
import { Suspense } from "react";

export default async function ModalPage({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{
    model?: string;
    date?: string;
    strategy_type?: string;
  }>;
}) {
  const { symbol } = await params;
  const { model = "OPENAI", date } = await searchParams;

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
