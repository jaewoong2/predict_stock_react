import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { indexService } from "../services/indexService";
import { MarketIndicesResponse, MarketIndex } from "../types/indices";

// ============================================================================
// Query Keys
// ============================================================================

export const INDEX_KEYS = {
  all: ["indices"] as const,
  list: () => [...INDEX_KEYS.all, "list"] as const,
  detail: (symbol: string) => [...INDEX_KEYS.all, "detail", symbol] as const,
} as const;

// ============================================================================
// Market Indices Hooks
// ============================================================================

/**
 * 마켓 인덱스 목록 조회 훅
 */
export const useMarketIndices = () => {
  return useQuery({
    queryKey: INDEX_KEYS.list(),
    queryFn: indexService.getMarketIndices,
    staleTime: 60 * 1000, // 1분
    refetchInterval: 60 * 1000, // 1분마다 자동 갱신
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * 특정 인덱스 조회 훅
 */
export const useMarketIndex = (symbol: string) => {
  return useQuery({
    queryKey: INDEX_KEYS.detail(symbol),
    queryFn: () => indexService.getIndexBySymbol(symbol),
    enabled: !!symbol,
    staleTime: 60 * 1000, // 1분
    refetchInterval: 60 * 1000, // 1분마다 자동 갱신
  });
};

/**
 * 인덱스 새로고침 훅 (관리자용)
 */
export const useRefreshIndices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: indexService.refreshIndicesSnapshot,
    onSuccess: () => {
      // 모든 인덱스 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: INDEX_KEYS.all });
    },
  });
};

/**
 * 주요 인덱스들을 포맷된 형태로 반환하는 훅
 */
export const useFormattedIndices = () => {
  const { data: indicesData, ...rest } = useMarketIndices();

  const formattedIndices = indicesData?.indices?.map(index => ({
    name: getDisplayName(index.symbol),
    value: formatPrice(index.price),
    delta: formatChange(index.changePct),
    negative: index.changePct < 0,
    raw: index
  })) || [];

  return {
    indices: formattedIndices,
    ...rest
  };
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 심볼을 한국어 표시명으로 변환
 */
function getDisplayName(symbol: string): string {
  const displayNames: Record<string, string> = {
    'IXIC': '나스닥',
    'DJI': '다우',
    'SPX': 'S&P 500',
    'RUT': '러셀 2000',
    'VIX': 'VIX',
  };

  return displayNames[symbol] || symbol;
}

/**
 * 가격을 포맷
 */
function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
  return price.toFixed(2);
}

/**
 * 변동률을 포맷
 */
function formatChange(changePct: number): string {
  const sign = changePct >= 0 ? '+' : '';
  return `${sign}${changePct.toFixed(2)}%`;
}