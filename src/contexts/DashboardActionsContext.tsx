"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDashboardState } from "./DashboardStateContext";

interface DashboardActions {
  setParams: (params: {
    date?: string | null;
    q?: string | null;
    models?: string[];
    conditions?: ("OR" | "AND")[];
  }) => void;
  updateAvailableAiModels: (models: string[]) => void;
  resetFilters: () => void;
}

const DashboardActionsContext = createContext<DashboardActions | undefined>(
  undefined,
);

interface DashboardActionsProviderProps {
  children: ReactNode;
}

export const DashboardActionsProvider: React.FC<
  DashboardActionsProviderProps
> = ({ children }) => {
  const { state, setState } = useDashboardState();
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (params: {
      date?: string | null;
      q?: string | null;
      models?: string[];
      conditions?: ("OR" | "AND")[];
    }) => {
      setState((prevState) => {
        const newState = { ...prevState, ...params };

        const newSearchParams = new URLSearchParams(searchParams);

        if (params.date !== undefined) {
          if (params.date) {
            newSearchParams.set("date", params.date);
          } else {
            newSearchParams.delete("date");
          }
        }

        if (params.q !== undefined) {
          if (params.q) {
            newSearchParams.set("q", params.q);
          } else {
            newSearchParams.delete("q");
          }
        }

        if (params.models !== undefined) {
          if (params.models.length > 0) {
            newSearchParams.set("models", params.models.join(","));
          } else {
            newSearchParams.delete("models");
          }
        }

        if (params.conditions !== undefined) {
          if (params.conditions.length > 0) {
            newSearchParams.set("conditions", params.conditions.join(","));
          } else {
            newSearchParams.delete("conditions");
          }
        }

        router.replace(`?${newSearchParams.toString()}`, { scroll: false });

        return newState;
      });
    },
    [setState, router, searchParams],
  );

  const updateAvailableAiModels = useCallback(
    (models: string[]) => {
      setState((prevState) => ({
        ...prevState,
        availableAiModels: models,
      }));
    },
    [setState],
  );

  const resetFilters = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      q: null,
      models: [],
      conditions: [],
    }));

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("q");
    newSearchParams.delete("models");
    newSearchParams.delete("conditions");

    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  }, [setState, router, searchParams]);

  const actions: DashboardActions = {
    setParams,
    updateAvailableAiModels,
    resetFilters,
  };

  return (
    <DashboardActionsContext.Provider value={actions}>
      {children}
    </DashboardActionsContext.Provider>
  );
};

export const useDashboardActions = () => {
  const context = useContext(DashboardActionsContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardActions must be used within a DashboardActionsProvider",
    );
  }
  return context;
};
