import {
  GetWeeklyActionCountParams,
  SignalAPIResponse,
  WeeklyActionCountResponse,
  Signal,
} from "../types/signal";
import api from "./api";

export const signalApiService = {
  /**
   * 특정 날짜의 시그널 데이터를 가져옵니다.
   * @param date 조회할 날짜 (YYYY-MM-DD 형식)
   */
  getSignalsByDate: async (date: string): Promise<SignalAPIResponse> => {
    const response = await api.get<SignalAPIResponse>("/signals/date", {
      params: { date },
    });

    return response.data;
  },

  getSignalByNameAndDate: async (
    symbols: string[],
    date: string,
    strategy_type?: string | null,
  ): Promise<SignalAPIResponse> => {
    const params: {
      symbols: string;
      date: string;
      strategy_type?: string | null;
    } = {
      symbols: symbols.join(","),
      date,
    };

    if (strategy_type) {
      params.strategy_type = strategy_type;
    }

    const response = await api.get<SignalAPIResponse>("/signals/date", {
      params,
    });

    return response.data;
  },

  getWeeklyActionCount: async ({
    tickers,
    reference_date,
    action,
    order_by,
    limit,
  }: GetWeeklyActionCountParams): Promise<WeeklyActionCountResponse> => {
    const params: {
      tickers?: string;
      reference_date?: string;
      action?: string;
      order_by?: "counts" | null;
      limit?: number | null;
    } = {};

    if (tickers) {
      params.tickers = tickers;
    }
    if (reference_date) {
      params.reference_date = reference_date;
    }
    if (action) {
      params.action = action;
    }
    if (order_by) {
      params.order_by = order_by;
    }
    if (limit) {
      params.limit = limit;
    }

    const response = await api.get<WeeklyActionCountResponse>(
      "/signals/weekly/action-count",
      { params },
    );
    return response.data;
  },

  // /translate/signals/ticker
  getTranslatedSignalDataByTickerAndDate: async (
    ticker: string,
    date: string,
    strategy_type?: string | null,
  ): Promise<Signal[]> => {
    const params: {
      ticker: string;
      date: string;
      strategy_type?: string | null;
    } = {
      ticker,
      date,
    };

    if (strategy_type) {
      params.strategy_type = strategy_type;
    }

    const response = await api.get<Signal[]>("/translate/signals/ticker", {
      params,
    });

    return response.data;
  },
};
