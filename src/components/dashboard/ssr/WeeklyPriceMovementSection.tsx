import { tickerService } from "@/services/tickerService";
import { WeeklyPriceMovementCard } from "@/components/signal/WeeklyPriceMovementCard";

interface Props {
  date: string;
}

export default async function WeeklyPriceMovementSection({ date }: Props) {
  const data = await tickerService.getWeeklyPriceMovement({
    direction: "up",
    reference_date: date,
  });
  return (
    <WeeklyPriceMovementCard
      title="Weekly Top Up Price Movements"
      params={{ direction: "up", reference_date: date }}
      data={data}
    />
  );
}
