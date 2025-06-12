import React, { useEffect, useMemo, useState } from "react";
import { SignalData } from "@/types/signal";
import { useSignalDataByDate } from "@/hooks/useSignal";
import { columns } from "../components/signal/columns";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";
import { DateSelector } from "../components/signal/DateSelector";
import { AiModelFilterPanel } from "../components/signal/AiModelFilterPanel";
import { SignalListWrapper } from "../components/signal/SignalListWrapper";
import { SignalDetailSection } from "../components/signal/SignalDetailSection";

const SignalAnalysisPage: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    submittedDate,
    setSubmittedDate,
    selectedSignalId,
    setSelectedSignalId,
    globalFilter,
    setGlobalFilter,
    selectedAiModels,
    setSelectedAiModels,
    aiModelFilterCondition,
    setAiModelFilterCondition,
  } = useDashboardFilters();

  const [availableAiModels, setAvailableAiModels] = useState<string[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<SignalData | null>(null);

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
        setSelectedSignalId(null);
      }
    } else {
      setSelectedSignal(null);
    }
  }, [selectedSignalId, signalApiResponse, isLoading, setSelectedSignalId]);

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

  const handleSubmitDate = () => {
    if (selectedDate) {
      setSubmittedDate(selectedDate);
      setSelectedSignalId(null);
    }
  };

  const handleRowClick = (signal: SignalData) => {
    const id = `${signal.signal.ticker}_${signal.signal.ai_model}`;
    setSelectedSignalId(id);
  };

  const filteredSignals = useMemo(() => {
    if (!signalApiResponse?.signals) return [];
    let signalsToFilter = signalApiResponse.signals;

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

        const tickersSatisfyingAndCondition = Object.keys(signalsByTicker).filter(
          (ticker) => {
            const tickerModels = signalsByTicker[ticker].models;
            return selectedAiModels.every((m) => tickerModels.has(m));
          }
        );

        let resultSignals: SignalData[] = [];
        tickersSatisfyingAndCondition.forEach((ticker) => {
          resultSignals = resultSignals.concat(signalsByTicker[ticker].items);
        });
        signalsToFilter = resultSignals.filter((item) => {
          const model = item.signal.ai_model;
          return !model || selectedAiModels.includes(model);
        });
      }
    }
    return signalsToFilter;
  }, [signalApiResponse?.signals, selectedAiModels, aiModelFilterCondition]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI 시그널 분석</h1>
        <p className="text-muted-foreground">
          날짜별 투자 시그널을 확인하고 분석합니다. URL을 통해 현재 필터 및 선택 상태를 공유할 수 있습니다.
        </p>
      </header>

      <DateSelector
        selectedDate={selectedDate}
        submittedDate={submittedDate}
        onDateChange={setSelectedDate}
        onSubmit={handleSubmitDate}
        isLoading={isLoading}
      />

      <AiModelFilterPanel
        availableModels={availableAiModels}
        selectedModels={selectedAiModels}
        onModelsChange={setSelectedAiModels}
        onConditionChange={setAiModelFilterCondition}
        condition={aiModelFilterCondition}
      />

      <SignalListWrapper
        submittedDate={submittedDate}
        columns={columns}
        data={filteredSignals}
        onRowClick={handleRowClick}
        isLoading={isLoading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
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
