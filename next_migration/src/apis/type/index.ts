import { z } from "zod";
import { IconSchema } from "../services/habbits/schemas";

export type Icon = z.infer<typeof IconSchema>;

export type Habbit = {
  id: number; // 고유 ID (UUID)
  title: string; // 습관 이름
  icon: Icon; // 아이콘 또는 이미지 경로
  group: string; // 그룹 또는 카테고리
  userId?: number; // 소유자의 사용자 ID
  createdAt?: Date | string; // 생성된 날짜
  updateAt?: Date | string; // 업데이트된 날짜
  deleted_at?: Date | string | null; // 소프트 삭제 날짜 (삭제되지 않았으면 null)
  records?: Record[]; // 습관 실행 기록
};

export type Record = {
  id: number; // 기록 고유 ID
  habbitId: number; // 관련 습관의 ID
  imageUrl?: string;
  createdAt?: Date | string; // 생성된 날짜
  updateAt?: Date | string; // 업데이트된 날짜
  deleted_at?: Date | string | null; // 소프트 삭제 날짜 (삭제되지 않았으면 null)
};

export type User = {
  id: number;
  avatar: string;
  email: string;
  userName: string;
  access_token: string;
  refresh_token: string;
  habbits: Habbit[]; // 사용자가 만든 습관들
};
