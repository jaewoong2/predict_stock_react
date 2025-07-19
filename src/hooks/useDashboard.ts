import { useMemo } from "react";
import { useDashboardState } from "@/contexts/DashboardStateContext";
import { useDashboardActions } from "@/contexts/DashboardActionsContext";

export const useDashboard = () => {
  const { state } = useDashboardState();
  const actions = useDashboardActions();

  return useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [state, actions]
  );
};

export const useDashboardFilters = () => {
  const { state } = useDashboardState();
  const { setParams } = useDashboardActions();

  return useMemo(
    () => ({
      date: state.date,
      q: state.q,
      models: state.models,
      conditions: state.conditions,
      setParams,
    }),
    [state.date, state.q, state.models, state.conditions, setParams]
  );
};

export const useDashboardAiModels = () => {
  const { state } = useDashboardState();
  const { updateAvailableAiModels } = useDashboardActions();

  return useMemo(
    () => ({
      availableAiModels: state.availableAiModels,
      selectedAiModels: state.models,
      aiModelFilterConditions: state.conditions,
      updateAvailableAiModels,
    }),
    [
      state.availableAiModels,
      state.models,
      state.conditions,
      updateAvailableAiModels,
    ]
  );
};