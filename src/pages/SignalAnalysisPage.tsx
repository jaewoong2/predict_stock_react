import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; // Shadcn UI 경로 확인
import { Button } from "@/components/ui/button"; // Shadcn UI 경로 확인
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Shadcn UI 경로 확인
import { Loader2 } from "lucide-react";
import { SignalData } from "@/types/signal";
import { useSignalDataByDate } from "@/hooks/useSignal";
import { SignalDataTable } from "../components/signal/SignalDataTable";
import { columns } from "../components/signal/columns";
import { SignalDetailView } from "../components/signal/SignalDetailView";

// 오늘 날짜를 YYYY-MM-DD 형식으로 가져오는 함수
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SignalAnalysisPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    getTodayDateString()
  );
  const [submittedDate, setSubmittedDate] = useState<string>(
    getTodayDateString()
  );
  const [selectedSignal, setSelectedSignal] = useState<SignalData | null>(null);

  const {
    data: signalApiResponse,
    isLoading,
    error,
    refetch,
  } = useSignalDataByDate(submittedDate, {
    enabled: !!submittedDate, // submittedDate가 있을 때만 쿼리 실행
  });

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmitDate = () => {
    if (selectedDate) {
      setSubmittedDate(selectedDate);
      setSelectedSignal(null); // 날짜 변경 시 상세 정보 초기화
    }
  };

  // submittedDate가 변경될 때마다 데이터를 다시 가져옵니다.
  useEffect(() => {
    if (submittedDate) {
      refetch();
    }
  }, [submittedDate, refetch]);

  const handleRowClick = (signal: SignalData) => {
    setSelectedSignal(signal);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI 시그널 분석</h1>
        <p className="text-muted-foreground">
          날짜별 투자 시그널을 확인하고 분석합니다.
        </p>
      </header>

      <div className="mb-6 p-4 border rounded-lg shadow bg-card">
        <label
          htmlFor="date-picker"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          조회할 날짜 선택
        </label>
        <div className="flex items-center space-x-2">
          <Input
            type="date"
            id="date-picker"
            value={selectedDate}
            onChange={handleDateChange}
            className="max-w-xs"
          />
          <Button
            onClick={handleSubmitDate}
            disabled={isLoading || !selectedDate}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            조회
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>
            데이터를 불러오는 중 오류가 발생했습니다: {error.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          시그널 목록 ({submittedDate})
        </h2>
        <SignalDataTable
          columns={columns}
          data={signalApiResponse?.signals || []}
          onRowClick={handleRowClick}
          isLoading={isLoading}
        />
      </div>

      {selectedSignal && (
        <div>
          <h2 className="text-2xl font-semibold mb-3">시그널 상세 정보</h2>
          <SignalDetailView data={selectedSignal} />
        </div>
      )}
      {!selectedSignal &&
        !isLoading &&
        signalApiResponse?.signals &&
        signalApiResponse.signals.length > 0 && (
          <div className="mt-6 p-4 border rounded-lg bg-card text-muted-foreground">
            테이블에서 시그널을 클릭하면 상세 정보를 볼 수 있습니다.
          </div>
        )}
    </div>
  );
};

export default SignalAnalysisPage;
