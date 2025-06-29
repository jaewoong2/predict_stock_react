'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo } from 'react';

export interface SignalQueryParams {
  date: string | null;
  signalId: string | null;
  q: string | null;
  models: string[];
  conditions: ('OR' | 'AND')[];
  page: string | null;
  pageSize: string | null;
  strategy_type: string | null;
}

interface SignalSearchParamsContextValue extends SignalQueryParams {
  setParams: (updates: Partial<SignalQueryParams>) => void;
}

const SignalSearchParamsContext = createContext<SignalSearchParamsContextValue | null>(null);

export function SignalSearchParamsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params: SignalQueryParams = useMemo(() => {
    const modelsParam = searchParams.get('models');
    const conditionParam = searchParams.get('condition');
    const parsedConditions = conditionParam
      ? conditionParam
          .split(',')
          .filter(Boolean)
          .map((c) => (c === 'AND' ? 'AND' : 'OR'))
      : [];
    return {
      date: searchParams.get('date'),
      signalId: searchParams.get('signalId'),
      q: searchParams.get('q'),
      models: modelsParam ? modelsParam.split(',').filter(Boolean) : [],
      conditions: parsedConditions,
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
      strategy_type: searchParams.get('strategy_type'),
    };
  }, [searchParams]);

  const setParams = useCallback(
    (updates: Partial<SignalQueryParams>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      const apply = (key: string, value: unknown) => {
        if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
          newParams.delete(key);
        } else if (Array.isArray(value)) {
          newParams.set(key, value.join(','));
        } else {
          newParams.set(key, String(value));
        }
      };

      if (Object.prototype.hasOwnProperty.call(updates, 'date')) {
        apply('date', updates.date);
      }
      if (Object.prototype.hasOwnProperty.call(updates, 'signalId')) {
        apply('signalId', updates.signalId);
      }
      if (Object.prototype.hasOwnProperty.call(updates, 'q')) {
        apply('q', updates.q);
      }
      if (Object.prototype.hasOwnProperty.call(updates, 'models')) {
        apply('models', updates.models);
      }
      if (Object.prototype.hasOwnProperty.call(updates, 'conditions')) {
        apply('condition', updates.conditions);
      }
      if (Object.prototype.hasOwnProperty.call(updates, 'page')) {
        apply('page', updates.page);
      }
      if (Object.prototype.hasOwnProperty.call(updates, 'pageSize')) {
        apply('pageSize', updates.pageSize);
      }
      if (Object.prototype.hasOwnProperty.call(updates, 'strategy_type')) {
        apply('strategy_type', updates.strategy_type);
      }

      if (newParams.toString() !== searchParams.toString()) {
        router.replace(`${pathname}?${newParams.toString()}`);
      }
    },
    [searchParams, router, pathname]
  );

  useEffect(() => {
    if (!params.date) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setParams({ date: formattedDate });
    }
    if (!params.signalId) {
      setParams({ signalId: null });
    }
    if (!params.q) {
      setParams({ q: null });
    }
    if (params.models.length <= 1) {
      if (params.conditions.length > 0) {
        setParams({ conditions: [] });
      }
    } else {
      if (params.conditions.length !== params.models.length - 1) {
        const fill = params.conditions[0] ?? 'OR';
        const newConds = Array(params.models.length - 1).fill(fill);
        params.conditions.forEach((c, idx) => {
          if (idx < newConds.length) newConds[idx] = c;
        });
        setParams({ conditions: newConds });
      }
    }
    if (params.page === null) {
      setParams({ page: '0' });
    }
    if (params.pageSize === null) {
      setParams({ pageSize: '20' });
    }
    if (params.strategy_type === null) {
      setParams({ strategy_type: null });
    }
  }, [
    params.conditions.join(','),
    params.date,
    params.models.length,
    params.q,
    params.signalId,
    params.page,
    params.pageSize,
    params.strategy_type,
    setParams,
  ]);

  const value = useMemo(() => ({ ...params, setParams }), [params, setParams]);

  return <SignalSearchParamsContext.Provider value={value}>{children}</SignalSearchParamsContext.Provider>;
}

export function useSignalSearchParams() {
  const ctx = useContext(SignalSearchParamsContext);
  if (!ctx) {
    throw new Error('useSignalSearchParams must be used within SignalSearchParamsProvider');
  }
  return ctx;
}
