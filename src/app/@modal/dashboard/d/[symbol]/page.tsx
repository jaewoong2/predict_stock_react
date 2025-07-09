"use client";
import { SignalDetailView } from "@/components/signal/SignalDetailView";
import { Suspense, use } from "react";

export default function ModalPage({
  searchParams,
  params,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ model?: string; date?: string }>;
}) {
  const searchParams_ = use(searchParams);
  const { model = "OPENAI" } = searchParams_;
  const params_ = use(params);
  const { symbol } = params_;

  const { date = new Date().toISOString().split("T")[0] } = use(searchParams);
  return (
    <Suspense>
      <SignalDetailView symbol={symbol} aiModel={model} date={date} />
    </Suspense>
  );
}
