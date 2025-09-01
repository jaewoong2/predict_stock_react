import {
  User,
  UserProfile,
  UserUpdate,
  UserListItem,
  UserListResult,
} from "../types/auth";
import { BaseResponse, PaginationParams } from "../types/common";
import { oxApi } from "./api";

// ============================================================================
// User Service
// ============================================================================

export const userService = {
  /**
   * 내 프로필 조회
   */
  getMyProfile: async (): Promise<UserProfile> => {
    const response = await oxApi.get<BaseResponse<UserProfile>>("/users/me");
    return response.data.data!;
  },

  /**
   * 내 프로필 업데이트
   */
  updateMyProfile: async (data: UserUpdate): Promise<UserProfile> => {
    const response = await oxApi.put<BaseResponse<UserProfile>>(
      "/users/me",
      data,
    );
    return response.data.data!;
  },

  /**
   * 사용자 목록 조회 (페이지네이션)
   */
  getUserList: async (params: PaginationParams): Promise<UserListResult> => {
    const response = await oxApi.get<BaseResponse<UserListResult>>("/users", {
      params,
    });
    return response.data.data!;
  },

  /**
   * 사용자 검색
   */
  searchUsers: async (params: PaginationParams): Promise<UserListResult> => {
    const response = await oxApi.get<BaseResponse<UserListResult>>(
      "/users/search",
      {
        params,
      },
    );
    return response.data.data!;
  },

  /**
   * 특정 사용자 조회
   */
  getUserById: async (userId: number): Promise<User> => {
    const response = await oxApi.get<BaseResponse<User>>(`/users/${userId}`);
    return response.data.data!;
  },
};
