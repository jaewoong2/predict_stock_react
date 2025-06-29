import { z } from "zod";
// Icon 타입과 동일한 값을 가지는 Zod enum 정의
export const IconSchema = z.enum([
  "star",
  "smile",
  "salad",
  "glassWater",
  "sun",
  "moon",
  "none",
  "finance",
  "workout",
]);

export const RecordSchema = z.object({
  id: z.number(),
  habbitId: z.number(),
  imageUrl: z.string().optional(),
  createdAt: z.string().date().optional(),
  updateAt: z.string().date().optional(),
  deleted_at: z.string().date().optional(),
});

export const CreateHabbitRequestSchema = z.object({
  title: z.string(),
  icon: IconSchema,
  group: z.string(),
});

export const CreateHabbitResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  icon: IconSchema,
  group: z.string(),
  userId: z.number(),
});

export const UpdateHabbitResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  icon: IconSchema,
  group: z.string(),
});

export const GetHabbitResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  icon: IconSchema,
  group: z.string(),

  userId: z.number().optional(),
  createdAt: z.string().date().optional(),
  updateAt: z.string().date().optional(),
  deleted_at: z.string().date().optional(),
  records: z.array(RecordSchema).optional(),
});
