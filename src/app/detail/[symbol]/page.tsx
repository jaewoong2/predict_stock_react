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
    title: `${symbol} 주식 예측 | ${model} AI 모델`,
    description: "AI 모델과 시장 시그널을 활용한 미국 주식 가격 예측 및 분석",
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
      canonical: `https://ai.bamtoly.com/detail/${symbol}?model=${model}&date=${date}${strategy_type ? `&strategy_type=${strategy_type}` : ""}`,
    },
    openGraph: {
      title: `${symbol} 주식 예측 | ${model} AI 모델`,
      description: "AI 모델과 시장 시그널을 활용한 미국 주식 가격 예측 및 분석",
      url: `https://ai.bamtoly.com/detail/${symbol}?model=${model}&date=${date}`,
      siteName: "Spam Finance",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: "https://ai.bamtoly.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Spam Finance Dashboard Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${symbol} 주식 예측 | ${model} AI 모델`,
      description: "AI 모델과 시장 시그널을 활용한 미국 주식 가격 예측 및 분석",
      images: ["https://ai.bamtoly.com/twitter-image.jpg"],
      creator: "@spamfinance",
    },
  };

  try {
    const data = await signalApiService.getSignalByNameAndDate(
      [symbol],
      date,
      strategy_type,
    );

    const signal = data.signals.find(
      (s) => s.signal.ticker === symbol && s.signal.ai_model === model,
    );

    if (signal) {
      const signalData = signal.signal;
      const description =
        signalData.result_description ||
        signalData.senario ||
        `${symbol} - ${signalData.action} 시그널 (확률: ${signalData.probability})`;

      return {
        ...baseMetadata,
        title: `${signalData.name || symbol} - ${signalData.action} 시그널 | ${model}`,
        description: description.slice(0, 160),
        openGraph: {
          ...baseMetadata.openGraph,
          title: `${signalData.name || symbol} - ${signalData.action} 시그널 | ${model}`,
          description: description.slice(0, 160),
        },
        twitter: {
          ...baseMetadata.twitter,
          title: `${signalData.name || symbol} - ${signalData.action} 시그널 | ${model}`,
          description: description.slice(0, 160),
        },
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
  const { model = "OPENAI", date, strategy_type } = await searchParams;

  const today = new Date().toISOString().split("T")[0];
  const finalDate = date ?? today;

  // Fetch initial data on server
  let initialData = null;
  try {
    const data = await signalApiService.getSignalByNameAndDate(
      [symbol],
      finalDate,
      strategy_type,
    );
    initialData = data;
  } catch (error) {
    console.error("Failed to fetch initial signal data", error);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignalDetailPage
        symbol={symbol}
        aiModel={model}
        date={finalDate}
        initialData={initialData}
      />
    </Suspense>
  );
}
