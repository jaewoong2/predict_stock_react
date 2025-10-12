"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface UseDateRangeErrorOptions {
  error: any;
}

/**
 * 30일 제한 에러 처리 훅
 */
export function useDateRangeError({ error }: UseDateRangeErrorOptions) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (error) {
      console.log("useDateRangeError - Full error:", error);

      const apiError = error as any;

      // 다양한 에러 응답 형태 지원
      const detail =
        apiError?.response?.data?.detail ||
        apiError?.detail ||
        apiError?.message;

      console.log("useDateRangeError - Extracted detail:", detail);

      if (detail && typeof detail === "string" && (
        detail.includes("30 days") ||
        detail.includes("older than 30 days")
      )) {
        setErrorMessage("30일 이전의 데이터는 조회할 수 없습니다.");
        setShowErrorModal(true);
      }
    }
  }, [error]);

  const handleErrorConfirm = () => {
    setShowErrorModal(false);

    // URL에서 date 파라미터만 제거
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.delete("date");
      const newUrl = params.toString() ? `/ox/dashboard?${params.toString()}` : "/ox/dashboard";
      router.replace(newUrl, { scroll: false });
    }
  };

  const ErrorModal = () => (
    <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-rose-50 p-3 dark:bg-rose-950/30">
              <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <DialogTitle className="text-center">조회 제한</DialogTitle>
          <DialogDescription className="text-center">
            {errorMessage}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleErrorConfirm} className="w-full sm:w-auto">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { ErrorModal };
}
