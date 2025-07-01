import HeroSection from "@/components/dashboard/HeroSection";
import { Suspense } from "react";
import MarketForecastSection from "@/components/dashboard/ssr/MarketForecastSection";
import WeeklyActionCountSection from "@/components/dashboard/ssr/WeeklyActionCountSection";
import WeeklyPriceMovementSection from "@/components/dashboard/ssr/WeeklyPriceMovementSection";
import RecommendationAiSection from "@/components/dashboard/ssr/RecommendationAiSection";
import RecommendationNewsSection from "@/components/dashboard/ssr/RecommendationNewsSection";
import MarketNewsSection from "@/components/dashboard/ssr/MarketNewsSection";
import SignalsSection from "@/components/dashboard/ssr/SignalsSection";
import { CardSkeleton, CarouselSkeleton } from "@/components/ui/skeletons";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

export const metadata = {
  title: "Dashboard",
  description: "Signal dashboard",
};

export const revalidate = 3600;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const today = new Date().toISOString().split("T")[0];

  const params = await searchParams;
  const date = typeof params?.date === "string" ? params.date : today;

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
          <Suspense
            fallback={
              <CardSkeleton
                titleHeight={6}
                cardClassName="shadow-none"
                contentHeight={24}
              />
            }
          >
            <WeeklyActionCountSection date={date} />
          </Suspense>
          <Suspense
            fallback={
              <CardSkeleton
                titleHeight={6}
                cardClassName="shadow-none"
                contentHeight={24}
              />
            }
          >
            <WeeklyPriceMovementSection date={date} />
          </Suspense>
          <Suspense
            fallback={
              <CardSkeleton
                titleHeight={6}
                cardClassName="shadow-none"
                contentHeight={24}
              />
            }
          >
            <RecommendationAiSection date={date} />
          </Suspense>
          <Suspense
            fallback={
              <CardSkeleton
                titleHeight={6}
                cardClassName="shadow-none"
                contentHeight={24}
              />
            }
          >
            <RecommendationNewsSection date={date} />
          </Suspense>
        </div>
        <Suspense fallback={<CarouselSkeleton itemCount={10} />}>
          <MarketNewsSection date={date} />
        </Suspense>
        <Suspense fallback={<DashboardLoading />}>
          <SignalsSection date={date} />
        </Suspense>
      </div>
    </>
  );
}
