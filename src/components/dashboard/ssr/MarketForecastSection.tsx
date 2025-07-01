import MarketForCastCard from "@/components/news/MarketForcastCard";
import { newsService } from "@/services/newsService";

export const revalidate = 3600;

interface Props {
  date: string;
}

export default async function MarketForecastSection({ date }: Props) {
  const [majorData, minorData] = await Promise.all([
    newsService.getMarketForecast({ date, source: "Major" }),
    newsService.getMarketForecast({ date, source: "Minor" }),
  ]);
  return (
    <MarketForCastCard
      title="Today Market Forecast"
      majorData={majorData}
      minorData={minorData}
    />
  );
}
