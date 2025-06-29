"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SignalDetailView } from "./SignalDetailView";
import { useEffect, useState } from "react";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { DetailSkeleton } from "../ui/skeletons";

interface SignalDetailSectionProps {
  isLoading: boolean;
  hasSignals: boolean;
  error?: Error | null;
}

export function SignalDetailSection({
  isLoading,
  error,
}: SignalDetailSectionProps) {
  const [open, setOpen] = useState(false);
  const { date, setParams, signalId } = useSignalSearchParams();

  useEffect(() => {
    if (signalId) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [signalId, setParams]);

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setParams({ signalId: undefined, strategy_type: undefined });
    }
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>
            데이터를 불러오는 중 오류가 발생했습니다: {error.message}
          </AlertDescription>
        </Alert>
      )}

      <SignalDetailView
        open={open}
        date={date ?? undefined}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
