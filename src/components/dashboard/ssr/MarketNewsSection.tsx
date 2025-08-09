import { newsService } from "@/services/newsService";
import { MarketNewsCarousel } from "@/components/news/MarketNewsCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 3600;

interface Props {
  date: string;
}

export default async function MarketNewsSection({ date }: Props) {
  try {
    const news = await newsService.getMarketNewsSummary({
      news_type: "market",
      news_date: date,
    });

    return <MarketNewsCarousel items={news.result ?? []} />;
  } catch (error) {
    console.error("MarketNewsSection error", error);
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="font-medium">Market News</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">데이터 로딩 중 오류가 발생했습니다.</p>
        </CardContent>
      </Card>
    );
  }
}
