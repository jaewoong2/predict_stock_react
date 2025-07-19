"use client";

import React, { ReactNode, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { format as formatDate } from "date-fns";
import { DashboardStateProvider, DashboardState } from "./DashboardStateContext";
import { DashboardActionsProvider } from "./DashboardActionsContext";

interface DashboardProviderProps {
  children: ReactNode;
  initialData?: Partial<DashboardState>;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
  initialData,
}) => {
  const searchParams = useSearchParams();
  
  const urlBasedInitialData = useMemo(() => {
    const modelsParam = searchParams.get("models");
    const conditionParam = searchParams.get("condition");
    const dateParam = searchParams.get("date");
    const qParam = searchParams.get("q");
    
    const todayString = formatDate(new Date(), "yyyy-MM-dd");
    
    const parsedConditions = conditionParam
      ? conditionParam
          .split(",")
          .filter(Boolean)
          .map((c) => (c === "AND" ? "AND" : "OR"))
      : [];

    return {
      date: dateParam || todayString,
      q: qParam,
      models: modelsParam ? modelsParam.split(",").filter(Boolean) : [],
      conditions: parsedConditions,
      availableAiModels: [],
      ...initialData,
    };
  }, [searchParams, initialData]);

  return (
    <DashboardStateProvider initialData={urlBasedInitialData}>
      <DashboardActionsProvider>
        {children}
      </DashboardActionsProvider>
    </DashboardStateProvider>
  );
};