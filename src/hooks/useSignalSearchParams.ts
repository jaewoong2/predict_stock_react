import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
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

interface SignalSearchParamsContextValue extends SignalQueryParams {
  setParams: (updates: Partial<SignalQueryParams>) => void;
}

const SignalSearchParamsContext = createContext<
  SignalSearchParamsContextValue | undefined
>(undefined);

export function SignalSearchParamsProvider({
  children,
}: {
  children: ReactNode;
}) {
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
    if (!params.date) {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
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
    if (params.page === null) {
      setParams({ page: "0" });
    }
    if (params.pageSize === null) {
      setParams({ pageSize: "20" });
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

  const value = useMemo(
    () => ({ ...params, setParams }),
    [params, setParams]
  );

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
      "useSignalSearchParams must be used within SignalSearchParamsProvider"
    );
  }
  return ctx;
}
