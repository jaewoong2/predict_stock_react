import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { format as formatDate, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, X as XIcon } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { SignalData } from "@/types/signal";
import { useSignalDataByDate } from "@/hooks/useSignal";
import { SignalDataTable } from "../components/signal/SignalDataTable";
import { columns } from "../components/signal/columns";
import { SignalDetailView } from "../components/signal/SignalDetailView";
import { AiModelMultiSelect } from "../components/signal/AiModelMultiSelect";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const getTodayDateString = () => {
  return formatDate(new Date(), "yyyy-MM-dd");
};

const getParam = (
  searchParams: URLSearchParams,
  key: string,
  defaultValue: string | null = null // 기본값을 null로 변경하여 명시적으로 없는 상태 표현
) => searchParams.get(key) ?? defaultValue;

const getArrayParam = (searchParams: URLSearchParams, key: string) => {
  const param = searchParams.get(key);
  return param ? param.split(",").filter(Boolean) : [];
};

const SignalAnalysisPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const todayString = getTodayDateString();

  const initialDate = useMemo(() => {
    const dateFromUrl = searchParams.get("date");
    if (dateFromUrl && /^\d{4}-\d{2}-\d{2}$/.test(dateFromUrl)) {
      try {
        const parsed = parseISO(dateFromUrl);
        if (formatDate(parsed, "yyyy-MM-dd") === dateFromUrl) {
          return dateFromUrl;
        }
      } catch (e) {
        console.error("Invalid date format in URL:", dateFromUrl, e);
      }
    }
    return todayString;
  }, [searchParams, todayString]);

  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [submittedDate, setSubmittedDate] = useState<string>(initialDate);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(() =>
    getParam(searchParams, "signalId")
  );
  const [selectedSignal, setSelectedSignal] = useState<SignalData | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>(
    () => getParam(searchParams, "q") ?? "" // q는 빈 문자열이 기본값일 수 있음
  );

  const [availableAiModels, setAvailableAiModels] = useState<string[]>([]);
  const [selectedAiModels, setSelectedAiModels] = useState<string[]>(() =>
    getArrayParam(searchParams, "models")
  );
  const [aiModelFilterCondition, setAiModelFilterCondition] = useState<
    "OR" | "AND"
  >(() => (getParam(searchParams, "condition", "OR") === "AND" ? "AND" : "OR"));

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
        signals: data.signals.filter(
          (signal) => signal.signal.action !== "hold"
        ),
      };
    },
  });

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (submittedDate !== todayString) params.set("date", submittedDate);
    if (selectedSignalId) params.set("signalId", selectedSignalId);
    if (globalFilter) params.set("q", globalFilter);
    if (selectedAiModels.length > 0)
      params.set("models", selectedAiModels.join(","));
    if (aiModelFilterCondition === "AND") params.set("condition", "AND");

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [
    submittedDate,
    selectedSignalId,
    globalFilter,
    selectedAiModels,
    aiModelFilterCondition,
    setSearchParams,
    todayString,
    searchParams,
  ]);

  useEffect(() => {
    updateUrlParams();
  }, [updateUrlParams]);

  useEffect(() => {
    if (submittedDate) {
      refetch();
      setSelectedSignal(null);
    }
  }, [submittedDate, refetch]);

  useEffect(() => {
    if (selectedSignalId) {
      if (signalApiResponse?.signals) {
        const foundSignal = signalApiResponse.signals.find(
          (s) => `${s.signal.ticker}_${s.signal.ai_model}` === selectedSignalId
        );
        if (foundSignal) {
          setSelectedSignal(foundSignal);
        } else {
          // 데이터는 로드되었으나, URL의 signalId에 해당하는 시그널이 없음
          setSelectedSignal(null);
          if (!isLoading) {
            // 로딩 중이 아닐 때만 (즉, 데이터 로드 완료 후)
            setSelectedSignalId(null); // 잘못된 ID이므로 URL에서 제거하도록 상태 변경
          }
        }
      } else if (!isLoading && !signalApiResponse) {
        // 데이터 로드가 끝났는데 signalApiResponse 자체가 없는 경우 (예: API 에러는 아니지만 빈 응답)
        setSelectedSignal(null);
        setSelectedSignalId(null);
      }
      // isLoading 중일 때는 아무것도 하지 않고 데이터 로드를 기다림
    } else {
      // selectedSignalId가 없는 경우
      setSelectedSignal(null);
    }
  }, [selectedSignalId, signalApiResponse, isLoading, setSelectedSignalId]); // setSelectedSignalId를 의존성 배열에 추가

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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(formatDate(date, "yyyy-MM-dd"));
    }
  };

  const handleSubmitDate = () => {
    if (selectedDate) {
      setSubmittedDate(selectedDate);
      setSelectedSignalId(null); // 날짜 변경 시 선택된 시그널 초기화
    }
  };

  const handleRowClick = (signal: SignalData) => {
    const newSignalId = `${signal.signal.ticker}_${signal.signal.ai_model}`;
    setSelectedSignalId(newSignalId);
  };

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
  };

  const handleRemoveAiModel = (modelToRemove: string) => {
    setSelectedAiModels(
      selectedAiModels.filter((model) => model !== modelToRemove)
    );
  };

  const handleAiModelFilterConditionChange = (value: "OR" | "AND") => {
    setAiModelFilterCondition(value);
  };

  const filteredSignals = useMemo(() => {
    if (!signalApiResponse?.signals) return [];
    let signalsToFilter = signalApiResponse.signals;

    if (selectedAiModels.length > 0) {
      if (aiModelFilterCondition === "OR") {
        signalsToFilter = signalsToFilter.filter((item) => {
          const signalModel = item.signal.ai_model;
          return signalModel && selectedAiModels.includes(signalModel);
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
          return selectedAiModels.every((selectedModel) =>
            tickerModels.has(selectedModel)
          );
        });

        let resultSignals: SignalData[] = [];
        tickersSatisfyingAndCondition.forEach((ticker) => {
          resultSignals = resultSignals.concat(signalsByTicker[ticker].items);
        });
        signalsToFilter = resultSignals.filter((item) => {
          const signalModel = item.signal.ai_model;
          return !signalModel || selectedAiModels.includes(signalModel);
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
          날짜별 투자 시그널을 확인하고 분석합니다. URL을 통해 현재 필터 및 선택
          상태를 공유할 수 있습니다.
        </p>
      </header>

      <div className="mb-6 p-4 border rounded-lg shadow bg-card">
        <div className="mb-1 text-sm font-medium text-gray-700">
          조회할 날짜 선택
        </div>
        <div className="flex items-center space-x-2">
          <DatePicker
            date={selectedDate ? parseISO(selectedDate) : undefined}
            onDateChange={handleDateSelect}
          />
          <Button
            onClick={handleSubmitDate}
            disabled={
              isLoading || !selectedDate || selectedDate === submittedDate
            }
          >
            {isLoading && submittedDate === selectedDate ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            조회
          </Button>
        </div>
      </div>

      {availableAiModels.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg shadow bg-card">
          <h3 className="text-lg font-semibold mb-2">AI 모델 필터</h3>
          <div className="mb-3 flex items-center space-x-2">
            <AiModelMultiSelect
              options={availableAiModels}
              value={selectedAiModels}
              onChange={setSelectedAiModels}
            />
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {selectedAiModels.map((model) => (
              <Badge
                key={model}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {model}
                <button
                  onClick={() => handleRemoveAiModel(model)}
                  className="rounded-full hover:bg-destructive/20 p-0.5"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <RadioGroup
            value={aiModelFilterCondition}
            onValueChange={handleAiModelFilterConditionChange}
            className="flex items-center space-x-4 mb-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="OR" id="ai-filter-or" />
              <Label htmlFor="ai-filter-or">OR (하나라도 일치)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="AND" id="ai-filter-and" />
              <Label htmlFor="ai-filter-and">AND (모두 일치)</Label>
            </div>
          </RadioGroup>

          {selectedAiModels.length > 0 && (
            <div className="mt-3 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const modelsToAdd = availableAiModels.filter(
                    (m) => !selectedAiModels.includes(m)
                  );
                  setSelectedAiModels([...selectedAiModels, ...modelsToAdd]);
                }}
                disabled={
                  selectedAiModels.length === availableAiModels.length ||
                  availableAiModels.length === 0
                }
              >
                모두 추가
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAiModels([])}
                disabled={selectedAiModels.length === 0}
              >
                모두 해제
              </Button>
            </div>
          )}
        </div>
      )}

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
          data={filteredSignals}
          onRowClick={handleRowClick}
          isLoading={isLoading}
          globalFilter={globalFilter}
          onGlobalFilterChange={handleGlobalFilterChange}
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
