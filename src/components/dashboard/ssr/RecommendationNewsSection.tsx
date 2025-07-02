import { newsService } from "@/services/newsService";
import RecommendationCard from "@/components/signal/RecommendationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 3600;

interface Props {
  date: string;
  title?: string;
  recommendation?: "Buy" | "Sell";
  badgeColor?: string;
}

export default async function RecommendationNewsSection({
  date,
  title = "Today News Recommendation",
  recommendation = "Buy",
  badgeColor = "bg-green-100 text-green-800",
}: Props) {
  try {
    const data = await newsService.getNewsRecommendations({
      recommendation: "Buy",
      limit: 10,
      date,
    });
    return (
      <RecommendationCard
        title={title}
        recommendation={recommendation}
        badgeColor={badgeColor}
        data={data}
      />
    );
  } catch (error) {
    console.error("RecommendationNewsSection error", error);
    return (
      <Card className="h-full shadow-none">
        <CardHeader>
          <CardTitle className="font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">데이터 로딩 중 오류가 발생했습니다.</p>
        </CardContent>
      </Card>
    );
  }
}
