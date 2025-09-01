import { z } from "zod";
import { DateTimeStringSchema } from "./common";

// ============================================================================
// Enums
// ============================================================================

export enum RewardCategory {
  GIFT_CARD = "gift_card",
  COUPON = "coupon",
  PHYSICAL_ITEM = "physical_item",
  DIGITAL_ITEM = "digital_item",
  CHARITY = "charity",
}

export enum RedemptionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// ============================================================================
// Reward Item Types
// ============================================================================

export const RewardItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  category: z.nativeEnum(RewardCategory),
  points_cost: z.number(),
  image_url: z.string().url().optional(),
  is_available: z.boolean(),
  stock_quantity: z.number().optional(),
  redemption_limit_per_user: z.number().optional(),
  created_at: DateTimeStringSchema,
  updated_at: DateTimeStringSchema,
});

export const RewardCatalogSchema = z.object({
  items: z.array(RewardItemSchema),
  total_count: z.number(),
  has_next: z.boolean(),
});

// ============================================================================
// Redemption Types
// ============================================================================

export const RewardRedemptionRequestSchema = z.object({
  reward_id: z.number(),
  quantity: z.number().min(1).default(1),
  delivery_address: z.string().optional(),
  contact_phone: z.string().optional(),
  additional_notes: z.string().optional(),
});

export const RewardRedemptionSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  reward_id: z.number(),
  reward_name: z.string(),
  points_spent: z.number(),
  quantity: z.number(),
  status: z.nativeEnum(RedemptionStatus),
  delivery_address: z.string().optional(),
  contact_phone: z.string().optional(),
  additional_notes: z.string().optional(),
  created_at: DateTimeStringSchema,
  updated_at: DateTimeStringSchema,
  completed_at: DateTimeStringSchema.optional(),
});

export const RewardRedemptionResponseSchema = z.object({
  redemption: RewardRedemptionSchema,
  message: z.string().optional(),
});

export const RewardRedemptionHistorySchema = z.object({
  id: z.number(),
  user_id: z.number(),
  reward_id: z.number(),
  reward_name: z.string(),
  points_spent: z.number(),
  quantity: z.number(),
  status: z.nativeEnum(RedemptionStatus),
  delivery_address: z.string().optional(),
  contact_phone: z.string().optional(),
  additional_notes: z.string().optional(),
  created_at: DateTimeStringSchema,
  updated_at: DateTimeStringSchema,
  completed_at: DateTimeStringSchema.optional(),
});

export const RedemptionListSchema = z.object({
  items: z.array(RewardRedemptionSchema),
  total_count: z.number(),
  has_next: z.boolean(),
});

export const RewardRedemptionHistoryResponseSchema = z.object({
  history: z.array(RewardRedemptionHistorySchema),
  total_count: z.number(),
  has_next: z.boolean(),
});

// ============================================================================
// User Reward Stats
// ============================================================================

export const UserRewardStatsSchema = z.object({
  total_points_earned: z.number(),
  total_points_spent: z.number(),
  total_redemptions: z.number(),
  pending_redemptions: z.number(),
  completed_redemptions: z.number(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type RewardItem = z.infer<typeof RewardItemSchema>;
export type RewardCatalog = z.infer<typeof RewardCatalogSchema>;
export type RewardCatalogResponse = z.infer<typeof RewardCatalogSchema>;
export type RewardRedemptionRequest = z.infer<
  typeof RewardRedemptionRequestSchema
>;
export type RewardRedemption = z.infer<typeof RewardRedemptionSchema>;
export type RewardRedemptionResponse = z.infer<
  typeof RewardRedemptionResponseSchema
>;
export type RewardRedemptionHistory = z.infer<
  typeof RewardRedemptionHistorySchema
>;
export type RedemptionList = z.infer<typeof RedemptionListSchema>;
export type RewardRedemptionHistoryResponse = z.infer<
  typeof RewardRedemptionHistoryResponseSchema
>;
export type UserRewardStats = z.infer<typeof UserRewardStatsSchema>;
