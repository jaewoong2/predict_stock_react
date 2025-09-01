import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { UserUpdate, UserSearchParams } from "../types/auth";
import { PaginationParams } from "../types/common";
import { useAuth } from "./useAuth";

// ============================================================================
// Query Keys
// ============================================================================

export const USER_KEYS = {
  all: ["users"] as const,
  profile: () => [...USER_KEYS.all, "profile"] as const,
  list: (params: PaginationParams) =>
    [...USER_KEYS.all, "list", params] as const,
  search: (params: UserSearchParams) =>
    [...USER_KEYS.all, "search", params] as const,
  detail: (userId: number) => [...USER_KEYS.all, "detail", userId] as const,
};

// ============================================================================
// User Hooks
// ============================================================================

/**
 * 내 프로필 조회 훅
 */
export const useMyProfile = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: USER_KEYS.profile(),
    queryFn: () => userService.getMyProfile(),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

/**
 * 내 프로필 업데이트 훅
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserUpdate) => userService.updateMyProfile(data),
    onSuccess: () => {
      // 프로필 업데이트 후 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile() });
    },
  });
};

/**
 * 사용자 목록 조회 훅 (무한 스크롤)
 */
export const useUserList = (params: PaginationParams) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: USER_KEYS.list(params),
    queryFn: () => userService.getUserList(params),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 사용자 검색 훅 (디바운스)
 */
export const useUserSearch = (params: UserSearchParams) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: USER_KEYS.search(params),
    queryFn: () => userService.searchUsers(params),
    enabled: !!token && !!params.query,
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 2 * 60 * 1000, // 2분
  });
};

/**
 * 특정 사용자 조회 훅
 */
export const useUserById = (userId: number) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: USER_KEYS.detail(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: !!token && !!userId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
