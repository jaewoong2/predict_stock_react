import { oxApi } from "./api";
import { MarketIndicesResponse, MarketIndex } from "../types/indices";

export const indexService = {
  /**
   * 주요 마켓 인덱스 조회
   */
  getMarketIndices: async (): Promise<MarketIndicesResponse> => {
    return await oxApi.getWithBaseResponse<MarketIndicesResponse>("/market/indices");
  },

  /**
   * 특정 인덱스 조회
   */
  getIndexBySymbol: async (symbol: string): Promise<MarketIndex> => {
    return await oxApi.getWithBaseResponse<MarketIndex>(`/market/indices/${symbol}`);
  },

  /**
   * 인덱스 스냅샷 강제 새로고침 (관리자용)
   */
  refreshIndicesSnapshot: async (): Promise<{ success: boolean; message: string }> => {
    return await oxApi.postWithBaseResponse<{ success: boolean; message: string }>(
      "/market/indices/refresh"
    );
  }
};