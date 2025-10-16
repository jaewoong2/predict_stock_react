import { AuthGuard } from "../../../components/auth/auth-guard";
import Header from "@/components/header";

export default function OXLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="bg-background flex min-h-screen flex-col">
        <Header />
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}
