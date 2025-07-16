import { useState, useEffect } from "react";

interface PaginationState {
  page: number;
  pageSize: number;
}

interface UseLocalPaginationProps {
  storageKey?: string;
  defaultPage?: number;
  defaultPageSize?: number;
}

export function useLocalPagination({
  storageKey = "app_pagination_state",
  defaultPage = 1,
  defaultPageSize = 20,
}: UseLocalPaginationProps = {}) {
  // 초기 상태를 로컬 스토리지에서 가져오거나 기본값 사용
  const [paginationState, setPaginationState] = useState<PaginationState>(
    () => {
      if (typeof window === "undefined") {
        return { page: defaultPage, pageSize: defaultPageSize };
      }

      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        try {
          return JSON.parse(savedState) as PaginationState;
        } catch (e) {
          console.error(
            "Failed to parse pagination state from local storage",
            e,
          );
        }
      }

      return { page: defaultPage, pageSize: defaultPageSize };
    },
  );

  // 페이지네이션 상태 변경 함수
  const updatePagination = (newPage: number, newPageSize: number) => {
    setPaginationState({ page: newPage, pageSize: newPageSize });
  };

  // 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(paginationState));
    }
  }, [paginationState, storageKey]);

  return {
    page: paginationState.page,
    pageSize: paginationState.pageSize,
    pageIndex: paginationState.page - 1, // TanStack Table은 0-based index 사용
    updatePagination,
    setPage: (newPage: number) =>
      updatePagination(newPage, paginationState.pageSize),
    setPageSize: (newPageSize: number) =>
      updatePagination(paginationState.page, newPageSize),
    reset: () => updatePagination(defaultPage, defaultPageSize),
  };
}
