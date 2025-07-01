import { newsService } from "@/services/newsService";
import RecommendationCard from "@/components/signal/RecommendationCard";

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
}
