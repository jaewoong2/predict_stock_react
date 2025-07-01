import { tickerService } from "@/services/tickerService";
import { WeeklyPriceMovementCard } from "@/components/signal/WeeklyPriceMovementCard";

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
}
