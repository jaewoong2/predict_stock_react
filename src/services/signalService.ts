import {
  GetWeeklyActionCountParams,
  SignalAPIResponse,
  WeeklyActionCountResponse,
} from "../types/signal";
import api from "./api";

export const signalApiService = {
  /**
   * 특정 날짜의 시그널 데이터를 가져옵니다.
   * @param date 조회할 날짜 (YYYY-MM-DD 형식)
   */
  getSignalsByDate: async (date: string): Promise<SignalAPIResponse> => {
    // 실제 API 엔드포인트에 맞게 URL을 수정해야 합니다.
    // 예시: /signals?date=${date} 또는 /signals/${date}
    // 현재 제공된 응답은 특정 날짜에 대한 것이므로, 해당 날짜를 파라미터로 받는다고 가정합니다.
    // 이 예제에서는 '/signals/by-date' 엔드포인트와 'date' 쿼리 파라미터를 사용합니다.
    // 실제 API 문서를 확인하여 정확한 엔드포인트와 파라미터를 사용하세요.
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
    // 특정 시그널 이름과 날짜에 대한 데이터를 가져오는 API 호출
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
      params: params,
    });

    return response.data;
  },

  getWeeklyActionCount: async ({
    tickers,
    reference_date,
    action,
  }: GetWeeklyActionCountParams): Promise<WeeklyActionCountResponse> => {
    const params: {
      tickers?: string;
      reference_date?: string;
      action?: string;
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

    const response = await api.get<WeeklyActionCountResponse>(
      "/signals/weekly/action-count",
      { params },
    );
    return response.data;
  },
};
