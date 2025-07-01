import { signalApiService } from "@/services/signalService";
import { WeeklyActionCountCard } from "@/components/signal/WeeklyActionCountCard";

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
}
