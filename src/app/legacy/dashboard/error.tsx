"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto my-10 space-y-4 p-4">
      <Alert variant="destructive">
        <AlertTitle>대시보드를 불러오는 중 오류가 발생했습니다.</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
      <Button onClick={() => reset()}>다시 시도</Button>
    </div>
  );
}
