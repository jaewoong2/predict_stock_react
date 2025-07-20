import { Suspense } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import SignalDetailPage from "@/components/signal/SignalDetailPage";

export default async function ModalPage({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{
    model?: string;
    date?: string;
    strategy_type?: string;
  }>;
}) {
  const { symbol } = await params;
  const { model = "OPENAI", date } = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-card max-h-[90%] w-[70%] animate-pulse rounded-lg" />
        </div>
      }
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Background overlay that links to the dashboard */}
        <Link href="/dashboard" className="absolute inset-0 bg-black/80" />

        {/* Modal content, positioned above the overlay */}
        <div className="bg-background relative z-10 h-full max-h-[90%] w-[70%] overflow-y-auto rounded-lg max-md:max-w-full">
          <div className="p-4">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:bg-muted absolute top-3 right-3 z-20 rounded-full p-1 transition-colors"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Link>
            <SignalDetailPage
              symbol={symbol}
              aiModel={model}
              date={date ?? new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
