import SignalDetailPage from "@/components/signal/SignalDetailPage";
import { Suspense } from "react";

export default async function DetailPage({
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
    <Suspense fallback={<div>Loading...</div>}>
      {/* <SignalDetailPage
        symbol={symbol}
        aiModel={model}
        date={date ?? new Date().toISOString().split("T")[0]}
      /> */}
    </Suspense>
  );
}
