import { oxApi } from "./api";
import {
  UniverseResponse,
  UniverseWithPricesResponse,
  UniverseItem,
  UniverseItemWithPrice,
  UniverseItemExtended,
  UniverseHistory,
  UniverseChange,
  UniverseAnalytics,
  UniversePerformance,
  UniverseComparison,
  normalizeSymbol,
  isValidSymbol,
} from "../types/universe";

export const universeService = {
  // ============================================================================
  // Core Universe Operations
  // ============================================================================

  /**
   * 오늘의 종목 조회
   */
  getTodayUniverse: async (): Promise<UniverseResponse> => {
    const response = await oxApi.getWithBaseResponse<{
      universe: UniverseResponse | null;
    }>("/universe/today");

    if (!response.universe) {
      throw new Error("No universe available today");
    }

    return response.universe;
  },

  /**
   * 가격 정보 포함 종목 조회
   */
  getTodayUniverseWithPrices: async (): Promise<UniverseWithPricesResponse> => {
    const response = await oxApi.getWithBaseResponse<{
      universe: UniverseWithPricesResponse | null;
    }>("/universe/today/with-prices");

    if (!response.universe) {
      throw new Error("No universe available today");
    }

    return response.universe;
  },

  // ============================================================================
  // Historical Universe Operations
  // ============================================================================

  /**
   * 특정 날짜의 종목 조회
   */
  getUniverseByDate: async (date: string): Promise<UniverseResponse> => {
    const response = await oxApi.getWithBaseResponse<{
      universe: UniverseResponse | null;
    }>(`/universe/${date}`);

    if (!response.universe) {
      throw new Error(`No universe available for date: ${date}`);
    }

    return response.universe;
  },

  /**
   * 특정 날짜의 가격 정보 포함 종목 조회
   */
  getUniverseWithPricesByDate: async (
    date: string,
  ): Promise<UniverseWithPricesResponse> => {
    const response = await oxApi.getWithBaseResponse<{
      universe: UniverseWithPricesResponse | null;
    }>(`/universe/${date}/with-prices`);

    if (!response.universe) {
      throw new Error(`No universe available for date: ${date}`);
    }

    return response.universe;
  },

  /**
   * 기간별 종목 이력 조회
   */
  getUniverseHistory: async (
    startDate: string,
    endDate: string,
  ): Promise<UniverseHistory[]> => {
    const queryString = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });

    return await oxApi.getWithBaseResponse<UniverseHistory[]>(
      `/universe/history?${queryString}`,
    );
  },

  /**
   * 종목 변경 이력 조회
   */
  getUniverseChanges: async (date: string): Promise<UniverseChange[]> => {
    return await oxApi.getWithBaseResponse<UniverseChange[]>(
      `/universe/changes/${date}`,
    );
  },

  // ============================================================================
  // Extended Universe Operations
  // ============================================================================

  /**
   * 확장 정보 포함 종목 조회
   */
  getExtendedUniverse: async (
    date?: string,
  ): Promise<UniverseItemExtended[]> => {
    const url = date
      ? `/universe/${date}/extended`
      : "/universe/today/extended";
    return await oxApi.getWithBaseResponse<UniverseItemExtended[]>(url);
  },

  /**
   * 활성 종목만 조회
   */
  getActiveUniverse: async (date?: string): Promise<UniverseItemExtended[]> => {
    const url = date ? `/universe/${date}/active` : "/universe/today/active";
    return await oxApi.getWithBaseResponse<UniverseItemExtended[]>(url);
  },

  // ============================================================================
  // Universe Analytics
  // ============================================================================

  /**
   * 유니버스 분석 데이터 조회
   */
  getUniverseAnalytics: async (date?: string): Promise<UniverseAnalytics> => {
    const url = date
      ? `/universe/${date}/analytics`
      : "/universe/today/analytics";
    return await oxApi.getWithBaseResponse<UniverseAnalytics>(url);
  },

  /**
   * 유니버스 성과 데이터 조회
   */
  getUniversePerformance: async (
    date?: string,
  ): Promise<UniversePerformance> => {
    const url = date
      ? `/universe/${date}/performance`
      : "/universe/today/performance";
    return await oxApi.getWithBaseResponse<UniversePerformance>(url);
  },

  // ============================================================================
  // Individual Symbol Operations
  // ============================================================================

  /**
   * 특정 종목 정보 조회
   */
  getSymbolInfo: async (
    symbol: string,
    date?: string,
  ): Promise<UniverseItem> => {
    const normalizedSymbol = normalizeSymbol(symbol);
    const url = date
      ? `/universe/${date}/symbol/${normalizedSymbol}`
      : `/universe/today/symbol/${normalizedSymbol}`;

    const response = await oxApi.getWithBaseResponse<{ item: UniverseItem }>(url);
    return response.item;
  },

  /**
   * 종목 순서 변경 (관리자용)
   */
  reorderUniverse: async (
    reorders: Array<{ symbol: string; new_seq: number }>,
    date?: string,
  ): Promise<UniverseItem[]> => {
    const normalizedReorders = reorders.map((r) => ({
      symbol: normalizeSymbol(r.symbol),
      new_seq: r.new_seq,
    }));

    const url = date ? `/universe/${date}/reorder` : "/universe/today/reorder";
    const response = await oxApi.putWithBaseResponse<{ items: UniverseItem[] }>(
      url,
      {
        reorders: normalizedReorders,
      },
    );
    return response.items;
  },

  /**
   * 유니버스 일괄 업데이트 (관리자용)
   */
  updateUniverse: async (
    updates: {
      adds?: Array<{ symbol: string; seq: number }>;
      removes?: string[];
      reorders?: Array<{ symbol: string; new_seq: number }>;
    },
    date?: string,
  ): Promise<{
    added: UniverseItem[];
    removed: UniverseItem[];
    reordered: UniverseItem[];
  }> => {
    const normalizedUpdates = {
      adds: updates.adds?.map((a) => ({
        symbol: normalizeSymbol(a.symbol),
        seq: a.seq,
      })),
      removes: updates.removes?.map(normalizeSymbol),
      reorders: updates.reorders?.map((r) => ({
        symbol: normalizeSymbol(r.symbol),
        new_seq: r.new_seq,
      })),
    };

    const url = date
      ? `/universe/${date}/batch-update`
      : "/universe/today/batch-update";
    return await oxApi.putWithBaseResponse<{
      added: UniverseItem[];
      removed: UniverseItem[];
      reordered: UniverseItem[];
    }>(url, normalizedUpdates);
  },

  // ============================================================================
  // Universe Comparison
  // ============================================================================

  /**
   * 유니버스 비교
   */
  compareUniverses: async (
    date1: string,
    date2: string,
  ): Promise<UniverseComparison> => {
    const queryString = new URLSearchParams({
      date1,
      date2,
    });

    return await oxApi.getWithBaseResponse<UniverseComparison>(
      `/universe/compare?${queryString}`,
    );
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * 종목 목록에서 특정 심볼 찾기
 */
export const findSymbolInUniverse = (
  universe: UniverseItemWithPrice[],
  symbol: string,
): UniverseItemWithPrice | undefined => {
  const normalizedSymbol = normalizeSymbol(symbol);
  return universe.find(
    (item) => normalizeSymbol(item.symbol) === normalizedSymbol,
  );
};

/**
 * 종목 목록에서 여러 심볼 찾기
 */
export const findSymbolsInUniverse = (
  universe: UniverseItemWithPrice[],
  symbols: string[],
): UniverseItemWithPrice[] => {
  const normalizedSymbols = symbols.map(normalizeSymbol);
  return universe.filter((item) =>
    normalizedSymbols.includes(normalizeSymbol(item.symbol)),
  );
};
