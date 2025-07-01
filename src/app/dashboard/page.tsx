import HeroSection from "@/components/dashboard/HeroSection";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { withDateValidation } from "@/components/withDateValidation";

function DashboardPage() {
  return (
    <>
      <HeroSection />
      <DashboardClient />
    </>
  );
}

export default withDateValidation(DashboardPage);
