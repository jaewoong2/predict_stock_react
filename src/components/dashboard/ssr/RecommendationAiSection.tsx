import { signalApiService } from "@/services/signalService";
import RecommendationByAiCard from "@/components/signal/RecommendationByAICard";

export const revalidate = 3600;

interface Props {
  title?: string;
  date: string;
}

export default async function RecommendationAiSection({ date, title }: Props) {
  const data = await signalApiService.getSignalByNameAndDate(
    [],
    date,
    "AI_GENERATED",
  );
  return (
    <RecommendationByAiCard
      title={title ?? "AI Generated Recommendations"}
      data={data}
    />
  );
}
