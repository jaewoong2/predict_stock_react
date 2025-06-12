import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export interface SignalQueryParams {
  date: string | null;
  signalId: string | null;
  q: string | null;
  models: string[];
  condition: "OR" | "AND";
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

      if (newParams.toString() !== searchParams.toString()) {
        setSearchParams(newParams, { replace: true });
      }
    },
    [searchParams, setSearchParams]
  );

  return { ...params, setParams };
}
