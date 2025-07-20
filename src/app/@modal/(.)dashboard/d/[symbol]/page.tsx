"use client";

import { Suspense, use } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import SignalDetailPage from "@/components/signal/SignalDetailPage";

export default function ModalPage({
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
  const router = useRouter();
  const { symbol } = use(params);
  const { model = "OPENAI", date } = use(searchParams);

  const handleClose = () => {
    router.back();
  };

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-card max-h-[90%] w-[70%] animate-pulse rounded-lg" />
        </div>
      }
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Background overlay that closes the modal */}
        <div
          onClick={handleClose}
          className="absolute inset-0 cursor-pointer bg-black/80"
        />

        {/* Modal content, positioned above the overlay */}
        <div className="bg-background relative z-10 h-full max-h-[90%] w-full max-w-[70%] overflow-y-auto rounded-lg max-lg:max-w-[calc(100%-2rem)]">
          <div className="p-4">
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:bg-muted absolute top-3 right-3 z-20 rounded-full p-1 transition-colors"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
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
