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
} from "react";

export interface SignalQueryParams {
  date: string | null;
  signalId: string | null;
  q: string | null;
  models: string[];
  conditions: ("OR" | "AND")[];
  page: string | null;
  pageSize: string | null;
  strategy_type: string | null;
}

interface SignalSearchParamsContextValue extends SignalQueryParams {
  setParams: (updates: Partial<SignalQueryParams>) => void;
}

const SignalSearchParamsContext =
  createContext<SignalSearchParamsContextValue | null>(null);

export function SignalSearchParamsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const params: SignalQueryParams = useMemo(() => {
    const modelsParam = searchParams.get("models");
    const conditionParam = searchParams.get("condition");
    const parsedConditions = conditionParam
      ? conditionParam
          .split(",")
          .filter(Boolean)
          .map((c) => (c === "AND" ? "AND" : "OR"))
      : [];
    return {
      date: searchParams.get("date"),
      signalId: searchParams.get("signalId"),
      q: searchParams.get("q"),
      models: modelsParam ? modelsParam.split(",").filter(Boolean) : [],
      conditions: parsedConditions,
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      strategy_type: searchParams.get("strategy_type"),
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
      if (Object.prototype.hasOwnProperty.call(updates, "conditions")) {
        apply("condition", updates.conditions);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "page")) {
        apply("page", updates.page);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "pageSize")) {
        apply("pageSize", updates.pageSize);
      }
      if (Object.prototype.hasOwnProperty.call(updates, "strategy_type")) {
        apply("strategy_type", updates.strategy_type);
      }

      if (newParams.toString() !== searchParams.toString()) {
        router.replace(`${pathname}?${newParams.toString()}`, {
          scroll: false,
        });
      }
    },
    [searchParams, router, pathname],
  );

  const debouncedSetParams = useCallback(
    (updates: Partial<SignalQueryParams>, delay = 500) => {
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
    // 페이지 첫 로드 시에는 딜레이 없이 바로 적용
    const initialUpdates: Partial<SignalQueryParams> = {};
    let needsUpdate = false;

    if (!params.date) {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      initialUpdates.date = formattedDate;
      needsUpdate = true;
    }

    if (!params.page) {
      initialUpdates.page = "0";
      needsUpdate = true;
    }

    if (!params.pageSize) {
      initialUpdates.pageSize = "20";
      needsUpdate = true;
    }

    // 초기 필수값들은 즉시 적용
    if (needsUpdate) {
      setParams(initialUpdates);
    }

    // 디바운스 처리가 필요한 보조 업데이트들
    const checkAndUpdateParams = () => {
      const updates: Partial<SignalQueryParams> = {};

      // 모델 조건 관련 업데이트
      if (params.models.length <= 1) {
        if (params.conditions.length > 0) {
          updates.conditions = [];
        }
      } else {
        if (params.conditions.length !== params.models.length - 1) {
          const fill = params.conditions[0] ?? "OR";
          const newConds = Array(params.models.length - 1).fill(fill);
          params.conditions.forEach((c, idx) => {
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

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    params.conditions.join(","),
    params.date,
    params.models.length,
    params.page,
    params.pageSize,
    setParams,
    debouncedSetParams,
  ]);

  const value = useMemo(() => ({ ...params, setParams }), [params, setParams]);

  return (
    <SignalSearchParamsContext.Provider value={value}>
      {children}
    </SignalSearchParamsContext.Provider>
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
