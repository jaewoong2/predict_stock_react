import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export interface SignalQueryParams {
  date: string | null;
  signalId: string | null;
  q: string | null;
  models: string[];
  condition: "OR" | "AND";
  page: string | null; // 페이지 번호
  pageSize: string | null; // 페이지 크기
}

export function useSignalSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params: SignalQueryParams = useMemo(() => {
    const modelsParam = searchParams.get("models");
    return {
      date: searchParams.get("date"),
      signalId: searchParams.get("signalId"),
      q: searchParams.get("q"),
      models: modelsParam ? modelsParam.split(",").filter(Boolean) : [],
      condition: searchParams.get("condition") === "AND" ? "AND" : "OR",
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
    };
  }, [searchParams]);

  const setParams = useCallback(
    (updates: Partial<SignalQueryParams>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      const apply = (key: string, value: unknown) => {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          newParams.delete(key);
        } else if (Array.isArray(value)) {
          newParams.set(key, value.join(","));
        } else {
          newParams.set(key, String(value));
        }
      };

      if (Object.prototype.hasOwnProperty.call(updates, "date")) {
        apply("date", updates.date);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "signalId")) {
        apply("signalId", updates.signalId);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "q")) {
        apply("q", updates.q);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "models")) {
        apply("models", updates.models);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "condition")) {
        apply("condition", updates.condition);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "page")) {
        apply("page", updates.page);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "pageSize")) {
        apply("pageSize", updates.pageSize);
      }

      if (newParams.toString() !== searchParams.toString()) {
        setSearchParams(newParams, { replace: true });
      }
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    // 초기 로드 시 쿼리 파라미터가 없으면 기본값 설정
    if (!params.date) {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식
      setParams({
        date: formattedDate,
      });
    }
    if (!params.signalId) {
      setParams({ signalId: null });
    }
    if (!params.q) {
      setParams({ q: null });
    }
    if (params.models.length === 0) {
      setParams({ models: [], condition: "OR" });
    }
    if (!params.condition) {
      setParams({ condition: "OR" });
    }
    // 페이지네이션 기본값 설정
    if (params.page === null) {
      setParams({ page: "0" }); // 기본 페이지 인덱스는 0
    }
    if (params.pageSize === null) {
      setParams({ pageSize: "20" }); // 기본 페이지 크기는 20
    }
  }, [
    params.condition,
    params.date,
    params.models.length,
    params.q,
    params.signalId,
    params.page,
    params.pageSize,
    setParams,
  ]);

  return { ...params, setParams };
}
