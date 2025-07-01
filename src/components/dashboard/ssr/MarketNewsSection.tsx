import { newsService } from "@/services/newsService";
import { MarketNewsCarousel } from "@/components/news/MarketNewsCarousel";

export const revalidate = 3600;

interface Props {
  date: string;
}

export default async function MarketNewsSection({ date }: Props) {
  const news = await newsService.getMarketNewsSummary({
    news_type: "market",
    news_date: date,
  });
  return <MarketNewsCarousel items={news.result ?? []} />;
}
