import { z } from "zod";
import { DateStringSchema, DateTimeStringSchema } from "./common";

// ============================================================================
// Enums
// ============================================================================

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
  KAKAO = "kakao",
}

export enum UserRole {
  USER = "user",
  PREMIUM = "premium",
  ADMIN = "admin",
}

// ============================================================================
// User Types
// ============================================================================

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  nickname: z.string(),
  auth_provider: z.nativeEnum(AuthProvider),
  created_at: DateTimeStringSchema,
  last_login_at: DateTimeStringSchema.nullable(),
  is_active: z.boolean(),
  role: z.nativeEnum(UserRole),
});

export const UserProfileSchema = z.object({
  user_id: z.number(),
  email: z.string().email(),
  nickname: z.string(),
  auth_provider: z.nativeEnum(AuthProvider),
  created_at: DateTimeStringSchema,
  is_oauth_user: z.boolean(),
});

export const UserUpdateSchema = z.object({
  nickname: z.string().optional(),
  email: z.string().email().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;

// ============================================================================
// OAuth Types
// ============================================================================

export const OAuthAuthorizeParamsSchema = z.object({
  provider: z.enum(["google", "kakao"]),
  client_redirect: z.string().url(),
});

export const OAuthCallbackParamsSchema = z.object({
  token: z.string(),
  user_id: z.string(),
  nickname: z.string(),
  provider: z.string(),
  is_new_user: z.enum(["true", "false"]),
});

export type OAuthAuthorizeParams = z.infer<typeof OAuthAuthorizeParamsSchema>;
export type OAuthCallbackParams = z.infer<typeof OAuthCallbackParamsSchema>;

// ============================================================================
// Token Types
// ============================================================================

export const TokenRefreshRequestSchema = z.object({
  current_token: z.string(),
});

export const TokenRefreshResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal("bearer"),
});

export type TokenRefreshRequest = z.infer<typeof TokenRefreshRequestSchema>;
export type TokenRefreshResponse = z.infer<typeof TokenRefreshResponseSchema>;

// ============================================================================
// User List Types
// ============================================================================

export const UserListItemSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  auth_provider: z.nativeEnum(AuthProvider),
  created_at: DateTimeStringSchema,
});

export const UserListResultSchema = z.object({
  users: z.array(UserListItemSchema),
  count: z.number(),
});

export const UserSearchParamsSchema = z.object({
  query: z.string().min(1, "검색어를 입력해주세요"),
  limit: z.number().min(1).max(50).optional(),
  offset: z.number().min(0).optional(),
});

export const UserSearchResultSchema = z.object({
  users: z.array(
    z.object({
      id: z.number(),
      nickname: z.string(),
      auth_provider: z.nativeEnum(AuthProvider),
    }),
  ),
  count: z.number(),
});

export type UserListItem = z.infer<typeof UserListItemSchema>;
export type UserListResult = z.infer<typeof UserListResultSchema>;
export type UserSearchParams = z.infer<typeof UserSearchParamsSchema>;
export type UserSearchResult = z.infer<typeof UserSearchResultSchema>;

// ============================================================================
// Auth State Types
// ============================================================================

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextValue extends AuthState {
  isLoading: boolean;
  showLoginModal: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
  showLogin: () => void;
  hideLogin: () => void;
}

// ============================================================================
// Validation Schemas
// ============================================================================

export const LoginCredentialsSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

export const RegisterCredentialsSchema = z
  .object({
    email: z.string().email("유효한 이메일을 입력해주세요"),
    nickname: z
      .string()
      .min(2, "닉네임은 최소 2자 이상이어야 합니다")
      .max(20, "닉네임은 최대 20자까지 가능합니다"),
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
export type RegisterCredentials = z.infer<typeof RegisterCredentialsSchema>;

// ============================================================================
// Utility Functions
// ============================================================================

export const isOAuthProvider = (provider: string): provider is AuthProvider => {
  return Object.values(AuthProvider).includes(provider as AuthProvider);
};

export const isNewUser = (isNewUserStr: string): boolean => {
  return isNewUserStr === "true";
};

export const getProviderDisplayName = (provider: AuthProvider): string => {
  switch (provider) {
    case AuthProvider.GOOGLE:
      return "Google";
    case AuthProvider.KAKAO:
      return "Kakao";
    case AuthProvider.LOCAL:
      return "일반";
    default:
      return provider;
  }
};

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.USER:
      return "일반 사용자";
    case UserRole.PREMIUM:
      return "프리미엄 사용자";
    case UserRole.ADMIN:
      return "관리자";
    default:
      return role;
  }
};
