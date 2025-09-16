"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background py-10">
      <div className="container space-y-4">
        <Alert variant="destructive">
          <AlertTitle>예기치 못한 오류가 발생했습니다.</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <Button onClick={() => reset()}>다시 시도</Button>
      </div>
    </div>
  );
}
