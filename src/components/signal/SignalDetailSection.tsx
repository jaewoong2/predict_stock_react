import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SignalData } from "@/types/signal";
import { SignalDetailView } from "./SignalDetailView";
import { useEffect, useState } from "react";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";

interface SignalDetailSectionProps {
  selectedSignal: SignalData | null;
  isLoading: boolean;
  hasSignals: boolean;
  error?: Error | null;
}

export function SignalDetailSection({
  selectedSignal,
  error,
}: SignalDetailSectionProps) {
  const [open, setOpen] = useState(false);
  const { date, setParams } = useSignalSearchParams();

  useEffect(() => {
    if (selectedSignal) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [selectedSignal, setParams]);

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setParams({ signalId: undefined });
    }
  };

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

      {selectedSignal && (
        <SignalDetailView
          open={open}
          date={date ?? undefined}
          onOpenChange={onOpenChange}
          data={selectedSignal}
        />
      )}
    </>
  );
}
