"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Metadata } from "next";
import MarketAnalysisSection from "@/components/dashboard/ssr/MarketAnalysisSection";
import { CardSkeleton } from "@/components/ui/skeletons";
import { SelectDateSelector } from "@/components/signal/SelectDateSelector";
import { useEffect } from "react";

// function generateMetadataForDate(date: string): Metadata {
//   const today = new Date().toISOString().split("T")[0];
//   const urlSuffix = date !== today ? `?date=${date}` : "";

//   return {
//     title: "시장 분석 | Spam",
//     description:
//       "모멘텀 섹터, 시장 개요, 종목 변화율 등 종합적인 시장 분석을 제공합니다.",
//     keywords: [
//       "market analysis",
//       "momentum sectors",
//       "market overview",
//       "stock performance",
//       "financial analysis",
//     ],
//     authors: [{ name: "Spam Finance" }],
//     category: "Finance",
//     creator: "Spam Finance Team",
//     publisher: "Spam Finance",
//     robots: "index, follow",
//     alternates: {
//       canonical: `https://stock.bamtoly.com/market${urlSuffix}`,
//     },
//     openGraph: {
//       title: "시장 분석 | Spam",
//       description:
//         "모멘텀 섹터, 시장 개요, 종목 변화율 등 종합적인 시장 분석을 제공합니다.",
//       url: `https://stock.bamtoly.com/market${urlSuffix}`,
//       siteName: "Spam Finance",
//       locale: "ko_KR",
//       type: "website",
//       images: [
//         {
//           url: "https://stock.bamtoly.com/og-image.jpg",
//           width: 1200,
//           height: 630,
//           alt: "Spam Finance Market Analysis Preview",
//         },
//       ],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: "시장 분석 | Spam",
//       description:
//         "모멘텀 섹터, 시장 개요, 종목 변화율 등 종합적인 시장 분석을 제공합니다.",
//       images: ["https://stock.bamtoly.com/twitter-image.jpg"],
//       creator: "@spamfinance",
//     },
//   };
// }

export const revalidate = 3600;
export const runtime = "edge";

export default function MarketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const today = new Date().toISOString().split("T")[0];
  const date = searchParams.get("date") || today;

  const handleDateChange = (newDate: string) => {
    if (newDate === today) {
      router.push("/market");
    } else {
      router.push(`/market?date=${newDate}`);
    }
  };

  // 메타데이터 동적 업데이트 (클라이언트 사이드)
  // useEffect(() => {
  //   const metadata = generateMetadataForDate(date);
  //   document.title = `${metadata.title}`;

  //   const metaDescription = document.querySelector('meta[name="description"]');
  //   if (metaDescription) {
  //     metaDescription.setAttribute("content", `${metadata.description}`);
  //   }
  // }, [date]);

  return (
    <div className="mx-auto max-w-[1500px] space-y-4 p-4 md:p-8">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">시장 분석</h1>
            <p className="mt-2 text-gray-600">
              모멘텀 섹터, 시장 개요, 종목 변화율 등 종합적인 시장 분석을
              제공합니다.
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

      <Suspense
        fallback={
          <CardSkeleton
            titleHeight={6}
            cardClassName="shadow-none"
            contentHeight={140}
          />
        }
      >
        <MarketAnalysisSection date={date} />
      </Suspense>
    </div>
  );
}
