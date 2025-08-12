"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Metadata } from "next";
import { ETFPortfolioCard } from "@/components/dashboard/ETFPortfolioCard";
import { CardSkeleton } from "@/components/ui/skeletons";
import { SelectDateSelector } from "@/components/signal/SelectDateSelector";
import { useEffect } from "react";

function generateMetadataForETF(date: string) {
  const today = new Date().toISOString().split("T")[0];

  const queryParams = new URLSearchParams();
  if (date !== today) queryParams.set("date", date);
  const queryString = queryParams.toString();
  const urlSuffix = queryString ? `?${queryString}` : "";

  return {
    title: `ETF 포트폴리오 분석 | Spam`,
    description: `모든 ETF 포트폴리오의 변동사항을 분석하고 성과를 확인하세요.`,
    keywords: [
      "ETF analysis",
      "portfolio tracking",
      "ETF performance",
      "investment analysis",
    ],
    authors: [{ name: "Spam Finance" }],
    category: "Finance",
    creator: "Spam Finance Team",
    publisher: "Spam Finance",
    robots: "index, follow",
    alternates: {
      canonical: `https://stock.bamtoly.com/etf${urlSuffix}`,
    },
    openGraph: {
      title: `ETF 포트폴리오 분석 | Spam`,
      description: `Active ETF 포트폴리오의 변동사항을 분석하고 성과를 확인하세요.`,
      url: `https://stock.bamtoly.com/etf${urlSuffix}`,
      siteName: "Spam Finance",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: "https://stock.bamtoly.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `Spam Finance ETF Analysis Preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `ETF 포트폴리오 분석 | Spam`,
      description: `모든 ETF 포트폴리오의 변동사항을 분석하고 성과를 확인하세요.`,
      images: ["https://stock.bamtoly.com/twitter-image.jpg"],
      creator: "@spamfinance",
    },
  };
}

export const revalidate = 3600;
export const runtime = "edge";

export default function ETFPage() {
  const searchParams = useSearchParams();

  const today = new Date().toISOString().split("T")[0];
  const date = searchParams.get("date") || today;

  const handleDateChange = (newDate: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newDate === today) {
      params.delete("date");
    } else {
      params.set("date", newDate);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/etf?${queryString}` : "/etf";

    window.history.pushState({}, "", newUrl);
  };

  // 메타데이터 동적 업데이트 (클라이언트 사이드)
  useEffect(() => {
    const metadata = generateMetadataForETF(date);
    document.title = `${metadata.title}`;

    // description meta tag 업데이트
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", metadata.description);
    }
  }, [date]);

  return (
    <div className="mx-auto max-w-[1500px] space-y-4 p-4 md:p-8">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ETF 포트폴리오 분석
            </h1>
            <p className="mt-2 text-gray-600">
              모든 ETF 포트폴리오의 변동사항을 분석하고 성과를 확인하세요.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">날짜 선택:</span>
              <SelectDateSelector
                selectedDate={date}
                onDateChange={handleDateChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Suspense
          fallback={
            <CardSkeleton
              titleHeight={6}
              cardClassName="shadow-none"
              contentHeight={200}
            />
          }
        >
          <ETFPortfolioCard targetDate={date} />
        </Suspense>
      </div>
    </div>
  );
}
