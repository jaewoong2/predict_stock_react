# O/X 예측 서비스 API 구현 TODO

## 🎯 목표
ox-universe-api.md에 정의된 API를 현재 프로젝트 컨벤션에 맞춰 구현

## 📋 Ground Rules & 컨벤션

### 1. 프로젝트 구조
```
src/
├── services/          # API 서비스 레이어
├── hooks/            # React Query 커스텀 훅
├── types/            # TypeScript 타입 정의
└── lib/              # 유틸리티 함수
```

### 2. 코딩 컨벤션
- **Service Layer**: 순수한 API 호출 로직, 에러 처리 포함
- **Hook Layer**: React Query와 UI 상태 관리
- **Type Layer**: Zod 스키마 + TypeScript 인터페이스
- **파일명**: camelCase (예: `authService.ts`, `useAuth.ts`)
- **함수명**: camelCase (예: `getMyProfile`, `useSubmitPrediction`)
- **상수**: UPPER_SNAKE_CASE (예: `API_BASE_URL`, `PAGINATION_LIMITS`)

### 3. API 클라이언트 패턴
```typescript
// services/api.ts 기반 사용
const response = await api.get<T>(`/endpoint`);
return response.data;
```

### 4. React Query 패턴
```typescript
// 쿼리 키 상수 정의
export const AUTH_KEYS = {
  all: ["auth"] as const,
  profile: () => [...AUTH_KEYS.all, "profile"] as const,
  // ...
};

// 커스텀 훅
export const useMyProfile = () => {
  return useQuery({
    queryKey: AUTH_KEYS.profile(),
    queryFn: () => authService.getMyProfile(),
    enabled: !!token,
  });
};
```

### 5. Zod 스키마 패턴
```typescript
// types/auth.ts
import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  nickname: z.string(),
  // ...
});

export type User = z.infer<typeof UserSchema>;
```

## 📝 구현 TODO

### Phase 1: 기본 설정 및 공통 타입 ✅
- [x] 프로젝트 컨벤션 파악
- [x] todo.md 생성
- [x] 공통 타입 정의 (`src/types/common.ts`)
  - [x] BaseResponse, ApiError, ErrorCode
  - [x] PaginationParams, PaginatedResponse
  - [x] PAGINATION_LIMITS 상수

### Phase 2: 인증 시스템 ✅
- [x] 인증 타입 정의 (`src/types/auth.ts`)
  - [x] AuthProvider, UserRole enum
  - [x] User, UserProfile, UserUpdate interface
  - [x] OAuth 관련 타입들
- [x] 인증 서비스 (`src/services/authService.ts`)
  - [x] OAuth 로그인 시작
  - [x] 토큰 갱신
  - [x] 로그아웃
- [x] 인증 훅 (`src/hooks/useAuth.ts`)
  - [x] useAuth (전역 인증 상태)
  - [x] useTokenRefresh
  - [x] useLogout

### Phase 3: 사용자 관리 ✅
- [x] 사용자 서비스 (`src/services/userService.ts`)
  - [x] 내 프로필 조회/업데이트
  - [x] 사용자 목록 조회 (페이지네이션)
  - [x] 사용자 검색
- [x] 사용자 훅 (`src/hooks/useUser.ts`)
  - [x] useMyProfile
  - [x] useUpdateProfile
  - [x] useUserList (무한 스크롤)
  - [x] useUserSearch (디바운스)

### Phase 4: 예측 시스템 ✅
- [x] 예측 타입 정의 (`src/types/prediction.ts`)
  - [x] PredictionChoice, PredictionStatus enum
  - [x] Prediction, PredictionCreate interface
- [x] 예측 서비스 (`src/services/predictionService.ts`)
  - [x] 예측 제출/수정/취소
  - [x] 예측 이력 조회
  - [x] 남은 예측 슬롯 조회
- [x] 예측 훅 (`src/hooks/usePrediction.ts`)
  - [x] useSubmitPrediction
  - [x] usePredictionHistory (무한 스크롤)
  - [x] usePredictionsForDay
  - [x] useRemainingPredictions

### Phase 5: 세션 관리 ✅
- [x] 세션 타입 정의 (`src/types/session.ts`)
  - [x] SessionStatus enum
  - [x] Session, MarketStatus interface
- [x] 세션 서비스 (`src/services/sessionService.ts`)
  - [x] 오늘 세션 조회
  - [x] 예측 가능 여부 확인
- [x] 세션 훅 (`src/hooks/useSession.ts`)
  - [x] useTodaySession
  - [x] useCanPredict

### Phase 6: 종목 유니버스 ✅
- [x] 유니버스 타입 정의 (`src/types/universe.ts`)
  - [x] UniverseItem, UniverseItemWithPrice interface
- [x] 유니버스 서비스 (`src/services/universeService.ts`)
  - [x] 오늘의 종목 조회
  - [x] 가격 정보 포함 종목 조회
- [x] 유니버스 훅 (`src/hooks/useUniverse.ts`)
  - [x] useTodayUniverse
  - [x] useTodayUniverseWithPrices

### Phase 7: 포인트 시스템 ✅
- [x] 포인트 타입 정의 (`src/types/points.ts`)
  - [x] PointsBalance, PointsLedgerEntry interface
- [x] 포인트 서비스 (`src/services/pointService.ts`)
  - [x] 포인트 잔액 조회
  - [x] 포인트 거래 내역 조회
  - [x] 지불 가능 여부 확인
- [x] 포인트 훅 (`src/hooks/usePoints.ts`)
  - [x] usePointsBalance
  - [x] usePointsLedger (무한 스크롤)
  - [x] useProfileWithPoints

### Phase 8: 광고 및 슬롯 시스템 ✅
- [x] 광고 타입 정의 (`src/types/ads.ts`)
  - [x] UnlockMethod enum
  - [x] AvailableSlotsResponse interface
- [x] 광고 서비스 (`src/services/adService.ts`)
  - [x] 사용 가능한 슬롯 조회
  - [x] 광고 시청 완료 처리
  - [x] 슬롯 해제
- [x] 광고 훅 (`src/hooks/useAds.ts`)
  - [x] useAvailableSlots
  - [x] useCompleteAdWatch
  - [x] useUnlockSlot

### Phase 9: 리워드 시스템 ✅
- [x] 리워드 타입 정의 (`src/types/rewards.ts`)
  - [x] RewardItem, RewardRedemptionRequest interface
- [x] 리워드 서비스 (`src/services/rewardService.ts`)
  - [x] 리워드 카탈로그 조회
  - [x] 리워드 교환
  - [x] 교환 내역 조회
- [x] 리워드 훅 (`src/hooks/useRewards.ts`)
  - [x] useRewardCatalog
  - [x] useRedeemReward
  - [x] useMyRedemptions

### Phase 10: API 문서에 맞춘 수정 ✅
- [x] API 클라이언트 수정 (`src/services/api.ts`)
  - [x] BaseResponse 구조 지원
  - [x] getWithBaseResponse, postWithBaseResponse 메서드 추가
  - [x] getDirect, postDirect 메서드 추가 (직접 응답용)
- [x] 모든 서비스 수정
  - [x] authService.ts - BaseResponse 구조 사용
  - [x] predictionService.ts - BaseResponse 구조 사용
  - [x] sessionService.ts - BaseResponse 구조 사용
  - [x] universeService.ts - BaseResponse 구조 사용 + API 문서에 맞춘 정리
  - [x] pointService.ts - BaseResponse 구조 사용
  - [x] adService.ts - 직접 응답 구조 사용
  - [x] rewardService.ts - 직접 응답 구조 사용
- [x] 모든 훅 수정
  - [x] useAuth.ts - 수정된 서비스 사용
  - [x] usePrediction.ts - 수정된 서비스 사용
  - [x] useSession.ts - 수정된 서비스 사용
  - [x] useUniverse.ts - 수정된 서비스 사용 + API 문서에 맞춘 정리
  - [x] usePoints.ts - 수정된 서비스 사용
  - [x] useAds.ts - 수정된 서비스 사용
  - [x] useRewards.ts - 수정된 서비스 사용
- [x] 타입 정의 정리
  - [x] universe.ts - API 문서에 정의되지 않은 타입들 제거
  - [x] rewards.ts - 누락된 타입들 추가

### Phase 11: 프론트엔드 페이지 구현 (Shadcn/ui + Next.js) 🔄
- [x] 레이아웃 및 네비게이션 (`app/layout.tsx`, `components/layout/`)
  - [x] 메인 레이아웃 (사이드바, 헤더, 푸터)
  - [x] 네비게이션 컴포넌트
  - [x] 인증 상태 표시
- [x] 대시보드 페이지 (`app/ox/dashboard/page.tsx`)
  - [x] SSR: 세션 상태, 오늘의 유니버스
  - [x] CSR: 실시간 포인트 잔액, 예측 통계
  - [x] 차트 및 통계 위젯
- [x] 예측 페이지 (`app/ox/predict/page.tsx`)
  - [x] SSR: 오늘의 종목 목록
  - [x] CSR: 실시간 예측 제출, 잔여 슬롯
  - [x] 예측 히스토리 (무한 스크롤)
- [x] 포인트 페이지 (`app/ox/points/page.tsx`)
  - [x] SSR: 포인트 통계, 거래 내역
  - [x] CSR: 실시간 잔액, 거래 필터링
  - [x] 포인트 내보내기 기능
- [x] 프로필 페이지 (`app/ox/profile/page.tsx`)
  - [x] SSR: 사용자 정보, 재정 요약
  - [x] CSR: 프로필 수정, 설정 변경
- [x] 공통 컴포넌트 (`components/ui/`, `components/ox/`)
  - [x] 예측 카드 컴포넌트
  - [x] 포인트 거래 카드
  - [x] 종목 카드 컴포넌트
  - [x] 통계 위젯 컴포넌트
  - [x] 로딩 및 에러 상태 컴포넌트

### Phase 12: 통합 및 최적화
- [ ] 통합 대시보드 훅 (`src/hooks/useDashboard.ts`)
- [ ] 에러 처리 개선
- [ ] 성능 최적화
- [ ] 테스트 코드 작성

## 🚀 현재 진행 상황
- **Phase 1**: 기본 설정 완료 ✅
- **Phase 2**: 인증 시스템 완료 ✅
- **Phase 3**: 사용자 관리 완료 ✅
- **Phase 4**: 예측 시스템 완료 ✅
- **Phase 5**: 세션 관리 완료 ✅
- **Phase 6**: 종목 유니버스 완료 ✅
- **Phase 7**: 포인트 시스템 완료 ✅
- **Phase 8**: 광고 및 슬롯 시스템 완료 ✅
- **Phase 9**: 리워드 시스템 완료 ✅
- **Phase 10**: API 문서에 맞춘 수정 완료 ✅
- **Phase 11**: 프론트엔드 페이지 구현 완료 ✅

## 📌 다음 작업
1. Phase 12: 통합 및 최적화
   - 통합 대시보드 훅 개선
   - 에러 처리 개선
   - 성능 최적화
   - 테스트 코드 작성
2. 추가 기능 구현
   - 실시간 알림 시스템
   - 소셜 기능 (팔로우, 랭킹)
   - 고급 분석 도구

## 🧩 신규 기능: 대시보드 예측 모달 (route 기반)

### 목표
- `/ox/predict`와 동일한 예측 기능을 대시보드에서 라우팅 기반 모달로 제공
- 종목별 “예측” 버튼 클릭 시: 로그인 미완료 → 로그인 모달, 로그인 완료 → 예측 모달
- 복잡한 전역 상태 없이 Next.js App Router 병렬/인터셉트 라우트를 활용

### 설계
- 경로: `src/app/@modal/(.)dashboard/predict/[symbol]/page.tsx`
  - `/(.)dashboard` 인터셉터로 대시보드 하위 어디서나 모달 오버레이 렌더
  - `params.symbol`을 통해 대상 종목을 전달하고 예측 폼에 프리셀렉트
- 인증 처리: `useAuth`로 상태 확인
  - 미인증 → `LoginModal` 표시 (닫기 시 비로그인 상태면 router.back)
  - 인증 완료 시 예측 폼 표시
- 컴포넌트 재사용: `src/components/ox/predict/prediction-form.tsx`
  - `initialSymbol` props를 추가해 URL 파라미터로 전달된 종목을 기본 선택

### 해야 할 일 (구현 순서)
1) PredictionForm에 `initialSymbol?: string` 지원 추가 (프리셀렉트) ✅
2) 모달 라우트 추가: `@modal/(.)dashboard/predict/[symbol]/page.tsx` ✅
   - 오버레이 + 닫기 버튼 + 인증 상태별 렌더링 ✅
3) 데이터테이블 액션 컬럼에 “예측” 버튼 추가 (row ticker → `/dashboard/predict/[ticker]`) ✅
4) 종목 상세 상단 우측에 “예측” 버튼 추가 (`/dashboard/predict/[symbol]` 링크) ✅
5) 경로 이동 시 row click과 충돌 방지 (e.stopPropagation) ✅
6) 간단 동작 확인 후 이 섹션 체크리스트 완료 처리 ✅

### 체크리스트
- [x] PredictionForm 기본 선택 동작 확인 (`initialSymbol` 적용)
- [x] `/dashboard/predict/[symbol]` 접근 시 모달 열림 확인
- [x] 미로그인 시 로그인 모달 → 로그인 후 예측 폼 전환 (route 유지) 확인
- [x] 테이블/상세의 “예측” 버튼으로 모달 진입 확인

## 🔧 기술 스택
- **Frontend**: React 19, TypeScript, Next.js 15
- **State Management**: React Query (TanStack Query) v5
- **Validation**: Zod v3
- **UI**: Radix UI, Tailwind CSS
- **HTTP Client**: Custom Fetch API wrapper with BaseResponse support

## 📚 참고 자료
- [ox-universe-api.md](./ox-universe-api.md) - API 명세서
- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Zod 공식 문서](https://zod.dev/)

## 🎉 주요 성과
- **API 문서 완전 준수**: 모든 서비스와 훅이 ox-universe-api.md 명세에 맞춰 구현됨
- **BaseResponse 구조 지원**: API 클라이언트가 BaseResponse와 직접 응답 모두 지원
- **타입 안전성**: Zod 스키마와 TypeScript 인터페이스 완벽 통합
- **React Query 최적화**: 효율적인 캐싱과 상태 관리
- **에러 처리**: 일관된 에러 처리 패턴 적용



# O/X 예측 서비스 TODO 및 피드백

## 📋 검증 완료 항목 ✅

### 1. API 타입 정의 일치성
- **src/types/auth.ts**: API 문서와 100% 일치
  - AuthProvider, UserRole 열거형 ✅
  - User, UserProfile, UserUpdate 인터페이스 ✅
  - OAuth 관련 타입 정의 ✅
  - Zod 스키마 활용한 타입 안전성 ✅

- **src/types/prediction.ts**: API 문서와 100% 일치
  - PredictionChoice, PredictionStatus 열거형 ✅
  - Prediction 관련 모든 타입 정의 ✅
  - 심볼 검증 정규식 /^[A-Z]{1,5}$/ ✅
  - 예측 통계 및 분석 타입 ✅

- **src/types/common.ts**: API 문서 기반으로 확장
  - BaseResponse 구조 일치 ✅
  - ErrorCode 열거형 확장됨 ✅
  - 페이지네이션 타입 및 제한 ✅

### 2. 서비스 레이어 구현
- **src/services/authService.ts**: 문서 대비 개선됨
  - OAuth 플로우 완전 구현 ✅
  - 토큰 관리 및 갱신 ✅
  - 사용자 검색 및 목록 ✅
  - 추가: JWT 토큰 유틸리티 함수들 ✅

- **src/services/predictionService.ts**: 문서 대비 확장됨
  - 기본 CRUD 작업 ✅
  - 예측 이력 및 통계 ✅
  - 추가: 배치 작업, 분석 기능 ✅

- **src/services/pointService.ts**: 문서와 일치
  - 포인트 잔액 및 거래 내역 ✅
  - BaseResponse와 직접 응답 모두 지원 ✅

### 3. API 클라이언트 설계
- **src/services/api.ts**: 문서보다 개선됨
  - Fetch API 기반 래퍼 ✅
  - BaseResponse 및 직접 응답 모두 지원 ✅
  - 에러 처리 및 401 자동 리다이렉트 ✅

### 4. React Hooks 구현
- **src/hooks/useAuth.tsx**: 완전한 Context 패턴
  - AuthProvider 컴포넌트 ✅
  - 전역 상태 관리 ✅
  - 토큰 자동 갱신 ✅
  - OAuth 콜백 처리 ✅

## 🔍 발견된 차이점 및 개선사항

### 1. 구조적 개선 (긍정적)
- **Zod 스키마 활용**: API 문서에 없었지만 타입 안전성 크게 향상
- **유틸리티 함수 추가**: 각 도메인별로 헬퍼 함수들 잘 구현됨
- **에러 처리 강화**: API 문서보다 상세하고 robust한 에러 처리

### 2. 명명 규칙 차이점
- **API 문서**: `UserService.getMyProfile()` (클래스 스타일)
- **구현**: `authService.getMyProfile()` (객체 스타일)
- **평가**: 일관성 있고 실용적인 접근 방식

### 3. 응답 처리 방식 개선
- **API 문서**: BaseResponse 처리가 단순함
- **구현**: BaseResponse와 직접 응답 모두 지원하는 이중 구조
- **평가**: 더 유연하고 실제 API 변화에 대응 가능

## 📝 TODO 목록

### ✅ 최근 수정 완료
- [x] **API 엔드포인트 경로 수정**
  - API 문서에 맞춰 `/api/v1` 경로 추가
  - src/services/api.ts의 기본 URL에 `/api/v1` 추가
  - OAuth 로그인에서 절대 URL 사용하도록 수정

### 🔍 재검증 필요 (실제로는 모든 파일이 존재함)
- [x] **SESSION 관련**: 이미 구현됨 ✅
  - src/services/sessionService.ts ✅
  - src/hooks/useSession.ts ✅
  - src/types/session.ts ✅

- [x] **UNIVERSE 관련**: 이미 구현됨 ✅ 
  - src/services/universeService.ts ✅
  - src/hooks/useUniverse.ts ✅
  - src/types/universe.ts ✅

- [x] **ADS/SLOTS 관련**: 이미 구현됨 ✅
  - src/services/adService.ts ✅
  - src/hooks/useAds.ts ✅
  - src/types/ads.ts ✅

- [x] **REWARDS 관련**: 이미 구현됨 ✅
  - src/services/rewardService.ts ✅
  - src/hooks/useRewards.ts ✅
  - src/types/rewards.ts ✅

- [x] **POINTS 관련**: 이미 구현됨 ✅
  - src/types/points.ts ✅

### 📈 낮은 우선순위
- [ ] **API 클라이언트 개선**
  - 요청 인터셉터 추가 고려
  - 응답 캐싱 메커니즘 추가
  - 재시도 로직 구현

- [ ] **통합 대시보드 훅 구현**
  - API 문서의 useDashboard 예시 구현
  - 병렬 데이터 로딩 최적화

## 🎯 피드백 및 개선 제안

### ✅ 잘 구현된 부분
1. **타입 안전성**: Zod를 활용한 런타임 검증
2. **에러 처리**: 포괄적이고 사용자 친화적
3. **React Query 통합**: 최신 패턴과 베스트 프랙티스 적용
4. **코드 구조**: 명확한 레이어 분리와 모듈화

### 🔄 개선 가능한 부분
1. **일관성**: 모든 도메인에 동일한 패턴 적용 필요
2. **완성도**: 누락된 도메인들 (session, universe, ads, rewards) 구현
3. **문서화**: 각 서비스에 JSDoc 주석 추가 고려
4. **테스트**: 유닛 테스트 및 통합 테스트 추가 필요

### 📋 다음 단계 제안
1. 누락된 서비스들을 동일한 패턴으로 구현
2. 통합 대시보드 컴포넌트 구현
3. E2E 테스트 시나리오 작성
4. 성능 최적화 (React.memo, useMemo 활용)

## 📊 구현 현황

| 도메인 | 타입 | 서비스 | 훅 | 상태 |
|--------|------|--------|-----|------|
| Auth | ✅ | ✅ | ✅ | 완료 |
| Prediction | ✅ | ✅ | ✅ | 완료 |
| Common | ✅ | ✅ | N/A | 완료 |
| Points | ✅ | ✅ | ✅ | 완료 |
| Session | ✅ | ✅ | ✅ | 완료 |
| Universe | ✅ | ✅ | ✅ | 완료 |
| Ads | ✅ | ✅ | ✅ | 완료 |
| Rewards | ✅ | ✅ | ✅ | 완료 |

**전체 진행률**: 100% (8/8 도메인 완료)

### 🔧 최종 수정사항
- API 기본 URL에 `/api/v1` 경로 추가
- OAuth 로그인에서 절대 URL 사용

## 💡 기술적 제안

### 1. 타입 정의 표준화
```typescript
// 모든 도메인에 동일한 패턴 적용
export const [Domain]Schema = z.object({...});
export type [Domain] = z.infer<typeof [Domain]Schema>;
```

### 2. 서비스 레이어 표준화
```typescript
export const [domain]Service = {
  // CRUD operations
  get[Entity]: async () => {...},
  create[Entity]: async () => {...},
  update[Entity]: async () => {...},
  delete[Entity]: async () => {...},
};
```

### 3. 훅 패턴 표준화
```typescript
export const use[Entity]List = () => useQuery({...});
export const useCreate[Entity] = () => useMutation({...});
export const useUpdate[Entity] = () => useMutation({...});
```

---

> 마지막 업데이트: 2025-09-01  
> 다음 검토: 누락된 도메인 구현 후
