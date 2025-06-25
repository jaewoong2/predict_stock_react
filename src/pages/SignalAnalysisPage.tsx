import React, { useEffect, useMemo, useState } from "react";
import { format as formatDate } from "date-fns";
import { SignalData } from "@/types/signal";
import { useSignalDataByDate } from "@/hooks/useSignal";
import { columns } from "../components/signal/columns";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { AiModelFilterPanel } from "../components/signal/AiModelFilterPanel";
import { SignalListWrapper } from "../components/signal/SignalListWrapper";
import { SignalDetailSection } from "../components/signal/SignalDetailSection";
import SignalSearchInput from "@/components/signal/SignalSearchInput";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, XIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMarketNewsSummary } from "@/hooks/useMarketNews";
import { MarketNewsCarousel } from "@/components/news/MarketNewsCarousel";
import DateSelectorWrapper from "@/components/signal/DateSelectorWrapper";
import MarketForCastCard from "@/components/news/MarketForcastCard";
import { withDateValidation } from "@/components/withDateValidation";
import { CarouselSkeleton } from "@/components/ui/skeletons";
import RecommendationByAiCard from "@/components/signal/RecommendationByAICard";
import { WeeklyPriceMovementCard } from "@/components/signal/WeeklyPriceMovementCard";
import RecommendationCard from "@/components/signal/RecommendationCard";
import { WeeklyActionCountCard } from "@/components/signal/WeeklyActionCountCard";
import SummaryTabsCard from "@/components/signal/SummaryTabsCard";
import HeroSection from "@/components/dashboard/HeroSection";
import DashboardFooter from "@/components/dashboard/DashboardFooter";

const SignalAnalysisPage: React.FC = () => {
  const {
    date,
    q,
    models: selectedAiModels,
    condition: aiModelFilterCondition,
    page, // 페이지 인덱스 추가
    pageSize, // 페이지 크기 추가
    setParams,
  } = useSignalSearchParams();

  const todayString = formatDate(new Date(), "yyyy-MM-dd");
  const submittedDate = date ?? todayString;

  const [availableAiModels, setAvailableAiModels] = useState<string[]>([]);
  const { data: marketNews, isLoading: isMarketNewsLoading } =
    useMarketNewsSummary({ news_type: "market", news_date: submittedDate });

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
        signals: data.signals,
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
    }
  }, [submittedDate, refetch]);

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

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number
  ) => {
    setParams({
      page: newPageIndex.toString(),
      pageSize: newPageSize.toString(),
    });
  };

  return (
    <>
      <HeroSection />
      <div className="mx-auto p-4 md:p-8 max-w-[1500px]">
        <div className="grid gap-4 mb-4 grid-cols-[2fr_4fr_4fr] max-lg:grid-cols-1">
          <MarketForCastCard title="Today Market Forecast" />
        <SummaryTabsCard
          tabs={[
            {
              label: "Weekly Top Signals",
              value: "signals",
              component: (
                <WeeklyActionCountCard
                  title="Weekly Top Buy Signals"
                  params={{
                    action: "Buy",
                    reference_date: date ?? undefined,
                  }}
                />
              ),
            },
            {
              label: "Weekly Top Price Movements",
              value: "price",
              component: (
                <WeeklyPriceMovementCard
                  title="Weekly Top Up Price Movements"
                  params={{
                    direction: "up",
                    reference_date: date ?? undefined,
                  }}
                />
              ),
            },
          ]}
        />
        <SummaryTabsCard
          tabs={[
            {
              label: "AI Recommendations",
              value: "ai",
              component: (
                <RecommendationByAiCard title="Today Ai's Recommendation" />
              ),
            },
            {
              label: "News Recommendations",
              value: "news",
              component: (
                <RecommendationCard
                  title="Today News Recommendation"
                  recommendation="Buy"
                  badgeColor="bg-green-100 text-green-800"
                />
              ),
            },
          ]}
        />
      </div>
      <div className="my-4 flex gap-4 items-center">
        <div className="w-full h-full grid grid-cols-[1fr_auto] gap-4 max-w-full max-sm:flex max-sm:flex-col">
          <DateSelectorWrapper popover={false} />
          <div className="w-full grid grid-cols-1 h-full">
            {!isMarketNewsLoading ? (
              <MarketNewsCarousel items={marketNews?.result ?? []} />
            ) : (
              <CarouselSkeleton />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-2 w-full">
        <div className="flex flex-grow items-end gap-2 sm:flex-nowrap w-full">
          <div className="w-full">
            <SignalSearchInput
              selectedTickers={currentSelectedTickersArray}
              onSelectedTickersChange={handleSelectedTickersChange}
              availableTickers={allAvailableTickersForSearch}
              placeholder="티커 선택"
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

      <div className="w-full flex flex-wrap items-start justify-between gap-2 pb-4">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="w-4 h-4 cursor-help" />
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
            onModelsChange={(models) =>
              setParams({
                models,
                page: "0",
              })
            }
            onConditionChange={(value) =>
              setParams({
                condition: value,
                page: "0",
              })
            }
            condition={aiModelFilterCondition}
          />
        </div>
      </div>

      <SignalListWrapper
        submittedDate={submittedDate}
        columns={columns}
        data={filteredSignals}
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
      </div>
      <DashboardFooter />
    </>
  );
};

export default withDateValidation(SignalAnalysisPage);
