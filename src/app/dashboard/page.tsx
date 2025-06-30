import { Suspense } from "react";
import DashboardClient from "@/components/dashboard/DashboardClient";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import { signalApiService } from "@/services/signalService";
import { newsService } from "@/services/newsService";
import { cookies } from "next/headers";

export const metadata = {
  title: "Dashboard",
  description: "Signal dashboard",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const today = new Date().toISOString().split("T")[0];

  // searchParams를 비동기적으로 처리
  const params = await searchParams;
  const date = typeof params?.date === "string" ? params.date : today;

  const [initialSignals, initialMarketNews] = await Promise.all([
    signalApiService.getSignalsByDate(date),
    newsService.getMarketNewsSummary({ news_type: "market", news_date: date }),
  ]);

  let initialFavorites: string[] = [];
  try {
    const cookiesStore = cookies();
    const fav = (await cookiesStore).get("favoriteTickers")?.value;
    if (fav) initialFavorites = JSON.parse(fav);
  } catch {
    initialFavorites = [];
  }

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardClient
        initialSignals={initialSignals}
        initialMarketNews={initialMarketNews}
        initialFavorites={initialFavorites}
      />
    </Suspense>
  );
}
