"use client";

import { PaginationParams } from "../types/common";
import {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  authService,
  parseOAuthCallback,
  isTokenValid,
  extractUserFromToken,
} from "../services/authService";
import {
  TOKEN_COOKIE_KEY,
  getClientCookie,
  setClientCookie,
  deleteClientCookie,
} from "@/lib/cookies";
import {
  User,
  UserProfile,
  UserUpdate,
  OAuthAuthorizeParams,
  UserListResult,
  UserSearchResult,
  AuthState,
  AuthContextValue,
} from "../types/auth";

// ============================================================================
// Query Keys
// ============================================================================

export const AUTH_KEYS = {
  all: ["auth"] as const,
  profile: () => [...AUTH_KEYS.all, "profile"] as const,
  profileWithPoints: () => [...AUTH_KEYS.all, "profile-with-points"] as const,
  financialSummary: () => [...AUTH_KEYS.all, "financial-summary"] as const,
  userList: (params?: PaginationParams) =>
    [...AUTH_KEYS.all, "user-list", params] as const,
  userSearch: (query: string, limit?: number) =>
    [...AUTH_KEYS.all, "user-search", query, limit] as const,
} as const;

// ============================================================================
// Auth Context
// ============================================================================

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

// ============================================================================
// Auth Provider Component
// ============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authState, setAuthState] = useState<AuthState>(() => {
    // 서버 사이드 렌더링 시 localStorage 접근 방지
    if (typeof window === "undefined") {
      return {
        token: null,
        isAuthenticated: false,
        user: null,
      };
    }

    // 초기 상태를 쿠키에서 복원 (클라이언트 전용)
    const token = typeof document !== "undefined"
      ? getClientCookie(TOKEN_COOKIE_KEY)
      : null;
    return {
      token,
      isAuthenticated: !!token && isTokenValid(token),
      user: null,
    };
  });

  const queryClient = useQueryClient();

  // 초기 비로그인 상태에서는 로딩을 해제하여 모달 표시가 가능하도록 함
  useEffect(() => {
    if (!authState.token) {
      setIsLoading(false);
    }
  }, [authState.token]);

  // 로그인 함수
  const login = useCallback((token: string) => {
    if (typeof window !== "undefined") {
      // 토큰 만료에 맞춰 쿠키 만료 설정
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        const maxAgeSeconds = Math.max((payload?.exp ?? now) - now, 60 * 60); // 최소 1시간
        setClientCookie(TOKEN_COOKIE_KEY, token, { maxAgeSeconds });
      } catch {
        setClientCookie(TOKEN_COOKIE_KEY, token, { maxAgeSeconds: 60 * 60 * 24 * 7 });
      }
    }
    setAuthState({
      token,
      isAuthenticated: true,
      user: null,
    });
    setShowLoginModal(false);
    setIsLoading(false);
  }, []);

  // 로그아웃 함수
  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      deleteClientCookie(TOKEN_COOKIE_KEY);
    }
    setAuthState({
      token: null,
      isAuthenticated: false,
      user: null,
    });
    setShowLoginModal(true);
    // 모든 쿼리 캐시 클리어
    queryClient.clear();
    setIsLoading(false);
  }, [queryClient]);

  // 로그인 모달 표시 함수
  const showLogin = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  // 로그인 모달 숨김 함수
  const hideLogin = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  // 토큰 갱신 함수
  const refreshToken = useCallback(async () => {
    if (!authState.token) return;

    try {
      const response = await authService.refreshToken(authState.token);
      // 새 토큰으로 쿠키 만료 갱신 포함
      login(response.access_token);
      setIsLoading(false);
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    }
  }, [authState.token, login, logout]);

  // 사용자 프로필 조회
  const { data: user, error: profileError } = useQuery({
    queryKey: AUTH_KEYS.profile(),
    queryFn: authService.getMyProfile,
    enabled: authState.isAuthenticated,
  });

  // 프로필 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (user) {
      setAuthState((prev) => ({ ...prev, user }));
      setIsLoading(false);
    }
  }, [user]);

  // 프로필 조회 실패 시 로그아웃
  useEffect(() => {
    if (profileError) {
      console.error("Profile fetch failed:", profileError);
      logout();
      setIsLoading(false);
    }
  }, [profileError, logout]);

  // 로그인하지 않은 상태일 때 자동으로 로그인 모달 표시
  useEffect(() => {
    if (!isLoading && !authState.isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [authState.isAuthenticated, isLoading]);

  const contextValue: AuthContextValue = {
    ...authState,
    user: user || null,
    isLoading,
    showLoginModal,
    login,
    logout,
    refreshToken,
    showLogin,
    hideLogin,
  };

  // 비인증 상태면 모달 자동 표시는 상단 useEffect로 처리

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// ============================================================================
// Custom Hooks
// ============================================================================

/**
 * 전역 인증 상태 훅
 */
export const useAuth = () => {
  return useAuthContext();
};

/**
 * 내 프로필 조회 훅
 */
export const useMyProfile = (
  options?: Omit<UseQueryOptions<User, Error>, "queryKey" | "queryFn">,
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: AUTH_KEYS.profile(),
    queryFn: authService.getMyProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
    ...options,
  });
};

/**
 * 프로필 업데이트 훅
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: UserUpdate) => authService.updateMyProfile(updates),
    onSuccess: () => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.profile() });
      queryClient.invalidateQueries({
        queryKey: AUTH_KEYS.profileWithPoints(),
      });
    },
  });
};

/**
 * 프로필 + 포인트 정보 훅
 */
export const useProfileWithPoints = (
  options?: Omit<
    UseQueryOptions<
      UserProfile & { points_balance: number; last_updated: string },
      Error
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: AUTH_KEYS.profileWithPoints(),
    queryFn: authService.getMyProfileWithPoints,
    enabled: isAuthenticated,
    staleTime: 60 * 1000, // 1분
    ...options,
  });
};

/**
 * 재정 요약 정보 훅
 */
export const useFinancialSummary = (
  options?: Omit<
    UseQueryOptions<
      {
        user_id: number;
        current_balance: number;
        points_earned_today: number;
        can_make_predictions: boolean;
        summary_date: string;
      },
      Error
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: AUTH_KEYS.financialSummary(),
    queryFn: authService.getMyFinancialSummary,
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30초
    ...options,
  });
};

/**
 * 사용자 목록 조회 훅 (무한 스크롤)
 */
export const useUserList = (params?: PaginationParams) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: AUTH_KEYS.userList(params),
    queryFn: () => authService.getUserList(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2분
  });
};

/**
 * 사용자 검색 훅 (디바운스 적용)
 */
export const useUserSearch = (query: string, limit?: number) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: AUTH_KEYS.userSearch(query, limit),
    queryFn: () =>
      authService.searchUsers({
        q: query,
        limit,
      }),
    enabled: isAuthenticated && query.length >= 2,
    staleTime: 30 * 1000, // 30초
    placeholderData: (previousData) => previousData, // 검색 중 이전 결과 유지
  });
};

/**
 * 지불 가능 여부 확인 훅
 */
export const useCheckAffordability = (amount: number) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: [...AUTH_KEYS.all, "affordability", amount],
    queryFn: () => authService.checkAffordability(amount),
    enabled: isAuthenticated && amount > 0,
    staleTime: 30 * 1000, // 30초
  });
};

/**
 * 로그아웃 훅
 */
export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // 서버에 로그아웃 요청 (선택적)
      try {
        if (typeof window !== "undefined") {
          const token = getClientCookie(TOKEN_COOKIE_KEY);
          if (token) {
            await authService.logout(token);
          }
        }
      } catch (error) {
        console.error("Logout request failed:", error);
      }

      // 클라이언트 상태 정리
      logout();
      // 모든 쿼리 캐시 클리어
      queryClient.clear();
    },
  });
};

/**
 * OAuth 로그인 시작 훅
 */
export const useOAuthLogin = () => {
  return useMutation({
    mutationFn: (params: OAuthAuthorizeParams) => {
      authService.startOAuthLogin(params);
      return Promise.resolve();
    },
  });
};

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * OAuth 콜백 처리 훅
 */
export const useOAuthCallback = () => {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useCallback(
    (url: string) => {
      const callbackData = parseOAuthCallback(url);
      if (callbackData) {
        login(callbackData.token);
        // 관련 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.profile() });
        return callbackData;
      }
      return null;
    },
    [login, queryClient],
  );
};

/**
 * 토큰 자동 갱신 훅
 */
export const useTokenRefresh = () => {
  const { token, isAuthenticated, refreshToken } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    // 토큰 만료 5분 전에 갱신
    const checkTokenExpiry = () => {
      if (token && !isTokenValid(token)) {
        refreshToken();
      }
    };

    // 1분마다 토큰 유효성 체크
    const interval = setInterval(checkTokenExpiry, 60 * 1000);

    return () => clearInterval(interval);
  }, [token, isAuthenticated, refreshToken]);

  return { refreshToken };
};

/**
 * 인증 상태 감시 훅
 */
export const useAuthWatcher = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User authenticated:", user.nickname);
    } else if (!isAuthenticated) {
      console.log("User not authenticated");
    }
  }, [isAuthenticated, user]);

  return { isAuthenticated, user };
};
