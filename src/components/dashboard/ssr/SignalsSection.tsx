import DashboardClient from "@/components/dashboard/DashboardClient";
import { signalApiService } from "@/services/signalService";
import { newsService } from "@/services/newsService";
import { cookies } from "next/headers";

export const revalidate = 3600;

interface Props {
  date: string;
}

export default async function SignalsSection({ date }: Props) {
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
    <DashboardClient
      initialSignals={initialSignals}
      initialFavorites={initialFavorites}
    />
  );
}
