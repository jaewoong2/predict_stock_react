"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import SignalDetailPage from "@/components/signal/SignalDetailPage";

type DetailModalClientProps = {
  symbol: string;
  model: string;
  date: string;
};

export function DetailModalClient({
  symbol,
  model,
  date,
}: DetailModalClientProps) {
  const router = useRouter();

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
        <div
          onClick={handleClose}
          className="absolute inset-0 cursor-pointer bg-black/80"
        />

        <div className="bg-background relative z-10 h-full max-h-[90%] w-full max-w-[70%] overflow-y-auto rounded-lg max-lg:max-w-[calc(100%-1rem)]">
          <div className="p-4">
            <div className="sticky top-4 flex w-full justify-end">
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:bg-muted z-20 rounded-full p-1 transition-colors"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <SignalDetailPage symbol={symbol} aiModel={model} date={date} />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
