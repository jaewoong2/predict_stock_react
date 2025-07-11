"use client";

import React, { useEffect, useMemo, useState } from "react";
import { format as formatDate } from "date-fns";
import { SignalData, SignalAPIResponse } from "@/types/signal";
import { signalApiService } from "@/services/signalService";
import { createColumns } from "@/components/signal/columns";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { AiModelFilterPanel } from "@/components/signal/AiModelFilterPanel";
import { SignalListWrapper } from "@/components/signal/SignalListWrapper";
import SignalSearchInput from "@/components/signal/SignalSearchInput";
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
import { useLocalStorage } from "@/lib/localstorage";

interface DashboardClientProps {
  initialSignals?: SignalAPIResponse;
}

const SignalAnalysisPage: React.FC<DashboardClientProps> = ({
  initialSignals,
}) => {
  const {
    date,
    q,
    models: selectedAiModels,
    conditions: aiModelFilterConditions,
    setParams,
  } = useSignalSearchParams();

  const [page, setPage] = useLocalStorage("page", "0");
  const [pageSize, setPageSize] = useLocalStorage("pageSize", "20");

  const router = useRouter();
  const mounted = useMounted();

  const todayString = formatDate(new Date(), "yyyy-MM-dd");
  const submittedDate = date ?? todayString;

  const [availableAiModels, setAvailableAiModels] = useState<string[]>([]);
  const { favorites, toggleFavorite } = useFavoriteTickers();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [currentSelectedTickersArray, setCurrentSelectedTickersArray] =
    useState<string[]>([]);

  useEffect(() => {
    const tickersFromQ = q
      ? q
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];
    setCurrentSelectedTickersArray(tickersFromQ);
  }, [q]);

  const [signalApiResponse, setSignalApiResponse] = useState<SignalAPIResponse>(
    initialSignals ?? { date: submittedDate, signals: [] },
  );

  const fetchSignals = async () => {
    if (!submittedDate) return;
    setIsLoading(true);
    try {
      const data = await signalApiService.getSignalsByDate(submittedDate);
      setSignalApiResponse(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const allAvailableTickersForSearch = useMemo(() => {
    if (!signalApiResponse?.signals) return [];
    return [
      ...new Set(
        signalApiResponse.signals
          .map((s) => s.signal.ticker)
          .filter(Boolean) as string[],
      ),
    ].sort();
  }, [signalApiResponse?.signals]);

  useEffect(() => {
    fetchSignals();
  }, [submittedDate]);

  useEffect(() => {
    if (signalApiResponse?.signals) {
      const models = Array.from(
        new Set(
          signalApiResponse.signals
            .map((s) => s.signal.ai_model)
            .filter(Boolean) as string[],
        ),
      ).sort();
      setAvailableAiModels(models);
    }
  }, [signalApiResponse?.signals]);

  const handleRowClick = (signal: SignalData) => {
    router.push(
      `/dashboard/d/${signal.signal.ticker}?model=${signal.signal.ai_model}`,
      { scroll: true },
    );
  };

  const handleSelectedTickersChange = (newSelectedTickers: string[]) => {
    const newQ =
      newSelectedTickers.length > 0 ? newSelectedTickers.join(",") : null;
    setParams({ q: newQ });
    setPage("0"); // localStorage를 업데이트합니다.
  };

  const filteredSignals = useMemo(() => {
    if (!signalApiResponse?.signals) return [];
    let signalsToFilter = signalApiResponse.signals;

    const searchTickersArray = currentSelectedTickersArray;

    if (searchTickersArray.length > 0) {
      signalsToFilter = signalsToFilter.filter((item) => {
        const ticker = item.signal.ticker?.toLowerCase();
        if (!ticker) return false;
        return searchTickersArray.some((st) =>
          ticker.includes(st.toLowerCase()),
        );
      });
    }

    if (selectedAiModels.length > 0) {
      // ... (이하 필터링 로직은 동일)
      if (aiModelFilterConditions.every((c) => c === "OR")) {
        signalsToFilter = signalsToFilter.filter((item) => {
          const model = item.signal.ai_model;
          return model && selectedAiModels.includes(model);
        });
      } else if (aiModelFilterConditions.every((c) => c === "AND")) {
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
          signalsByTicker,
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

        signalsToFilter = resultSignals;
      }
    }
    return signalsToFilter.map((signalData) => ({
      ...signalData,
      signal: {
        ...signalData.signal,
        favorite: favorites.includes(signalData.signal.ticker) ? 1 : 0,
      },
    }));
  }, [
    signalApiResponse?.signals,
    currentSelectedTickersArray,
    selectedAiModels,
    aiModelFilterConditions,
    favorites,
  ]);

  const sortedSignals = useMemo(() => {
    return [...filteredSignals].sort((a, b) => {
      if (a.signal.favorite !== b.signal.favorite) {
        return b.signal.favorite - a.signal.favorite;
      }
      return a.signal.ticker.localeCompare(b.signal.ticker);
    });
  }, [filteredSignals]);

  const columns = useMemo(
    () => createColumns(favorites, toggleFavorite),
    [favorites, toggleFavorite],
  );

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number,
  ) => {
    setPage(newPageIndex.toString());
    setPageSize(newPageSize.toString());
  };

  const paginationState = {
    pageIndex: Number(page) || 0,
    pageSize: Number(pageSize) || 20,
  };

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
            onModelsChange={(models) => {
              setParams({ models });
              setPage("0");
            }}
            onConditionChange={(idx, value) => {
              setParams({
                conditions: aiModelFilterConditions
                  .map((c, i) => (i === idx ? value : c))
                  .slice(0, Math.max(0, selectedAiModels.length - 1)),
              });
              setPage("0");
            }}
          />
        </div>
      </div>

      <SignalListWrapper
        submittedDate={submittedDate}
        columns={columns}
        data={sortedSignals}
        onRowClick={handleRowClick}
        isLoading={isLoading || !mounted} // 마운트 전에도 로딩 상태로 처리
        pagination={paginationState}
        onPaginationChange={handlePaginationChange}
      />
    </>
  );
};

export default SignalAnalysisPage;
