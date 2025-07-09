import DashboardClient from "@/components/dashboard/DashboardClient";
import { signalApiService } from "@/services/signalService";
import { newsService } from "@/services/newsService";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 3600;

interface Props {
  date: string;
}

export default async function SignalsSection({ date }: Props) {
  try {
    const [initialSignals] = await Promise.all([
      signalApiService.getSignalsByDate(date),
      newsService.getMarketNewsSummary({
        news_type: "market",
        news_date: date,
      }),
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
  } catch (error) {
    console.error("SignalsSection error", error);
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="font-medium">Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">데이터 로딩 중 오류가 발생했습니다.</p>
        </CardContent>
      </Card>
    );
  }
}
