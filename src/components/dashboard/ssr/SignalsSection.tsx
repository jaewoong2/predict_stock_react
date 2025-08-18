import DashboardClient from "@/components/dashboard/DashboardClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardProvider } from "@/contexts/DashboardProvider";

export default async function SignalsSection() {
  try {
    return <DashboardClient />;
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
