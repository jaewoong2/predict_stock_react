"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { SignalDetailView } from "@/components/signal/SignalDetailView";

export default function ModalPage({ params }: { params: { symbol: string } }) {
  const searchParams = useSearchParams();
  const model = searchParams.get("model") ?? "OPENAI";
  const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0];
  const router = useRouter();
  return (
    <SignalDetailView
      open={true}
      onOpenChange={() => router.back()}
      symbol={params.symbol}
      aiModel={model}
      date={date}
    />
  );
}
