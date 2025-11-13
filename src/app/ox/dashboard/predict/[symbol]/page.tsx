import PredictSymbolPageClient from "./PredictSymbolPageClient";
import { Metadata } from "next";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ probability?: string; model?: string }>;
}): Promise<Metadata> {
  const { symbol } = await params;
  const { model = "AI" } = await searchParams;

  return {
    title: `Predict ${symbol} O/X | ${model} Model`,
    description: `Make your O/X prediction for ${symbol} stock price using ${model} AI forecast.`,
    keywords: [
      "stock game",
      "O/X prediction",
      "stock forecast game",
      "AI prediction",
      "market prediction",
      symbol,
      model,
    ],
    authors: [{ name: "Spam Finance" }],
    category: "Finance",
    creator: "Spam Finance Team",
    publisher: "Spam Finance",
    robots: "index, follow",
    alternates: {
      canonical: `https://biizbiiz.com/ox/dashboard/predict/${symbol}`,
    },
    openGraph: {
      title: `Predict ${symbol} O/X | ${model} Model`,
      description: `Make your O/X prediction for ${symbol} stock price using ${model} AI forecast.`,
      url: `https://biizbiiz.com/ox/dashboard/predict/${symbol}`,
      siteName: "Spam Finance",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: "https://biizbiiz.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${symbol} O/X Prediction Game Preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Predict ${symbol} O/X | ${model} Model`,
      description: `Make your O/X prediction for ${symbol} stock price using ${model} AI forecast.`,
      images: ["https://biizbiiz.com/twitter-image.jpg"],
      creator: "@spamfinance",
    },
  };
}

export default async function PredictSymbolPage({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ probability?: string; model?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <PredictSymbolPageClient
      params={resolvedParams}
      searchParams={{
        probability: resolvedSearchParams?.probability ?? null,
        model: resolvedSearchParams?.model ?? null,
      }}
    />
  );
}
