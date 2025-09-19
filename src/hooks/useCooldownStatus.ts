import { useQuery } from "@tanstack/react-query";
import { cooldownService } from "../services/cooldownService";
import { CooldownStatus } from "../types/cooldown";

// ============================================================================
// Query Keys
// ============================================================================

export const COOLDOWN_KEYS: {
  readonly all: readonly ["cooldown"];
  readonly status: () => readonly ["cooldown", "status"];
} = {
  all: ["cooldown"] as const,
  status: () => ["cooldown", "status"] as const,
} as const;

// ============================================================================
// Cooldown Query Hooks
// ============================================================================

interface UseCooldownStatusOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
}

/**
 * 현재 사용자의 쿨다운 상태를 조회하는 React Query 훅.
 * 기본적으로 30초마다 상태를 갱신합니다.
 */
export const useCooldownStatus = (options?: UseCooldownStatusOptions) => {
  const {
    enabled = true,
    staleTime = 30 * 1000,
    refetchInterval = 30 * 1000,
  } = options || {};

  return useQuery<CooldownStatus>({
    queryKey: COOLDOWN_KEYS.status(),
    queryFn: cooldownService.getCooldownStatus,
    enabled,
    staleTime,
    refetchInterval,
  });
};
