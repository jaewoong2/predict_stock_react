import Sidebar from "@/components/navigation/Sidebar";
import { AuthGuard } from "../../../components/auth/auth-guard";
import { Header } from "../../../components/layout/header";

export default function OXLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="bg-background flex h-screen">
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
