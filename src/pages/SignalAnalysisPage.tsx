import React, { useEffect, useMemo, useState } from "react";
import { format as formatDate } from "date-fns";
import { SignalData } from "@/types/signal";
import { useSignalDataByDate } from "@/hooks/useSignal";
import { columns } from "../components/signal/columns";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { DateSelector } from "../components/signal/DateSelector";
import { AiModelFilterPanel } from "../components/signal/AiModelFilterPanel";
import { SignalListWrapper } from "../components/signal/SignalListWrapper";
import { SignalDetailSection } from "../components/signal/SignalDetailSection";
import SignalSearchInput from "@/components/signal/SignalSearchInput";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
// import { Button } from "@/components/ui/button"; // Button이 더 이상 필요 없다면 제거

const SignalAnalysisPage: React.FC = () => {
  const {
    date,
    signalId,
    q,
    models: selectedAiModels,
    condition: aiModelFilterCondition,
    setParams,
  } = useSignalSearchParams();

  const todayString = formatDate(new Date(), "yyyy-MM-dd");
  const submittedDate = date ?? todayString;
  const [selectedDate, setSelectedDate] = useState<string>(submittedDate);
  const selectedSignalId = signalId;

  const [availableAiModels, setAvailableAiModels] = useState<string[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<SignalData | null>(null);
  // const [searchTerm, setSearchTerm] = useState<string>(q ?? ""); // 삭제: SignalSearchInput이 내부적으로 inputValue 관리

  // SignalSearchInput에 전달할 선택된 티커 배열 상태
  const [currentSelectedTickersArray, setCurrentSelectedTickersArray] =
    useState<string[]>([]);

  // URL의 q 파라미터가 변경되면 currentSelectedTickersArray를 업데이트
  useEffect(() => {
    const tickersFromQ = q
      ? q
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];
    setCurrentSelectedTickersArray(tickersFromQ);
  }, [q]);

  const {
    data: signalApiResponse,
    isLoading,
    error,
    refetch,
  } = useSignalDataByDate(submittedDate, {
    enabled: !!submittedDate,
    select(data) {
      return {
        date: data.date,
        signals: data.signals.filter((s) => s.signal.action !== "hold"),
      };
    },
  });

  // SignalSearchInput에 제공할 전체 티커 목록 (중복 제거)
  const allAvailableTickersForSearch = useMemo(() => {
    if (!signalApiResponse?.signals) return [];
    return [
      ...new Set(
        signalApiResponse.signals
          .map((s) => s.signal.ticker)
          .filter(Boolean) as string[]
      ),
    ].sort();
  }, [signalApiResponse?.signals]);

  useEffect(() => {
    if (submittedDate) {
      refetch();
      setSelectedSignal(null);
    }
  }, [submittedDate, refetch]);

  useEffect(() => {
    if (selectedSignalId && signalApiResponse?.signals) {
      const found = signalApiResponse.signals.find(
        (s) => `${s.signal.ticker}_${s.signal.ai_model}` === selectedSignalId
      );
      if (found) {
        setSelectedSignal(found);
      } else if (!isLoading) {
        setSelectedSignal(null);
        // setParams({ signalId: null }); // 해당 ID의 시그널이 없으면 URL에서도 제거 - 이 부분은 q, models 등 다른 파라미터와 함께 관리 필요
      }
    } else {
      setSelectedSignal(null);
    }
  }, [selectedSignalId, signalApiResponse, isLoading /*, setParams */]);

  useEffect(() => {
    if (signalApiResponse?.signals) {
      const models = Array.from(
        new Set(
          signalApiResponse.signals
            .map((s) => s.signal.ai_model)
            .filter(Boolean) as string[]
        )
      ).sort();
      setAvailableAiModels(models);
    }
  }, [signalApiResponse?.signals]);

  // useEffect(() => { // 삭제: q가 변경되면 currentSelectedTickersArray가 업데이트되고, 이는 SignalSearchInput에 반영됨
  //   setSearchTerm(q ?? "");
  // }, [q]);

  const handleRowClick = (signal: SignalData) => {
    const id = `${signal.signal.ticker}_${signal.signal.ai_model}`;
    setParams({
      signalId: id, // 행 클릭 시 해당 시그널 ID 설정
      date: submittedDate,
      q: q,
      models: selectedAiModels,
      condition: aiModelFilterCondition,
    });
  };

  // SignalSearchInput에서 선택된 티커가 변경될 때 호출
  const handleSelectedTickersChange = (newSelectedTickers: string[]) => {
    // setCurrentSelectedTickersArray(newSelectedTickers); // useEffect[q]가 이 역할을 함
    const newQ =
      newSelectedTickers.length > 0 ? newSelectedTickers.join(",") : null;
    setParams({
      q: newQ, // 새로운 티커 문자열로 q 업데이트
      signalId: null, // 티커 검색 변경 시 특정 시그널 선택은 초기화
      date: submittedDate,
      models: selectedAiModels,
      condition: aiModelFilterCondition,
    });
  };

  useEffect(() => {
    setSelectedDate(submittedDate);
  }, [submittedDate]);

  const filteredSignals = useMemo(() => {
    if (!signalApiResponse?.signals) return [];
    let signalsToFilter = signalApiResponse.signals;

    const searchTickersArray = currentSelectedTickersArray; // 이미 q로부터 파싱된 배열 사용

    if (searchTickersArray.length > 0) {
      signalsToFilter = signalsToFilter.filter((item) => {
        const ticker = item.signal.ticker?.toLowerCase();
        if (!ticker) return false;
        return searchTickersArray.some((st) =>
          ticker.includes(st.toLowerCase())
        );
      });
    }

    if (selectedAiModels.length > 0) {
      if (aiModelFilterCondition === "OR") {
        signalsToFilter = signalsToFilter.filter((item) => {
          const model = item.signal.ai_model;
          return model && selectedAiModels.includes(model);
        });
      } else {
        const signalsByTicker: Record<
          string,
          { models: Set<string>; items: SignalData[] }
        > = {};
        signalsToFilter.forEach((item) => {
          const ticker = item.signal.ticker;
          const model = item.signal.ai_model;
          if (!ticker) return;
          if (!signalsByTicker[ticker]) {
            signalsByTicker[ticker] = { models: new Set(), items: [] };
          }
          if (model) {
            signalsByTicker[ticker].models.add(model);
          }
          signalsByTicker[ticker].items.push(item);
        });

        const tickersSatisfyingAndCondition = Object.keys(
          signalsByTicker
        ).filter((ticker) => {
          const tickerModels = signalsByTicker[ticker].models;
          return selectedAiModels.every((m) => tickerModels.has(m));
        });

        let resultSignals: SignalData[] = [];
        tickersSatisfyingAndCondition.forEach((ticker) => {
          resultSignals = resultSignals.concat(signalsByTicker[ticker].items);
        });

        signalsToFilter = resultSignals.filter((item) => {
          const model = item.signal.ai_model;
          return model && selectedAiModels.includes(model);
        });
      }
    }
    return signalsToFilter;
  }, [
    signalApiResponse?.signals,
    currentSelectedTickersArray,
    selectedAiModels,
    aiModelFilterCondition,
  ]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI 시그널 분석</h1>
        <p className="text-muted-foreground">
          날짜별 투자 시그널을 확인하고 분석합니다. URL을 통해 현재 필터 및 선택
          상태를 공유할 수 있습니다.
        </p>
      </header>

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-grow items-end gap-2 sm:flex-nowrap">
          <div className="">
            <SignalSearchInput
              selectedTickers={currentSelectedTickersArray}
              onSelectedTickersChange={handleSelectedTickersChange}
              availableTickers={allAvailableTickersForSearch}
              placeholder="티커 선택 (다중 가능)"
            />
            {currentSelectedTickersArray.length > 0 && (
              <div className="flex gap-1 py-2 max-w-[400px] flex-wrap">
                {currentSelectedTickersArray.map((ticker) => (
                  <Badge className="text-xs" key={ticker}>
                    {ticker}
                    <button
                      onClick={() =>
                        handleSelectedTickersChange(
                          currentSelectedTickersArray.filter(
                            (t) => t !== ticker
                          )
                        )
                      }
                    >
                      <XIcon size={12} className="cursor-pointer text-sm" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-wrap items-start justify-between gap-2">
        <AiModelFilterPanel
          availableModels={availableAiModels}
          selectedModels={selectedAiModels}
          onModelsChange={(models) =>
            setParams({
              models,
              q: q,
              date: submittedDate,
              condition: aiModelFilterCondition,
              signalId: signalId, // 모델 변경 시 signalId 유지 또는 초기화 결정
            })
          }
          onConditionChange={(value) =>
            setParams({
              condition: value,
              q: q,
              date: submittedDate,
              models: selectedAiModels,
              signalId: signalId, // 조건 변경 시 signalId 유지 또는 초기화 결정
            })
          }
          condition={aiModelFilterCondition}
        />

        <DateSelector
          selectedDate={selectedDate}
          onDateChange={(date) => {
            setSelectedDate(date);
            setParams({ date });
          }}
        />
      </div>

      <SignalListWrapper
        submittedDate={submittedDate}
        columns={columns}
        data={filteredSignals}
        onRowClick={handleRowClick}
        isLoading={isLoading}
      />

      <SignalDetailSection
        selectedSignal={selectedSignal}
        isLoading={isLoading}
        hasSignals={
          !!signalApiResponse?.signals && signalApiResponse.signals.length > 0
        }
        error={error}
      />
    </div>
  );
};

export default SignalAnalysisPage;
