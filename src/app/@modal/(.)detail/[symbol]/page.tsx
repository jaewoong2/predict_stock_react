import { DetailModalClient } from "@/components/ox/modals/DetailModalClient";

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
    <DetailModalClient
      symbol={symbol}
      model={model}
      date={date ?? new Date().toISOString().split("T")[0]}
    />
  );
}
