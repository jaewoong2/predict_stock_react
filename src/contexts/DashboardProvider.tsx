"use client";

import React, { ReactNode } from "react";
import {
  DashboardStateProvider,
  useDashboardState,
} from "./DashboardStateContext";
import { DashboardActionsProvider } from "./DashboardActionsContext";
import {
  SignalSearchParamsProvider,
  useSignalSearchParams,
} from "@/hooks/useSignalSearchParams";

interface DashboardProviderProps {
  children: ReactNode;
  initialData?: any; // 기존 호환성 유지
}

// useSignalSearchParams와 DashboardState를 연결하는 내부 컴포넌트
const DashboardStateSync: React.FC<{
  children: ReactNode;
  initialData?: any;
}> = ({ children, initialData }) => {
  const { date, q, models, conditions, strategy_type } =
    useSignalSearchParams();

  // URL 파라미터를 DashboardState 형태로 변환
  const urlBasedInitialData = {
    date,
    q,
    models,
    conditions,
    availableAiModels: [],
    strategy_type,
    ...initialData,
  };

  return (
    <DashboardStateProvider initialData={urlBasedInitialData}>
      <DashboardStateSyncEffect>
        <DashboardActionsProvider>{children}</DashboardActionsProvider>
      </DashboardStateSyncEffect>
    </DashboardStateProvider>
  );
};

// URL 파라미터 변경 시 상태를 동기화하는 컴포넌트
const DashboardStateSyncEffect: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { setState } = useDashboardState();
  const { date, q, models, conditions, strategy_type } =
    useSignalSearchParams();

  React.useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      date,
      q,
      models,
      conditions,
      strategy_type,
    }));
  }, [date, q, models, conditions, strategy_type, setState]);

  return <>{children}</>;
};

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
  initialData,
}) => {
  return (
    <SignalSearchParamsProvider>
      <DashboardStateSync initialData={initialData}>
        {children}
      </DashboardStateSync>
    </SignalSearchParamsProvider>
  );
};
