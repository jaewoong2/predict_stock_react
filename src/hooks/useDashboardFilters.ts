"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format as formatDate, parseISO } from "date-fns";
import { getTodayKST } from "@/lib/time";

const getParam = (
  searchParams: URLSearchParams,
  key: string,
  defaultValue: string | null = null,
) => searchParams.get(key) ?? defaultValue;

const getArrayParam = (searchParams: URLSearchParams, key: string) => {
  const param = searchParams.get(key);
  return param ? param.split(",").filter(Boolean) : [];
};

export function useDashboardFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const todayString = getTodayKST();

  const initialDate = useMemo(() => {
    const dateFromUrl = searchParams.get("date");
    if (dateFromUrl && /^\d{4}-\d{2}-\d{2}$/.test(dateFromUrl)) {
      try {
        const parsed = parseISO(dateFromUrl);
        if (formatDate(parsed, "yyyy-MM-dd") === dateFromUrl) {
          return dateFromUrl;
        }
      } catch {
        /* ignore */
      }
    }
    return todayString;
  }, [searchParams, todayString]);

  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [submittedDate, setSubmittedDate] = useState<string>(initialDate);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(() =>
    getParam(searchParams, "signalId"),
  );
  const [globalFilter, setGlobalFilter] = useState<string>(
    () => getParam(searchParams, "q") ?? "",
  );
  const [selectedAiModels, setSelectedAiModels] = useState<string[]>(() =>
    getArrayParam(searchParams, "models"),
  );
  const [aiModelFilterConditions, setAiModelFilterConditions] = useState<
    ("OR" | "AND")[]
  >(() => {
    const condParam = getParam(searchParams, "condition") ?? "";
    return condParam
      .split(",")
      .filter(Boolean)
      .map((c) => (c === "AND" ? "AND" : "OR"));
  });

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (submittedDate !== todayString) params.set("date", submittedDate);
    if (selectedSignalId) params.set("signalId", selectedSignalId);
    if (globalFilter) params.set("q", globalFilter);
    if (selectedAiModels.length > 0)
      params.set("models", selectedAiModels.join(","));
    if (aiModelFilterConditions.length > 0)
      params.set("condition", aiModelFilterConditions.join(","));

    const currentParams = new URLSearchParams(window.location.search);
    if (params.toString() !== currentParams.toString()) {
      router.replace("?" + params.toString(), { scroll: false });
    }
  }, [
    submittedDate,
    selectedSignalId,
    globalFilter,
    selectedAiModels,
    aiModelFilterConditions,
    router,
    todayString,
  ]);

  useEffect(() => {
    updateUrlParams();
  }, [updateUrlParams]);

  return {
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
    aiModelFilterConditions,
    setAiModelFilterConditions,
  };
}
