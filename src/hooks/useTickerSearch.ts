import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { tickerService } from "@/services/tickerService";
import type { Ticker } from "@/types/ticker";

/**
 * 티커 검색 Hook with Debouncing
 *
 * @param searchQuery - 검색어
 * @param debounceMs - 디바운스 지연 시간 (기본 300ms)
 */
export function useTickerSearch(searchQuery: string, debounceMs = 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // 검색 쿼리
  const { data, isLoading, error } = useQuery<Ticker[]>({
    queryKey: ["ticker-search", debouncedQuery],
    queryFn: () => tickerService.getTickerBySymbol(debouncedQuery),
    enabled: debouncedQuery.length >= 1, // 최소 1글자 이상
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });

  return {
    results: data || [],
    isLoading: isLoading && debouncedQuery.length >= 1,
    isSearching: searchQuery !== debouncedQuery, // 타이핑 중인지 여부
    error,
    hasQuery: debouncedQuery.length >= 1,
  };
}
