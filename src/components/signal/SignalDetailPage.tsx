"use client";
import { SignalDetailContent } from "./SignalDetailContent";

interface SignalDetailPageProps {
  symbol: string;
  aiModel: string;
  date: string;
}

export default function SignalDetailPage({
  symbol,
  aiModel,
  date,
}: SignalDetailPageProps) {
  return <SignalDetailContent symbol={symbol} aiModel={aiModel} date={date} />;
}
