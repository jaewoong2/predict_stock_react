import { z } from "zod";
import {
  CreateHabbitResponseSchema,
  GetHabbitResponseSchema,
  UpdateHabbitResponseSchema,
} from "./schemas";
import { Icon } from "@/apis/type";

export interface CreateHabbitRequest {
  title: string;
  icon: Icon;
  group: string;
}

export type CreateHabbitResponse = z.infer<typeof CreateHabbitResponseSchema>;

export interface UpdateHabbitRequest {
  habbitId: number;
  title?: string;
  icon?: Icon;
  group?: string;
}

export interface DeleteHabbitRequest {
  habbitId: number;
  title?: string;
  icon?: Icon;
  group?: string;
}

export type UpdateHabbitResponse = z.infer<typeof UpdateHabbitResponseSchema>;

export interface GetHabbitRequest {
  title: string;
}

export type GetHabbitResponse = z.infer<typeof GetHabbitResponseSchema>;

export interface GetHabbitAllRequest {
  page?: number;
  take?: number;
}

export interface DeleteHabbitResponse {
  success: boolean;
}

export interface RecordHabbitRequest {
  title: string; // 습관 제목
  date: Date;
  percentage: number;
  imageUrl?: string; // 기록 이미지 URL (선택적)
}

export interface RecordHabbitResponse {
  message: string; // 응답 메시지
}
