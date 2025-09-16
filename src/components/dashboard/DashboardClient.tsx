"use client";

import React, { useCallback, useEffect, useMemo, memo } from "react";
import { SignalAPIResponse, SignalData } from "@/types/signal";
import { createColumns, PredictionModalTrigger } from "@/components/signal/columns";
import {
  useDashboardFilters,
  useDashboardAiModels,
} from "@/hooks/useDashboard";
import { AiModelFilterPanel } from "@/components/signal/AiModelFilterPanel";
import { SignalListWrapper } from "@/components/signal/SignalListWrapper";
import SignalSearchInput from "@/components/signal/SignalSearchInput";
import { StrategySelect } from "@/components/signal/StrategySelect";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { InfoIcon, XIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFavoriteTickers } from "@/hooks/useFavoriteTickers";
import useMounted from "@/hooks/useMounted";
import { useSignalDataByDate } from "@/hooks/useSignal";

type Props = {
  initialData?: SignalAPIResponse;
};

const DashboardClient = memo(({ initialData }: Props) => {
  const { date, q, strategy_type, setParams } = useDashboardFilters();
  const {
    availableAiModels,
    selectedAiModels,
    aiModelFilterConditions,
    updateAvailableAiModels,
  } = useDashboardAiModels();

  const router = useRouter();
  const mounted = useMounted();

  const { favorites, toggleFavorite } = useFavoriteTickers();

  const currentSelectedTickersArray = useMemo(() => {
    return q
      ? q
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];
  }, [q]);

  const { data: signalApiResponse, isLoading } = useSignalDataByDate(date!, {
    initialData: initialData,
    enabled: !!date,
  });

  const allAvailableTickersForSearch = useMemo(() => {
    if (!signalApiResponse?.signals) return [];
    return [
      ...new Set(
        signalApiResponse.signals
          .map((s: any) => s.signal.ticker)
          .filter(Boolean) as string[],
      ),
    ].sort();
  }, [signalApiResponse?.signals]);

  useEffect(() => {
    if (availableAiModels.length > 0) return;

    if (signalApiResponse?.signals) {
      const models = Array.from(
        new Set(
          signalApiResponse.signals
            .map((s: any) => s.signal.ai_model)
            .filter(Boolean) as string[],
        ),
      ).sort();

      updateAvailableAiModels(models);
    }
  }, [
    signalApiResponse?.signals,
    availableAiModels.length,
    updateAvailableAiModels,
  ]);

  useEffect(() => {
    if (selectedAiModels.length <= 1) {
      if (aiModelFilterConditions.length > 0) {
        setParams({ conditions: [] });
      }
    } else {
      if (aiModelFilterConditions.length !== selectedAiModels.length - 1) {
        const fill = aiModelFilterConditions[0] ?? "OR";
        const newConditions = Array(selectedAiModels.length - 1).fill(fill);
        aiModelFilterConditions.forEach((c, idx) => {
          if (idx < newConditions.length) newConditions[idx] = c;
        });
        setParams({ conditions: newConditions });
      }
    }
  }, [selectedAiModels.length, aiModelFilterConditions, setParams]);

  const handleRowClick = useCallback(
    (signal: SignalData) => {
      router.push(
        `/dashboard/d/${signal.signal.ticker}?model=${signal.signal.ai_model}&date=${date}`,
        { scroll: true },
      );
    },
    [router, date],
  );

  const handleSelectedTickersChange = useCallback(
    (newSelectedTickers: string[]) => {
      const newQ =
        newSelectedTickers.length > 0 ? newSelectedTickers.join(",") : null;
      setParams({ q: newQ });
    },
    [setParams],
  );

  // 전략 변경 핸들러 수정
  const handleStrategyChange = useCallback(
    (newStrategy: string | null) => {
      setParams({ strategy_type: newStrategy });
    },
    [setParams],
  );

  const tickerFilteredSignals = useMemo(() => {
    if (!signalApiResponse?.signals) return [];
    let signalsToFilter = signalApiResponse.signals;

    if (currentSelectedTickersArray.length > 0) {
      signalsToFilter = signalsToFilter.filter((item) => {
        const ticker = item.signal.ticker?.toLowerCase();
        if (!ticker) return false;
        return currentSelectedTickersArray.some((st) =>
          ticker.includes(st.toLowerCase()),
        );
      });
    }

    return signalsToFilter;
  }, [signalApiResponse?.signals, currentSelectedTickersArray]);

  const aiModelFilteredSignals = useMemo(() => {
    if (selectedAiModels.length === 0) return tickerFilteredSignals;

    if (aiModelFilterConditions.every((c) => c === "OR")) {
      return tickerFilteredSignals.filter((item) => {
        const model = item.signal.ai_model;
        return model && selectedAiModels.includes(model);
      });
    } else if (aiModelFilterConditions.every((c) => c === "AND")) {
      const signalsByTicker: Record<
        string,
        { models: Set<string>; items: SignalData[] }
      > = {};

      tickerFilteredSignals.forEach((item) => {
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
        },
      );

      let resultSignals: SignalData[] = [];
      tickersSatisfyingAndCondition.forEach((ticker) => {
        resultSignals = resultSignals.concat(signalsByTicker[ticker].items);
      });

      return resultSignals.filter((item) => {
        const model = item.signal.ai_model;
        return model && selectedAiModels.includes(model);
      });
    } else {
      const signalsByTicker: Record<
        string,
        { models: Set<string>; items: SignalData[] }
      > = {};

      tickerFilteredSignals.forEach((item) => {
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

      let resultSignals: SignalData[] = [];
      Object.entries(signalsByTicker).forEach(([, info]) => {
        const tickerModels = info.models;
        const presence = selectedAiModels.map((m) => tickerModels.has(m));
        let acc = presence[0];
        for (let i = 1; i < presence.length; i++) {
          const cond =
            aiModelFilterConditions[i - 1] ??
            aiModelFilterConditions[0] ??
            "OR";
          if (cond === "OR") {
            acc = acc || presence[i];
          } else {
            acc = acc && presence[i];
          }
        }
        if (acc) {
          resultSignals = resultSignals.concat(
            info.items.filter((it) =>
              selectedAiModels.includes(it.signal.ai_model ?? ""),
            ),
          );
        }
      });

      return resultSignals;
    }
  }, [tickerFilteredSignals, selectedAiModels, aiModelFilterConditions]);

  // 전략별 필터링 로직
  const strategyFilteredSignals = useMemo(() => {
    if (!strategy_type) return aiModelFilteredSignals;

    return aiModelFilteredSignals.filter((item) => {
      const signalStrategy = item.signal.strategy;
      if (!signalStrategy) return false;

      // 쉼표로 구분된 전략들을 배열로 변환하여 포함 여부 확인
      const strategies = signalStrategy.split(",").map((s) => s.trim());
      return strategies.includes(strategy_type);
    });
  }, [aiModelFilteredSignals, strategy_type]);

  const filteredSignals = useMemo(() => {
    const result = strategyFilteredSignals.map((signalData) => ({
      ...signalData,
      signal: {
        ...signalData.signal,
        favorite: favorites.includes(signalData.signal.ticker) ? 1 : 0,
      },
    }));

    return result;
  }, [strategyFilteredSignals, favorites]);

  const sortedSignals = useMemo(() => {
    const result = [...filteredSignals].sort((a, b) => {
      return b.signal.favorite - a.signal.favorite;
    });

    return result;
  }, [filteredSignals]);

  const openPredictionModal = useCallback(
    ({ symbol, aiProbability, aiModel }: PredictionModalTrigger) => {
      const params = new URLSearchParams();
      if (aiProbability) {
        params.set("probability", aiProbability);
      }
      if (aiModel) {
        params.set("model", aiModel);
      }
      const query = params.toString();
      router.push(
        `/ox/dashboard/predict/${symbol}${query ? `?${query}` : ""}`,
        { scroll: false },
      );
    },
    [router],
  );

  const columns = useMemo(
    () => createColumns(favorites, toggleFavorite, openPredictionModal),
    [favorites, toggleFavorite, openPredictionModal],
  );

  const handleModelsChange = useCallback(
    (models: string[]) => {
      setParams({ models });
    },
    [setParams],
  );

  const handleConditionChange = useCallback(
    (idx: number, value: "OR" | "AND") => {
      setParams({
        conditions: aiModelFilterConditions
          .map((c, i) => (i === idx ? value : c))
          .slice(0, Math.max(0, selectedAiModels.length - 1)),
      });
    },
    [setParams, aiModelFilterConditions, selectedAiModels.length],
  );

  return (
    <>
      <div className="flex w-full flex-wrap items-start justify-between gap-2">
        <div className="flex w-full flex-grow items-end gap-2 sm:flex-nowrap">
          <div className="w-full">
            <SignalSearchInput
              selectedTickers={currentSelectedTickersArray}
              onSelectedTickersChange={handleSelectedTickersChange}
              availableTickers={allAvailableTickersForSearch}
              placeholder="티커 선택"
            />
            {currentSelectedTickersArray.length > 0 && (
              <div className="flex max-w-[400px] flex-wrap gap-1 py-2">
                {currentSelectedTickersArray.map((ticker) => (
                  <Badge className="text-xs" key={ticker}>
                    {ticker}
                    <button
                      onClick={() =>
                        handleSelectedTickersChange(
                          currentSelectedTickersArray.filter(
                            (t) => t !== ticker,
                          ),
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
          <div className="flex-shrink-0">
            <StrategySelect
              value={strategy_type}
              onChange={handleStrategyChange}
              placeholder="전략 선택"
              className="shadow-none"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-start justify-between gap-2 pb-4">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="ml-2">
              <p>
                LLM 모델 필터링 방식을 선택합니다. <br />
                <strong>OR:</strong> 선택된 모델 중 하나라도 포함된 시그널을
                표시합니다. <br />
                <strong>AND:</strong> 선택된 모든 모델을 포함하는 시그널을
                표시합니다.
              </p>
            </TooltipContent>
          </Tooltip>
          <AiModelFilterPanel
            availableModels={availableAiModels}
            selectedModels={selectedAiModels}
            conditions={aiModelFilterConditions}
            onModelsChange={handleModelsChange}
            onConditionChange={handleConditionChange}
          />
        </div>
      </div>

      <SignalListWrapper
        columns={columns}
        data={sortedSignals}
        onRowClick={handleRowClick}
        isLoading={isLoading || !mounted}
        totalItems={signalApiResponse?.signals?.length || sortedSignals.length}
      />

    </>
  );
});

DashboardClient.displayName = "DashboardClient";

export default DashboardClient;
