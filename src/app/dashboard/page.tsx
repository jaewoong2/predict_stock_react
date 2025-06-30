import { Suspense } from "react";
import DashboardClient from "@/components/dashboard/DashboardClient";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

export const metadata = {
  title: "Dashboard",
  description: "Signal dashboard",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardClient />
    </Suspense>
  );
}
