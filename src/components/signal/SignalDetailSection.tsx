import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SignalData } from "@/types/signal";
import { SignalDetailView } from "./SignalDetailView";

interface SignalDetailSectionProps {
  selectedSignal: SignalData | null;
  isLoading: boolean;
  hasSignals: boolean;
  error?: Error | null;
}

export function SignalDetailSection({
  selectedSignal,
  isLoading,
  hasSignals,
  error,
}: SignalDetailSectionProps) {
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
        <div>
          <h2 className="text-2xl font-semibold mb-3">시그널 상세 정보</h2>
          <SignalDetailView data={selectedSignal} />
        </div>
      )}
      {!selectedSignal && !isLoading && hasSignals && (
        <div className="mt-6 p-4 border rounded-lg bg-card text-muted-foreground">
          테이블에서 시그널을 클릭하면 상세 정보를 볼 수 있습니다.
        </div>
      )}
    </>
  );
}
