import { z } from "zod";

// ============================================================================
// Base Response Types
// ============================================================================

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
});

export const BaseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: ApiErrorSchema.optional(),
    meta: z
      .object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        total_count: z.number().optional(),
        has_next: z.boolean().optional(),
      })
      .optional(),
  });

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type BaseResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    limit?: number;
    offset?: number;
    total_count?: number;
    has_next?: boolean;
    [key: string]: any;
  };
};

// ============================================================================
// Error Codes
// ============================================================================

export enum ErrorCode {
  // Auth related
  UNAUTHORIZED = "AUTH_001",
  FORBIDDEN = "AUTH_002",
  TOKEN_EXPIRED = "AUTH_003",
  INVALID_CREDENTIALS = "AUTH_004",

  // OAuth related
  OAUTH_INVALID_CODE = "OAUTH_001",
  OAUTH_STATE_MISMATCH = "OAUTH_002",
  OAUTH_PROVIDER_ERROR = "OAUTH_003",

  // User related
  USER_ALREADY_EXISTS = "USER_001",
  USER_NOT_FOUND = "USER_002",

  // Prediction related
  PREDICTION_NOT_FOUND = "PRED_001",
  PREDICTION_ALREADY_EXISTS = "PRED_002",
  PREDICTION_LIMIT_EXCEEDED = "PRED_003",
  PREDICTION_TIME_EXPIRED = "PRED_004",

  // Points related
  INSUFFICIENT_POINTS = "POINT_001",
  POINT_TRANSACTION_FAILED = "POINT_002",

  // Session related
  SESSION_NOT_FOUND = "SESS_001",
  SESSION_CLOSED = "SESS_002",

  // Universe related
  UNIVERSE_NOT_FOUND = "UNIV_001",
  SYMBOL_NOT_FOUND = "UNIV_002",

  // Ad related
  AD_WATCH_FAILED = "AD_001",
  SLOT_UNLOCK_FAILED = "AD_002",

  // Reward related
  REWARD_NOT_FOUND = "REW_001",
  REWARD_OUT_OF_STOCK = "REW_002",
  REWARD_REDEMPTION_FAILED = "REW_003",

  // General
  VALIDATION_ERROR = "VAL_001",
  INTERNAL_SERVER_ERROR = "INT_001",
  RATE_LIMIT_EXCEEDED = "RATE_001",
}

// ============================================================================
// Pagination Types
// ============================================================================

export const PaginationParamsSchema = z.object({
  limit: z.number().min(1).optional(),
  offset: z.number().min(0).optional(),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

// BaseResponse를 래핑하는 페이지네이션 (대부분)
export type PaginatedResponse<T> = BaseResponse<T> & {
  meta?: {
    limit: number;
    offset: number;
    total_count?: number;
    has_next?: boolean;
  };
};

// 직접 응답하는 페이지네이션 (일부)
export type DirectPaginatedResponse<T> = {
  data: T[];
  total_count: number;
  has_next: boolean;
  limit: number;
  offset: number;
};

// ============================================================================
// Pagination Limits
// ============================================================================

export const PAGINATION_LIMITS = {
  PREDICTIONS_HISTORY: { min: 1, max: 100, default: 50 },
  POINTS_LEDGER: { min: 1, max: 100, default: 50 },
  REWARDS_HISTORY: { min: 1, max: 100, default: 50 },
  USER_LIST: { min: 1, max: 100, default: 20 },
  USER_SEARCH: { min: 1, max: 50, default: 20 },
} as const;

// ============================================================================
// Utility Types
// ============================================================================

// API 응답에서 data 필드만 추출하는 유틸리티 타입
export type ExtractApiData<T> = T extends BaseResponse<infer U> ? U : T;

// 페이지네이션 파라미터 검증 함수
export const validatePaginationParams = (
  params: PaginationParams,
  limits: (typeof PAGINATION_LIMITS)[keyof typeof PAGINATION_LIMITS],
): PaginationParams => {
  return {
    limit: Math.min(
      Math.max(params.limit || limits.default, limits.min),
      limits.max,
    ),
    offset: Math.max(params.offset || 0, 0),
  };
};

// ============================================================================
// Common Schemas
// ============================================================================

export const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const DateTimeStringSchema = z.string().datetime();
export const PositiveNumberSchema = z.number().positive();
export const NonNegativeNumberSchema = z.number().min(0);

// ============================================================================
// API Client Types
// ============================================================================

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}
