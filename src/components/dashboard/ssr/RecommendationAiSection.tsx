import { signalApiService } from "@/services/signalService";
import RecommendationByAiCard from "@/components/signal/RecommendationByAICard";

interface Props {
  date: string;
}

export default async function RecommendationAiSection({ date }: Props) {
  const data = await signalApiService.getSignalByNameAndDate([], date, "AI_GENERATED");
  return (
    <RecommendationByAiCard
      title="Today Ai's Recommendation"
      data={data}
    />
  );
}
