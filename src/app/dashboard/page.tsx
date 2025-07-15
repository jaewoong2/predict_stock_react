import HeroSection from "@/components/dashboard/HeroSection";
import { Suspense } from "react";
import MarketForecastSection from "@/components/dashboard/ssr/MarketForecastSection";
import WeeklyActionCountSection from "@/components/dashboard/ssr/WeeklyActionCountSection";
import WeeklyPriceMovementSection from "@/components/dashboard/ssr/WeeklyPriceMovementSection";
import RecommendationAiSection from "@/components/dashboard/ssr/RecommendationAiSection";
import RecommendationNewsSection from "@/components/dashboard/ssr/RecommendationNewsSection";
import MarketNewsSection from "@/components/dashboard/ssr/MarketNewsSection";
import SignalsSection from "@/components/dashboard/ssr/SignalsSection";
import MarketAnalysisSection from "@/components/dashboard/ssr/MarketAnalysisSection";
import { CardSkeleton, CarouselSkeleton } from "@/components/ui/skeletons";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import SummaryTabsCard from "@/components/signal/SummaryTabsCard";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import DateSelectorWrapper from "@/components/signal/DateSelectorWrapper";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    date?: string;
  }>;
}): Promise<Metadata> {
  const today = new Date().toISOString().split("T")[0];
  const searchParams_ = await searchParams;
  const date =
    typeof searchParams_.date === "string" ? searchParams_.date : today;

  // 기본 메타데이터
  const baseMetadata = {
    title: "Forecast US Stock Prices | Spam",
    description: "Forecast US stock prices using AI models and market signals.",
    keywords: [
      "stock forecast",
      "AI prediction",
      "market signals",
      "stock analysis",
      "financial analysis",
    ],
    authors: [{ name: "Spam Finance" }],
    category: "Finance",
    creator: "Spam Finance Team",
    publisher: "Spam Finance",
    robots: "index, follow",
    alternates: {
      canonical: `https://stock.bamtoly.com/dashboard${date !== today ? `?date=${date}` : ""}`,
    },
    openGraph: {
      title: "Forecast US Stock Prices | Spam",
      description:
        "Forecast US stock prices using AI models and market signals.",
      url: `https://stock.bamtoly.com/dashboard${date !== today ? `?date=${date}` : ""}`,
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
      title: "Forecast US Stock Prices | Spam",
      description:
        "Forecast US stock prices using AI models and market signals.",
      images: ["https://stock.bamtoly.com/twitter-image.jpg"],
      creator: "@spamfinance",
    },
  };

  return baseMetadata;
}

export const revalidate = 3600;
export const runtime = "edge"; // Use edge runtime for better performance

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    date?: string;
  }>;
}) {
  const today = new Date().toISOString().split("T")[0];
  const date = (await searchParams)?.date || today;

  return (
    <>
      <HeroSection />
      <div className="mx-auto max-w-[1500px] space-y-4 p-4 md:p-8">
        <div className="mb-4 grid grid-cols-[3fr_4fr_4fr] gap-4 max-lg:grid-cols-1">
          <Suspense
            fallback={
              <CardSkeleton
                titleHeight={6}
                cardClassName="shadow-none"
                contentHeight={140}
              />
            }
          >
            <MarketForecastSection date={date} />
          </Suspense>
          <SummaryTabsCard
            tabs={[
              {
                label: "Weekly Top Signals",
                value: "signals",
                component: (
                  <WeeklyActionCountSection
                    title="Weekly Top Buy Signals"
                    date={date}
                    action="Buy"
                  />
                ),
              },
              {
                label: "Weekly Top Price Movements",
                value: "price",
                component: (
                  <WeeklyPriceMovementSection
                    title="Weekly Top Up Price Movements"
                    date={date}
                    direction="up"
                  />
                ),
              },
            ]}
          />
          <SummaryTabsCard
            tabs={[
              {
                label: "AI Recommendations",
                value: "ai",
                component: (
                  <RecommendationAiSection
                    date={date}
                    title="Today Ai's Recommendation"
                  />
                ),
              },
              {
                label: "News Recommendations",
                value: "news",
                component: (
                  <RecommendationNewsSection
                    title="Today News Recommendation"
                    recommendation="Buy"
                    badgeColor="bg-green-100 text-green-800"
                    date={date}
                  />
                ),
              },
            ]}
          />
        </div>
        <Suspense fallback={<CarouselSkeleton itemCount={10} />}>
          <div className="my-4 flex items-center gap-4">
            <div className="grid h-full w-full max-w-full grid-cols-[1fr_auto] gap-4 max-sm:flex max-sm:flex-col">
              <DateSelectorWrapper popover={false} />
              <div className="grid h-full w-full grid-cols-1">
                <MarketNewsSection date={date} />
              </div>
            </div>
          </div>
        </Suspense>
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
        <Suspense fallback={<DashboardLoading />}>
          <SignalsSection />
        </Suspense>
      </div>
      <DashboardFooter />
    </>
  );
}
