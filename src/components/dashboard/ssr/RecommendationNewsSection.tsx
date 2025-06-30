import { newsService } from "@/services/newsService";
import RecommendationCard from "@/components/signal/RecommendationCard";

interface Props {
  date: string;
}

export default async function RecommendationNewsSection({ date }: Props) {
  const data = await newsService.getNewsRecommendations({
    recommendation: "Buy",
    limit: 10,
    date,
  });
  return (
    <RecommendationCard
      title="Today News Recommendation"
      recommendation="Buy"
      badgeColor="bg-green-100 text-green-800"
      data={data}
    />
  );
}
