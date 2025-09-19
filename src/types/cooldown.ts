import { z } from "zod";
import { DateTimeStringSchema, NonNegativeNumberSchema } from "./common";

// ============================================================================
// Cooldown Status Schema
// ============================================================================

export const CooldownStatusSchema = z.object({
  has_active_cooldown: z.boolean(),
  next_refill_at: DateTimeStringSchema.nullable(),
  daily_timer_count: NonNegativeNumberSchema,
  remaining_timer_quota: NonNegativeNumberSchema,
});

// ============================================================================
// Type Exports
// ============================================================================

export type CooldownStatus = z.infer<typeof CooldownStatusSchema>;
