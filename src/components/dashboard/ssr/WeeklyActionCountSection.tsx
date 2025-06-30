import { signalApiService } from "@/services/signalService";
import { WeeklyActionCountCard } from "@/components/signal/WeeklyActionCountCard";

interface Props {
  date: string;
}

export default async function WeeklyActionCountSection({ date }: Props) {
  const data = await signalApiService.getWeeklyActionCount({
    action: "Buy",
    reference_date: date,
  });
  return (
    <WeeklyActionCountCard
      title="Weekly Top Buy Signals"
      params={{ action: "Buy", reference_date: date }}
      data={data}
    />
  );
}
