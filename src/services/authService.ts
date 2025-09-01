import { oxApi, getOxBaseUrl } from "./api";
import {
  User,
  UserProfile,
  UserUpdate,
  TokenRefreshResponse,
  OAuthAuthorizeParams,
  UserListResult,
  UserSearchResult,
} from "../types/auth";
import {
  PAGINATION_LIMITS,
  PaginationParams,
  validatePaginationParams,
} from "../types/common";

export const authService = {
  // ============================================================================
  // OAuth Authentication
  // ============================================================================

  /**
   * OAuth 로그인 시작
   * 브라우저가 자동으로 OAuth 제공자 페이지로 리다이렉트됨
   */
  startOAuthLogin: (params: OAuthAuthorizeParams): void => {
    const { provider, client_redirect } = params;
    // oxApi의 baseURL 사용
    const baseUrl = getOxBaseUrl();
    
    const url = `${baseUrl}/auth/oauth/${provider}/authorize?client_redirect=${encodeURIComponent(client_redirect)}`;

    // 브라우저 리다이렉트
    window.location.href = url;
  },

  // ============================================================================
  // Token Management
  // ============================================================================

  /**
   * 토큰 갱신
   */
  refreshToken: async (currentToken: string): Promise<TokenRefreshResponse> => {
    return await oxApi.postWithBaseResponse<TokenRefreshResponse>(
      "/auth/token/refresh",
      { current_token: currentToken },
    );
  },

  /**
   * 로그아웃
   */
  logout: async (token: string): Promise<void> => {
    await oxApi.postWithBaseResponse<void>("/auth/logout", { token });
  },

  // ============================================================================
  // User Profile Management
  // ============================================================================

  /**
   * 내 프로필 조회
   */
  getMyProfile: async (): Promise<User> => {
    return await oxApi.getWithBaseResponse<User>("/users/me");
  },

  /**
   * 프로필 업데이트
   */
  updateMyProfile: async (updates: UserUpdate): Promise<User> => {
    return await oxApi.putWithBaseResponse<User>("/users/me", updates);
  },

  // ============================================================================
  // User List & Search
  // ============================================================================

  /**
   * 사용자 목록 조회 (페이지네이션)
   */
  getUserList: async (params?: PaginationParams): Promise<UserListResult> => {
    const validatedParams = validatePaginationParams(
      params || {},
      PAGINATION_LIMITS.USER_LIST,
    );

    const queryString = new URLSearchParams({
      limit: (
        validatedParams.limit || PAGINATION_LIMITS.USER_LIST.default
      ).toString(),
      offset: (validatedParams.offset || 0).toString(),
    });

    return await oxApi.getWithBaseResponse<UserListResult>(
      `/users/?${queryString}`,
    );
  },

  /**
   * 사용자 검색 (제한된 페이지네이션)
   */
  searchUsers: async (params: {
    q: string;
    limit?: number;
  }): Promise<UserSearchResult> => {
    const limit = Math.min(
      Math.max(
        params.limit || PAGINATION_LIMITS.USER_SEARCH.default,
        PAGINATION_LIMITS.USER_SEARCH.min,
      ),
      PAGINATION_LIMITS.USER_SEARCH.max,
    );

    const queryString = new URLSearchParams({
      q: params.q,
      limit: limit.toString(),
    });

    return await oxApi.getWithBaseResponse<UserSearchResult>(
      `/users/search/nickname?${queryString}`,
    );
  },

  // ============================================================================
  // Profile with Points (통합 정보)
  // ============================================================================

  /**
   * 프로필 + 포인트 정보 조회
   */
  getMyProfileWithPoints: async (): Promise<
    UserProfile & { points_balance: number; last_updated: string }
  > => {
    const response = await oxApi.get<
      UserProfile & { points_balance: number; last_updated: string }
    >("/users/me/profile-with-points");
    return response.data;
  },

  /**
   * 재정 요약 정보 조회
   */
  getMyFinancialSummary: async (): Promise<{
    user_id: number;
    current_balance: number;
    points_earned_today: number;
    can_make_predictions: boolean;
    summary_date: string;
  }> => {
    const response = await oxApi.get<{
      user_id: number;
      current_balance: number;
      points_earned_today: number;
      can_make_predictions: boolean;
      summary_date: string;
    }>("/users/me/financial-summary");
    return response.data;
  },

  /**
   * 지불 가능 여부 확인
   */
  checkAffordability: async (
    amount: number,
  ): Promise<{
    amount: number;
    can_afford: boolean;
    current_balance: number;
    shortfall: number;
  }> => {
    const response = await oxApi.get<{
      amount: number;
      can_afford: boolean;
      current_balance: number;
      shortfall: number;
    }>(`/users/me/can-afford/${amount}`);
    return response.data;
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * OAuth 콜백 파라미터를 URL에서 파싱
 */
export const parseOAuthCallback = (
  url: string,
): {
  token: string;
  user_id: string;
  nickname: string;
  provider: string;
  is_new_user: boolean;
} | null => {
  try {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const token = urlParams.get("token");
    const user_id = urlParams.get("user_id");
    const nickname = urlParams.get("nickname");
    const provider = urlParams.get("provider");
    const is_new_user = urlParams.get("is_new_user");

    if (!token || !user_id || !nickname || !provider || !is_new_user) {
      return null;
    }

    return {
      token,
      user_id,
      nickname,
      provider,
      is_new_user: is_new_user === "true",
    };
  } catch (error) {
    console.error("OAuth callback parsing failed:", error);
    return null;
  }
};

/**
 * 토큰 유효성 검사 (JWT 디코딩)
 */
export const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

/**
 * 토큰에서 사용자 정보 추출
 */
export const extractUserFromToken = (
  token: string,
): {
  user_id: number;
  email: string;
  role: string;
} | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      user_id: payload.user_id,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    return null;
  }
};
