import { DashboardPageClient } from "@/components/ox/dashboard/DashboardPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "밤톨이 | AI로 분석하는 미국주식",
  description: "AI 기반 미국 주식 분석 및 예측 서비스",
  keywords: [
    "미국주식",
    "AI 주식분석",
    "주식예측",
    "stock analysis",
    "AI prediction",
  ],
  authors: [{ name: "밤톨이" }],
  category: "Finance",
  creator: "밤톨이",
  publisher: "밤톨이",
  robots: "index, follow",
  alternates: {
    canonical: "https://stock.bamtoly.com",
  },
  openGraph: {
    title: "밤톨이 | AI로 분석하는 미국주식",
    description: "AI 기반 미국 주식 분석 및 예측 서비스",
    url: "https://stock.bamtoly.com",
    siteName: "밤톨이",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://stock.bamtoly.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "밤톨이 - AI 주식 분석",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "밤톨이 | AI로 분석하는 미국주식",
    description: "AI 기반 미국 주식 분석 및 예측 서비스",
    images: ["https://stock.bamtoly.com/twitter-image.jpg"],
    creator: "@bamtoly",
  },
};

export default function Home() {
  return <DashboardPageClient />;
}
