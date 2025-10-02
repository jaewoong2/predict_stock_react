import { AuthGuard } from "../../../components/auth/auth-guard";

export default function OXLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="bg-background flex min-h-screen flex-col">
        <main className="p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
