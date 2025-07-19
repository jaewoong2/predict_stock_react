import DashboardClient from "@/components/dashboard/DashboardClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardProvider } from "@/contexts/DashboardProvider";
import { signalApiService } from "@/services/signalService";

export const revalidate = 3600;

type Props = {
  date: string;
};

export default async function SignalsSection({ date }: Props) {
  const data = await signalApiService.getSignalsByDate(date);

  try {
    return (
      <DashboardProvider>
        <DashboardClient initialData={data} />
      </DashboardProvider>
    );
  } catch (error) {
    console.error("SignalsSection error", error);
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="font-medium">Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">데이터 로딩 중 오류가 발생했습니다.</p>
        </CardContent>
      </Card>
    );
  }
}
