import { signalApiService } from "@/services/signalService";
import { WeeklyActionCountCard } from "@/components/signal/WeeklyActionCountCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 3600;

interface Props {
  date: string;
  title?: string;
  action?: "Buy" | "Sell";
}

export default async function WeeklyActionCountSection({
  date,
  title,
  action = "Buy",
}: Props) {
  try {
    const data = await signalApiService.getWeeklyActionCount({
      action: "Buy",
      reference_date: date,
    });
    return (
      <WeeklyActionCountCard
        title={title ?? "Weekly Action Count"}
        params={{ action: action, reference_date: date }}
        data={data}
      />
    );
  } catch (error) {
    console.error("WeeklyActionCountSection error", error);
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="font-medium">
            {title ?? "Weekly Action Count"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">데이터 로딩 중 오류가 발생했습니다.</p>
        </CardContent>
      </Card>
    );
  }
}
