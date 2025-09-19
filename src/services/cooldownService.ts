import { oxApi } from "./api";
import { CooldownStatus, CooldownStatusSchema } from "../types/cooldown";

export const cooldownService = {
  /**
   * 현재 사용자의 쿨다운 상태를 조회합니다.
   */
  getCooldownStatus: async (): Promise<CooldownStatus> => {
    const response = await oxApi.getDirect<CooldownStatus>("/cooldown/status");
    return CooldownStatusSchema.parse(response);
  },
};
