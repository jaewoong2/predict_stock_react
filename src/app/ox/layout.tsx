import { AuthGuard } from "@/components/auth/auth-guard";
import { OxNavBar } from "@/components/ox/layout/OxNavBar";

export default function OXLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="bg-background flex min-h-screen flex-col">
        <OxNavBar />
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}
