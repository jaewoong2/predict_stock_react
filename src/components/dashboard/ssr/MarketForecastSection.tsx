import MarketForCastCard from "@/components/news/MarketForcastCard";
import { newsService } from "@/services/newsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 3600;

interface Props {
  date: string;
  title?: string;
}

export default async function MarketForecastSection({ date, title }: Props) {
  try {
    const [majorData, minorData] = await Promise.all([
      newsService.getMarketForecast({ date, source: "Major" }),
      newsService.getMarketForecast({ date, source: "Minor" }),
    ]);
    return (
      <MarketForCastCard
        title={title ?? "Market Forecast"}
        majorData={majorData}
        minorData={minorData}
      />
    );
  } catch (error) {
    console.error("MarketForecastSection error", error);
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="font-medium">
            {title ?? "Market Forecast"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">데이터 로딩 중 오류가 발생했습니다.</p>
        </CardContent>
      </Card>
    );
  }
}
