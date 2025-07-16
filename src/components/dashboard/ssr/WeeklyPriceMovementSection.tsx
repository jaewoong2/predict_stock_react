import { tickerService } from "@/services/tickerService";
import { WeeklyPriceMovementCard } from "@/components/signal/WeeklyPriceMovementCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 3600;

interface Props {
  date: string;
  title?: string;
  direction?: "up" | "down";
}

export default async function WeeklyPriceMovementSection({
  date,
  title,
  direction = "up",
}: Props) {
  try {
    const data = await tickerService.getWeeklyPriceMovement({
      direction: "up",
      reference_date: date,
    });
    return (
      <WeeklyPriceMovementCard
        title={title ?? "Weekly Price Movement"}
        params={{ direction: direction, reference_date: date }}
        data={data}
      />
    );
  } catch (error) {
    console.error("WeeklyPriceMovementSection error", error);
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="font-medium">
            {title ?? "Weekly Price Movement"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">데이터 로딩 중 오류가 발생했습니다.</p>
        </CardContent>
      </Card>
    );
  }
}
