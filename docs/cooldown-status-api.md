# Cooldown Status API Guide

프론트엔드에서 예측 슬롯 쿨다운 상태를 조회할 때 사용할 수 있는 `GET /api/v1/cooldown/status` 엔드포인트 가이드입니다. ox API 클라이언트(`oxApi`)를 사용하며, 서비스/커스텀 훅이 함께 제공됩니다.

## Endpoint

- **Method**: `GET`
- **Path**: `/api/v1/cooldown/status`
- **Headers**:
  - `Authorization: Bearer <JWT>` (필수)
  - `Content-Type: application/json`
- **Query/Body**: 없음 (인증된 사용자 컨텍스트로만 동작)

## 성공 응답 (200)

```json
{
  "has_active_cooldown": true,
  "next_refill_at": "2024-09-03T14:15:00+09:00",
  "daily_timer_count": 4,
  "remaining_timer_quota": 6
}
```

필드 설명:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `has_active_cooldown` | `boolean` | 현재 활성화된 쿨다운 타이머가 존재하는지 여부 |
| `next_refill_at` | `string \| null` | 다음 슬롯 충전 예정 시각 (KST, ISO8601). 타이머 없으면 `null` |
| `daily_timer_count` | `number` | 당일 생성된 쿨다운 타이머 수 |
| `remaining_timer_quota` | `number` | 하루 최대 생성 가능 타이머 수(`MAX_COOLDOWN_TIMERS_PER_DAY`, 기본 10)에서 `daily_timer_count`를 뺀 값 |

## 오류 응답

- **400**: 요청 검증 실패. `{ "detail": "<오류 메시지>" }`
- **401**: 인증 실패(FastAPI 기본 응답). 토큰 만료 시 전역 로그인 모달 트리거.
- **500**: 내부 오류. `{ "detail": "쿨다운 상태 조회 중 오류가 발생했습니다." }`

## 타입 정의

- 경로: `src/types/cooldown.ts`
- TypeScript 타입: `CooldownStatus`

```ts
export type CooldownStatus = {
  has_active_cooldown: boolean;
  next_refill_at: string | null;
  daily_timer_count: number;
  remaining_timer_quota: number;
};
```

> 실제 타입은 Zod 스키마(`CooldownStatusSchema`)로 검증되며, ox API 서비스에서 자동으로 파싱합니다.

## 서비스 레이어

- 경로: `src/services/cooldownService.ts`
- 사용 예시:

```ts
import { cooldownService } from "@/services/cooldownService";

const status = await cooldownService.getCooldownStatus();
console.log(status.remaining_timer_quota);
```

서비스는 ox API 클라이언트(`oxApi`)를 사용하여 응답을 가져오고 `CooldownStatusSchema`로 검증합니다.

## React Query 훅

- 경로: `src/hooks/useCooldownStatus.ts`
- 기본 갱신 주기는 30초입니다.

```ts
import { useCooldownStatus } from "@/hooks/useCooldownStatus";

export function CooldownBadge() {
  const { data, isLoading, error } = useCooldownStatus();

  if (isLoading) return <span>쿨다운 확인 중...</span>;
  if (error || !data) return <span>상태를 불러오지 못했습니다.</span>;

  return (
    <span>
      {data.has_active_cooldown ? "쿨다운 진행 중" : "즉시 사용 가능"} ·
      남은 슬롯 {data.remaining_timer_quota}
    </span>
  );
}
```

옵션으로 `enabled`, `staleTime`, `refetchInterval`(숫자 또는 `false`)을 전달하여 동작을 제어할 수 있습니다.

## UI 통합 팁

1. 기존 슬롯/쿨다운 UI(`CooldownStatusCard`)에 `useCooldownStatus`를 연결하면 서버의 실제 쿨다운 상태를 표시할 수 있습니다.
2. `next_refill_at`은 `Date` 객체로 변환하여 남은 시간을 카운트다운하거나, `dayjs`/`date-fns`를 사용해 상대 시간으로 표시할 수 있습니다.
3. `remaining_timer_quota`가 0이 되면 슬롯을 추가로 요청할 수 없으므로 버튼을 비활성화하거나 안내 모달을 띄우세요.
4. 에러 상태에서는 글로벌 토스트 또는 로그인 모달 트리거(401) 등 기존 패턴을 재사용하세요.

## 패치 후 확인 체크리스트

- 인증 토큰이 있는 상태에서 `/api/v1/cooldown/status` 호출 시 200 응답 수신
- 토큰이 없거나 만료된 상황에서 401 응답 및 전역 로그인 모달 동작
- React Query 캐시 키 `cooldown.status` 공유 여부 확인 (중복 호출 방지)
- 슬롯 카운트 감소/충전 이벤트 후 `queryClient.invalidateQueries(COOLDOWN_KEYS.status())` 호출 고려
