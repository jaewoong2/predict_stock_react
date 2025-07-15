import SignalDetailPage from "@/components/signal/SignalDetailPage";
import { Suspense } from "react";
import type { Metadata } from "next";
import { signalApiService } from "@/services/signalService";
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  const logosDirectory = path.join(process.cwd(), "public/logos");
  const filenames = fs.readdirSync(logosDirectory);

  return filenames.map((filename) => ({
    symbol: filename.replace(/\.png$/, ""),
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{
    model?: string;
    date?: string;
    strategy_type?: string;
  }>;
}): Promise<Metadata> {
  const today = new Date().toISOString().split("T")[0];
  const { symbol } = await params;
  const { model = "OPENAI", date = today, strategy_type } = await searchParams;

  const baseMetadata: Metadata = {
    title: `Forecast ${symbol} Prices | ${model} Model`,
    description: "Forecast US stock prices using AI models and market signals.",
    keywords: [
      "stock forecast",
      "AI prediction",
      "market signals",
      "stock analysis",
      "financial analysis",
      symbol,
      model,
    ],
    authors: [{ name: "Spam Finance" }],
    category: "Finance",
    creator: "Spam Finance Team",
    publisher: "Spam Finance",
    robots: "index, follow",
    alternates: {
      canonical: `https://stock.bamtoly.com/dashboard/d/${symbol}?model=${model}&date=${date}${strategy_type ? `&strategy_type=${strategy_type}` : ""}`,
    },
    openGraph: {
      title: `Forecast ${symbol} Prices | ${model} Model`,
      description:
        "Forecast US stock prices using AI models and market signals.",
      url: `https://stock.bamtoly.com/dashboard/d/${symbol}?model=${model}&date=${date}`,
      siteName: "Spam Finance",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: "https://stock.bamtoly.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Spam Finance Dashboard Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Forecast ${symbol} Prices | ${model} Model`,
      description:
        "Forecast US stock prices using AI models and market signals.",
      images: ["https://stock.bamtoly.com/twitter-image.jpg"],
      creator: "@spamfinance",
    },
  };

  try {
    const data = await signalApiService.getSignalByNameAndDate(
      [symbol],
      date,
      strategy_type,
    );
    const signal = data.data.find(
      (s) => s.signal.ticker === symbol && s.signal.ai_model === model,
    );
    if (signal && signal.signal.result_description) {
      return {
        ...baseMetadata,
        description: signal.signal.result_description,
      };
    }
  } catch (error) {
    console.error("Failed to generate metadata", error);
  }

  return baseMetadata;
}

export const revalidate = 3600;

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
      <SignalDetailPage
        symbol={symbol}
        aiModel={model}
        date={date ?? new Date().toISOString().split("T")[0]}
      />
    </Suspense>
  );
}
