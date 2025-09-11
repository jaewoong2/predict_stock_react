import { AuthGuard } from "../../../components/auth/auth-guard";
import { Header } from "../../../components/layout/header";

export default function OXLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
