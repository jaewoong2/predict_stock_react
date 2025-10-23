"use client";
import { SignalDetailContent } from "./SignalDetailContent";
import { SignalAPIResponse } from "@/types/signal";

interface SignalDetailPageProps {
  symbol: string;
  aiModel: string;
  date: string;
  initialData?: SignalAPIResponse | null;
}

export default function SignalDetailPage({
  symbol,
  aiModel,
  date,
  initialData,
}: SignalDetailPageProps) {
  return (
    <SignalDetailContent
      symbol={symbol}
      aiModel={aiModel}
      date={date}
      initialData={initialData}
    />
  );
}
