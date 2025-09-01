"use client";

import { Suspense, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { PredictionForm } from "@/components/ox/predict/prediction-form";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/auth/login-modal";

export default function PredictModalPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { symbol } = use(params);
  const [loginOpen, setLoginOpen] = useState(true);

  const handleClose = () => {
    router.back();
  };

  useEffect(() => {
    // 로그인 모달이 닫혔는데 여전히 미인증이면 뒤로가기
    if (!loginOpen && !isAuthenticated) {
      router.back();
    }
  }, [loginOpen, isAuthenticated, router]);

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

        {/* Modal content */}
        <div className="bg-background relative z-10 h-full max-h-[90%] w-full max-w-[700px] overflow-y-auto rounded-lg max-lg:max-w-[calc(100%-1rem)]">
          <div className="p-4">
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:bg-muted absolute top-3 right-3 z-20 rounded-full p-1 transition-colors"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            {isLoading ? (
              <div className="text-muted-foreground flex items-center justify-center p-12 text-sm">
                인증 상태 확인 중...
              </div>
            ) : isAuthenticated ? (
              <PredictionForm initialSymbol={symbol} />
            ) : (
              <LoginModal
                isOpen={loginOpen}
                onClose={() => setLoginOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
