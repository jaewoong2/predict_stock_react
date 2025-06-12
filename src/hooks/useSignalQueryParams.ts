import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

export interface SignalQueryParams {
  date: string;
  signalId: string | null;
  q: string;
  models: string[];
  condition: "OR" | "AND";
}

export interface UpdateSignalQueryParams {
  date?: string;
  signalId?: string | null;
  q?: string;
  models?: string[];
  condition?: "OR" | "AND";
}

const parseModels = (value: string | null): string[] => {
  return value ? value.split(",").filter(Boolean) : [];
};

/**
 * Hook to handle signal related query parameters.
 */
export const useSignalQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const todayString = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const params = useMemo<SignalQueryParams>(() => {
    const date = searchParams.get("date");
    const signalId = searchParams.get("signalId");
    const q = searchParams.get("q") ?? "";
    const models = parseModels(searchParams.get("models"));
    const condition = searchParams.get("condition") === "AND" ? "AND" : "OR";

    const validDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : todayString;

    return {
      date: validDate,
      signalId,
      q,
      models,
      condition,
    };
  }, [searchParams, todayString]);

  const updateParams = useCallback(
    (updates: UpdateSignalQueryParams) => {
      const next = { ...params, ...updates };
      const sp = new URLSearchParams();

      if (next.date && next.date !== todayString) sp.set("date", next.date);
      if (next.signalId) sp.set("signalId", next.signalId);
      if (next.q) sp.set("q", next.q);
      if (next.models && next.models.length > 0)
        sp.set("models", next.models.join(","));
      if (next.condition === "AND") sp.set("condition", "AND");

      if (sp.toString() !== searchParams.toString()) {
        setSearchParams(sp, { replace: true });
      }
    },
    [params, searchParams, setSearchParams, todayString]
  );

  return { params, updateParams };
};
