import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { tickerService } from "@/services/tickerService";
import type { TickerLookupResponse } from "@/types/ticker-lookup";

/**
 * 티커 검색 Hook with Debouncing & Session Cache
 *
 * @param searchQuery - 검색어
 * @param debounceMs - 디바운스 지연 시간 (기본 250ms)
 * @param limit - 검색 결과 제한 (기본 10개)
 */
export function useTickerLookup(
  searchQuery: string,
  debounceMs = 250,
  limit = 10
) {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Session cache (컴포넌트 생명주기 동안 유지)
  const sessionCache = useRef<Map<string, TickerLookupResponse>>(new Map());

  // Debounce 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // 최소 2글자 이상일 때만 검색
  const shouldFetch = debouncedQuery.length >= 2;
  const cacheKey = `${debouncedQuery.toUpperCase()}_${limit}`;

  // 세션 캐시 확인
  const cachedResult = sessionCache.current.get(cacheKey);

  // 검색 쿼리
  const { data, isLoading, error } = useQuery<TickerLookupResponse>({
    queryKey: ["ticker-lookup", debouncedQuery, limit],
    queryFn: async () => {
      const result = await tickerService.lookupTicker({
        query: debouncedQuery,
        limit,
      });
      // 세션 캐시에 저장
      sessionCache.current.set(cacheKey, result);
      return result;
    },
    enabled: shouldFetch && !cachedResult, // 캐시 있으면 API 호출 안 함
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });

  // 캐시된 결과 또는 API 결과 반환
  const finalData = cachedResult || data;

  return {
    data: finalData,
    matches: finalData?.matches || [],
    hasExactSymbol: finalData?.has_exact_symbol || false,
    isLoading: isLoading && shouldFetch && !cachedResult,
    isSearching: searchQuery !== debouncedQuery, // 타이핑 중인지 여부
    error,
    hasQuery: shouldFetch,
    isEmpty: finalData && finalData.matches.length === 0,
  };
}
