import { signalApiService } from "@/services/signalService";
import RecommendationByAiCard from "@/components/signal/RecommendationByAICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 3600;

interface Props {
  title?: string;
  date: string;
}

export default async function RecommendationAiSection({ date, title }: Props) {
  try {
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
  } catch (error) {
    console.error("RecommendationAiSection error", error);
    return (
      <Card className="h-full shadow-none">
        <CardHeader>
          <CardTitle className="font-medium">
            {title ?? "AI Generated Recommendations"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">데이터 로딩 중 오류가 발생했습니다.</p>
        </CardContent>
      </Card>
    );
  }
}
