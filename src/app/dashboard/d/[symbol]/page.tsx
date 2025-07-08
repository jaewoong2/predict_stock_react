import { Metadata } from "next";
import SignalDetailPage from "@/components/signal/SignalDetailPage";
import { signalApiService } from "@/services/signalService";

interface PageProps {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{
    model?: string;
    date?: string;
    strategy_type?: string;
  }>;
}

export const runtime = "edge";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const params_ = await params;
  const searchParams_ = await searchParams;
  const date = searchParams_.date ?? new Date().toISOString().split("T")[0];
  const model = searchParams_.model ?? "OPENAI";
  try {
    const data = await signalApiService.getSignalByNameAndDate(
      [params_.symbol],
      date,
      searchParams_.strategy_type,
    );
    const signal = data.signals.find(
      (s) => s.signal.ticker === params_.symbol && s.signal.ai_model === model,
    );
    if (signal) {
      const title = `Forecast ${signal.signal.ticker} Prices | ${signal.signal.ai_model} Model`;
      const description =
        signal.signal.result_description ??
        "Forecast US stock prices using AI models and market signals.";
      return { title, description };
    }
  } catch {
    /* ignore */
  }
  return {
    title: "Forecast US Stock Prices",
    description: "Forecast US stock prices using AI models and market signals.",
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const params_ = await params;
  const searchParams_ = await searchParams;

  const date = searchParams_.date ?? new Date().toISOString().split("T")[0];
  const model = searchParams_.model ?? "OPENAI";
  return (
    <SignalDetailPage symbol={params_.symbol} aiModel={model} date={date} />
  );
}
