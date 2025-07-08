import { SignalDetailView } from "@/components/signal/SignalDetailView";

export default async function ModalPage({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ model?: string; date?: string }>;
}) {
  const model = (await searchParams).model ?? "OPENAI";
  const date =
    (await searchParams).date ?? new Date().toISOString().split("T")[0];
  const symbol = (await params).symbol;
  return (
    <SignalDetailView open={true} symbol={symbol} aiModel={model} date={date} />
  );
}
