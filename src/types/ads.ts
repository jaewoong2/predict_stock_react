import { z } from "zod";
import { DateTimeStringSchema } from "./common";

// ============================================================================
// Enums
// ============================================================================

export enum UnlockMethod {
  AD_WATCH = "ad_watch",
  POINTS_PURCHASE = "points_purchase",
  PREMIUM_SUBSCRIPTION = "premium_subscription",
}

// ============================================================================
// Ad Types
// ============================================================================

export const AdWatchRequestSchema = z.object({
  slot_id: z.number(),
  ad_provider: z.string(),
  ad_unit_id: z.string(),
});

export const AdWatchResponseSchema = z.object({
  success: z.boolean(),
  slot_unlocked: z.boolean(),
  points_earned: z.number().optional(),
  next_available_at: DateTimeStringSchema.optional(),
});

export const AvailableSlotsResponseSchema = z.object({
  total_slots: z.number(),
  used_slots: z.number(),
  available_slots: z.number(),
  slots: z.array(
    z.object({
      id: z.number(),
      is_available: z.boolean(),
      unlock_method: z.nativeEnum(UnlockMethod),
      points_cost: z.number().optional(),
      next_available_at: DateTimeStringSchema.optional(),
      ad_provider: z.string().optional(),
      ad_unit_id: z.string().optional(),
    }),
  ),
});

export const SlotUnlockRequestSchema = z.object({
  slot_id: z.number(),
  unlock_method: z.nativeEnum(UnlockMethod),
});

export const SlotUnlockResponseSchema = z.object({
  success: z.boolean(),
  slot_id: z.number(),
  unlock_method: z.nativeEnum(UnlockMethod),
  points_spent: z.number().optional(),
  next_available_at: DateTimeStringSchema.optional(),
});

// ============================================================================
// Ad History Types
// ============================================================================

export const AdWatchHistorySchema = z.object({
  id: z.number(),
  user_id: z.number(),
  slot_id: z.number(),
  ad_provider: z.string(),
  ad_unit_id: z.string(),
  watched_at: DateTimeStringSchema,
  points_earned: z.number().optional(),
  success: z.boolean(),
});

export const AdWatchHistoryListSchema = z.object({
  items: z.array(AdWatchHistorySchema),
  total_count: z.number(),
  has_next: z.boolean(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type AdWatchRequest = z.infer<typeof AdWatchRequestSchema>;
export type AdWatchResponse = z.infer<typeof AdWatchResponseSchema>;
export type AvailableSlotsResponse = z.infer<
  typeof AvailableSlotsResponseSchema
>;
export type SlotUnlockRequest = z.infer<typeof SlotUnlockRequestSchema>;
export type SlotUnlockResponse = z.infer<typeof SlotUnlockResponseSchema>;
export type AdWatchHistory = z.infer<typeof AdWatchHistorySchema>;
export type AdWatchHistoryList = z.infer<typeof AdWatchHistoryListSchema>;
