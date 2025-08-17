"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { useDashboardState } from "./DashboardStateContext";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";

interface DashboardActions {
  setParams: (params: {
    date?: string | null;
    q?: string | null;
    models?: string[];
    conditions?: ("OR" | "AND")[];
    strategy_type?: string | null;
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
  const { setState } = useDashboardState();
  const { setParams: setUrlParams } = useSignalSearchParams();

  const setParams = useCallback(
    (params: {
      date?: string | null;
      q?: string | null;
      models?: string[];
      conditions?: ("OR" | "AND")[];
      strategy_type?: string | null;
    }) => {
      // URL 파라미터만 업데이트하면 됨 (useSignalSearchParams가 모든 로직 처리)
      setUrlParams(params);
    },
    [setUrlParams],
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
    setParams({
      q: null,
      models: [],
      conditions: [],
      strategy_type: null,
    });
  }, [setParams]);

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
