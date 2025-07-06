"use client";

import React, { useEffect, useMemo, useState } from "react";
import { format as formatDate } from "date-fns";
import { SignalData, SignalAPIResponse } from "@/types/signal";
import { signalApiService } from "@/services/signalService";

import { createColumns } from "@/components/signal/columns";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { AiModelFilterPanel } from "@/components/signal/AiModelFilterPanel";
import { SignalListWrapper } from "@/components/signal/SignalListWrapper";
import { SignalDetailSection } from "@/components/signal/SignalDetailSection";
import SignalSearchInput from "@/components/signal/SignalSearchInput";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, XIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardClientProps {
  initialSignals?: SignalAPIResponse;
  initialFavorites?: string[];
}

const SignalAnalysisPage: React.FC<DashboardClientProps> = ({
  initialSignals,
  initialFavorites,
}) => {
  const {
    date,
    q,
    signalId,
    models: selectedAiModels,
    conditions: aiModelFilterConditions,
    page, // 페이지 인덱스 추가
    pageSize, // 페이지 크기 추가
    setParams,
  } = useSignalSearchParams();

  const todayString = formatDate(new Date(), "yyyy-MM-dd");
  const submittedDate = date ?? todayString;

  const [availableAiModels, setAvailableAiModels] = useState<string[]>([]);
  const STORAGE_KEY = "favoriteTickers";
  const [favorites, setFavorites] = useState<string[]>(initialFavorites ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [currentSelectedTickersArray, setCurrentSelectedTickersArray] =
    useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  const toggleFavorite = (ticker: string) => {
    setFavorites((prev) =>
      prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker],
    );
  };

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

  // SignalSearchInput에 제공할 전체 티커 목록 (중복 제거)
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

  const selectedSignal = useMemo(() => {
    if (!signalApiResponse?.signals || !signalId) return null;
    const [symbol, model] = signalId.split("_");
    return signalApiResponse.signals.find(
      (s) => s.signal.ticker === symbol && s.signal.ai_model === model,
    );
  }, [signalId, signalApiResponse?.signals]);

  const handleRowClick = (signal: SignalData) => {
    const id = `${signal.signal.ticker}_${signal.signal.ai_model}`;
    setParams({
      signalId: id, // 행 클릭 시 해당 시그널 ID 설정
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
      page: "0",
    });
  };

  const filteredSignals = useMemo(() => {
    if (!signalApiResponse?.signals) return [];
    let signalsToFilter = signalApiResponse.signals;

    const searchTickersArray = currentSelectedTickersArray; // 이미 q로부터 파싱된 배열 사용

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
    const a = [...filteredSignals].sort((a, b) => {
      return (
        a.signal.favorite - b.signal.favorite ||
        a.signal.ticker.localeCompare(b.signal.ticker)
      );
    });

    return a;
  }, [filteredSignals]);

  const columns = useMemo(
    () => createColumns(favorites, toggleFavorite),
    [favorites, toggleFavorite],
  );

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number,
  ) => {
    setParams({
      page: newPageIndex.toString(),
      pageSize: newPageSize.toString(),
    });
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
            onModelsChange={(models) =>
              setParams({
                models,
                page: "0",
              })
            }
            onConditionChange={(idx, value) =>
              setParams({
                conditions: aiModelFilterConditions
                  .map((c, i) => (i === idx ? value : c))
                  .slice(0, Math.max(0, selectedAiModels.length - 1)),
                page: "0",
              })
            }
          />
        </div>
      </div>

      <SignalListWrapper
        submittedDate={submittedDate}
        columns={columns}
        data={sortedSignals}
        onRowClick={handleRowClick}
        isLoading={isLoading}
        pagination={{
          pageIndex: +`${page}`,
          pageSize: +`${pageSize}`,
        }}
        onPaginationChange={handlePaginationChange}
      />

      <SignalDetailSection
        isLoading={isLoading}
        hasSignals={
          !!signalApiResponse?.signals && signalApiResponse.signals.length > 0
        }
        error={error}
      />
    </>
  );
};

export default SignalAnalysisPage;
