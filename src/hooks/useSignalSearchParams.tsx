"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  Suspense,
} from "react";
import { useLocalPagination } from "./useLocalPagination";
import { format } from "date-fns";
import { getTodayKST } from "@/lib/time";

// setParams의 업데이트 타입
export interface SignalURLSearchParamsUpdate {
  date?: string | null;
  q?: string | null;
  models?: string[];
  conditions?: ("OR" | "AND")[];
  strategy_type?: string | null;
}

// URL search arams에 의해 관리되는 파라미터
export interface SignalURLSearchParams {
  date: string; // 항상 존재 (기본값: 오늘 날짜)
  q: string | null;
  models: string[];
  conditions: ("OR" | "AND")[];
  strategy_type: string | null;
  setParams: (updates: SignalURLSearchParamsUpdate) => void;
}

const SignalSearchParamsContext = createContext<SignalURLSearchParams | null>(
  null,
);

// Internal component that uses useSearchParams
function SignalSearchParamsProviderInner({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { setPage } = useLocalPagination({
    storageKey: "signal_table_pagination",
    defaultPage: 1,
    defaultPageSize: 20,
  });

  const setParams = useCallback(
    (updates: SignalURLSearchParamsUpdate) => {
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
      if (Object.prototype.hasOwnProperty.call(updates, "q")) {
        apply("q", updates.q);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "models")) {
        apply("models", updates.models);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "conditions")) {
        apply("condition", updates.conditions);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "strategy_type")) {
        apply("strategy_type", updates.strategy_type);
      }

      if (newParams.toString() !== searchParams.toString()) {
        setPage(1);
        router.replace(`${pathname}?${newParams.toString()}`, {
          scroll: false,
        });
      }
    },
    [searchParams, router, pathname, setPage],
  );
  // URL search params 관리
  const urlParams: SignalURLSearchParams = useMemo(() => {
    const modelsParam = searchParams.get("models");
    const conditionParam = searchParams.get("condition");
    const parsedConditions = conditionParam
      ? conditionParam
          .split(",")
          .filter(Boolean)
          .map((c) => (c === "AND" ? "AND" : "OR"))
      : [];
    
    // date가 없으면 즉시 오늘 날짜로 설정
    const dateParam = searchParams.get("date");
    const date = dateParam || getTodayKST();

    return {
      date,
      q: searchParams.get("q"),
      models: modelsParam ? modelsParam.split(",").filter(Boolean) : [],
      conditions: parsedConditions,
      strategy_type: searchParams.get("strategy_type"),
      setParams,
    };
  }, [searchParams, setParams]);

  const debouncedSetParams = useCallback(
    (updates: Partial<SignalURLSearchParams>, delay = 500) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setParams(updates);
        timeoutRef.current = null;
      }, delay);
    },
    [setParams],
  );

  useEffect(() => {
    // 페이지 첫 로드 시 URL 파라미터 기본값 설정
    const initialUpdates: Partial<SignalURLSearchParams> = {};
    let needsUpdate = false;

    if (!urlParams.date) {
      const formattedDate = getTodayKST();
      initialUpdates.date = formattedDate;
      needsUpdate = true;
    }

    if (needsUpdate) {
      setParams(initialUpdates);
    }

    // 디바운스 처리가 필요한 보조 업데이트들
    const checkAndUpdateParams = () => {
      const updates: Partial<SignalURLSearchParams> = {};

      if (urlParams.models.length <= 1) {
        if (urlParams.conditions.length > 0) {
          updates.conditions = [];
        }
      } else {
        if (urlParams.conditions.length !== urlParams.models.length - 1) {
          const fill = urlParams.conditions[0] ?? "OR";
          const newConds = Array(urlParams.models.length - 1).fill(fill);
          urlParams.conditions.forEach((c, idx) => {
            if (idx < newConds.length) newConds[idx] = c;
          });
          updates.conditions = newConds;
        }
      }

      if (Object.keys(updates).length > 0) {
        debouncedSetParams(updates);
      }
    };

    checkAndUpdateParams();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    urlParams.conditions.join(","),
    urlParams.date,
    urlParams.models.length,
    setParams,
    debouncedSetParams,
  ]);

  const value = useMemo(
    () => ({ ...urlParams, setParams }),
    [urlParams, setParams],
  );

  const safeChidren =
    typeof children === "object" && children !== null ? children : null;

  return (
    <SignalSearchParamsContext.Provider value={value}>
      {safeChidren}
    </SignalSearchParamsContext.Provider>
  );
}

// Default fallback values for when Suspense is loading
const getDefaultSearchParams = (): SignalURLSearchParams => ({
  date: getTodayKST(),
  q: null,
  models: [],
  conditions: [],
  strategy_type: null,
  setParams: () => {},
});

// Outer provider that wraps with Suspense
export function SignalSearchParamsProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <SignalSearchParamsContext.Provider value={getDefaultSearchParams()}>
          {children}
        </SignalSearchParamsContext.Provider>
      }
    >
      <SignalSearchParamsProviderInner>
        {children}
      </SignalSearchParamsProviderInner>
    </Suspense>
  );
}

export function useSignalSearchParams() {
  const ctx = useContext(SignalSearchParamsContext);
  if (!ctx) {
    throw new Error(
      "useSignalSearchParams must be used within SignalSearchParamsProvider",
    );
  }
  return ctx;
}
