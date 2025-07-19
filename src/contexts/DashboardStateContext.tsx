"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

export interface DashboardState {
  date: string | null;
  q: string | null;
  models: string[];
  conditions: ("OR" | "AND")[];
  availableAiModels: string[];
}

const initialState: DashboardState = {
  date: null,
  q: null,
  models: [],
  conditions: [],
  availableAiModels: [],
};

interface DashboardStateContextType {
  state: DashboardState;
  setState: React.Dispatch<React.SetStateAction<DashboardState>>;
}

const DashboardStateContext = createContext<
  DashboardStateContextType | undefined
>(undefined);

interface DashboardStateProviderProps {
  children: ReactNode;
  initialData?: Partial<DashboardState>;
}

export const DashboardStateProvider: React.FC<DashboardStateProviderProps> = ({
  children,
  initialData,
}) => {
  const [state, setState] = useState<DashboardState>({
    ...initialState,
    ...initialData,
  });

  const value = useMemo(
    () => ({
      state,
      setState,
    }),
    [state],
  );

  return (
    <DashboardStateContext.Provider value={value}>
      {children}
    </DashboardStateContext.Provider>
  );
};

export const useDashboardState = () => {
  const context = useContext(DashboardStateContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardState must be used within a DashboardStateProvider",
    );
  }
  return context;
};
