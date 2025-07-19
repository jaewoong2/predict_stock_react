"use client";

import React, { ReactNode, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { format as formatDate } from "date-fns";
import {
  DashboardStateProvider,
  DashboardState,
} from "./DashboardStateContext";
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

  const urlBasedInitialData = useMemo<DashboardState>(() => {
    const dateParam = searchParams.get("date");
    const todayString = formatDate(new Date(), "yyyy-MM-dd");

    return {
      date: dateParam || todayString,
      q: null,
      models: [],
      conditions: [],
      availableAiModels: [],
      ...initialData,
    };
  }, [searchParams, initialData]);

  return (
    <DashboardStateProvider initialData={urlBasedInitialData}>
      <DashboardActionsProvider>{children}</DashboardActionsProvider>
    </DashboardStateProvider>
  );
};
