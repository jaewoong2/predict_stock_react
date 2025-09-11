# OX Universe - NextJS Frontend Architecture & Components Guide

## 📊 서비스 개요

### 핵심 비즈니스 로직
- **매일 100개 미국 주식 종목에 대한 O/X 예측 게임**
- **포인트 기반 리워드 시스템**
- **광고/쿨다운 기반 슬롯 관리**

### 주요 사용자 플로우 (상세)
- 로그인: OAuth 시작 → 콜백 파싱 → 토큰 저장 → 프로필 로드
- 예측: 종목 선택 → 로그인/슬롯 체크 → 제출(낙관적 UI) → 서버 확정
- 포인트: 적립/차감 → 잔액 반영 → 원장(ledger) 기록 → 내보내기
- 리워드: 카탈로그 열람 → 가용성/잔액 확인 → 교환 요청 → 진행 상태 추적
- 세션: 장 마감 후 정산 → 통계/히스토리 업데이트

---

## 🏗️ 프로젝트 아키텍처

### 기술 스택 결정 사항
- **Framework**: Next.js 14+ (App Router)
- **State Management**: Context API + React Query
- **Type Safety**: TypeScript + Zod validation
- **Styling**: TailwindCSS + Shadcn/ui
- **API Client**: Native Fetch + Custom wrapper
- **Date/Time**: date-fns with KST timezone handling

### 현재 프로젝트 구조(정렬)
```
src/
├── app/                         # App Router
│   └── ox/
│       ├── dashboard/
│       ├── predict/
│       ├── profile/
│       ├── points/
│       ├── rewards/
│       │   └── history/
│       └── admin/
├── components/
│   ├── auth/
│   ├── dashboard/
│   │   └── ssr/
│   ├── ox/
│   │   ├── predict/
│   │   ├── profile/
│   │   ├── points/
│   │   ├── rewards/
│   │   └── engagement/
│   └── signal/
├── hooks/
├── services/
├── types/
└── lib/
```

---

## 🔐 인증 시스템 설계

### OAuth 플로우 아키텍처
```
1. Frontend → Backend: GET /auth/oauth/{provider}/authorize
2. Backend → OAuth Provider → User Authorization
3. OAuth Provider → Backend Callback with code
4. Backend → Frontend: Redirect with JWT tokens
5. Frontend: Store tokens & user info in Context
```

### 토큰 관리 전략
- **Access Token**: Memory (Context) 저장
- **Refresh Token**: HttpOnly Cookie or Secure Storage
- **자동 갱신**: 401 응답시 Refresh Token으로 재발급
- **세션 유지**: React Query의 staleTime 활용

### 인증 관련 주요 결정사항
- 401 에러 발생시 자동으로 AuthModal 오픈
- 예측 버튼 클릭시 미인증 사용자는 AuthModal 트리거
- 신규 가입자 1000포인트는 백엔드에서 자동 처리

### 구현 연결점
- 훅: `src/hooks/useAuth.tsx` (`AuthProvider`, `useAuth`, `useOAuthLogin`, `useOAuthCallback`, `useTokenRefresh`)
- 서비스: `src/services/authService.ts` (토큰 갱신/로그아웃/OAuth 시작)
- 쿠키: `@/lib/cookies`와 `TOKEN_COOKIE_KEY` 기반 저장/삭제
- 401 처리: `src/services/api.ts`에서 쿠키 삭제 후 `?login=1` 파라미터로 모달 유도

---

## 📡 API 통신 레이어

### Fetch Client 설계 원칙
1. **Type-safe API calls**: Zod schema validation
2. **Automatic retry**: Exponential backoff
3. **Error handling**: Centralized error processing
4. **Request/Response interceptors**: Token injection, 401 handling

### React Query 설정
```typescript
// 주요 설정 포인트
{
  staleTime: {
    universe: 30_000,      // 30초
    predictions: 10_000,   // 10초
    points: 60_000,        // 1분
    session: 300_000,      // 5분
  },
  refetchInterval: {
    universe: 60_000,      // 1분마다 자동 갱신
    session: null,         // 수동 갱신만
  },
  retry: {
    count: 3,
    delay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  }
}
```

### API 엔드포인트 매핑 전략
- **Resource-based routing**: `/predictions`, `/universe`, `/slots`
- **Action-based endpoints**: `/predictions/{symbol}`, `/ads/watch-complete`
- **Nested resources**: `/users/me/points/balance`

---

## 🎯 핵심 기능 구현 가이드

### 1. 예측 시스템 (Prediction)

#### 상태 관리 구조
```
PredictionContext
├── todayPredictions: Map<symbol, Prediction>
├── availableSlots: number
├── cooldownTimer: Date | null
└── sessionStatus: 'OPEN' | 'CLOSED'
```

#### 주요 고려사항
- **Optimistic Update**: 예측 제출시 즉시 UI 업데이트 → 실패시 롤백
- **슬롯 동기화**: 예측 제출/취소시 available_predictions 실시간 반영
- **취소 정책**: PENDING 상태에서 5분 이내만 취소 가능
- **가격 스냅샷**: 예측 시점의 현재가를 함께 저장

#### 사용자 플로우 (예측)
1) 사용자가 종목 `UP/DOWN` 버튼 클릭
2) 비로그인 → `AuthModal` 표시, 로그인 성공시 계속
3) 남은 슬롯 확인 → 부족 시 광고/쿨다운 안내
4) 낙관적 업데이트로 UI 표시(회색→결과 대기), 버튼 비활성화
5) 서버 제출 성공 → React Query 무효화 후 서버 상태 반영
6) 서버 제출 실패 → 낙관 상태 롤백, 오류 토스트 표시

#### 코드 연결점
- 훅: `src/hooks/usePrediction.ts` (`useSubmitPrediction`, `useCancelPrediction`, `usePredictionHistory`, `useRemainingPredictions`)
- 서비스: `src/services/predictionService.ts`
- 테이블/버튼: `src/components/signal/*`, `src/components/signal/SignalDataTable.tsx`, `src/components/signal/SignalDetail*`

API 연결(ox-universe-api.md):
- POST `/predictions/{symbol}` → 제출
- GET `/predictions/remaining/{trading_day}` → 남은 예측 수
- GET `/predictions/day/{trading_day}` → 오늘 예측 목록
- GET `/predictions/history` → 이력 페이지네이션

### 2. 슬롯 & 쿨다운 시스템

#### 슬롯 정책
- **기본 슬롯**: 3개/일
- **광고 슬롯**: 최대 7개 추가 (총 10개)
- **쿨다운**: 슬롯 < 3일때 5분마다 자동 +1
- **일일 리셋**: 전날 광고 슬롯 수만큼 다음날 시작 슬롯 증가

#### 구현 전략
```
1. 슬롯 상태는 서버를 Single Source of Truth로 관리
2. 클라이언트는 낙관적 업데이트 후 서버 응답으로 보정
3. 쿨다운 타이머는 클라이언트 타이머 + 서버 검증
4. 광고 시청 완료는 서버 콜백으로만 처리
```

#### 사용자 플로우 (슬롯/광고)
1) 슬롯 부족 시 `FloatingInfo` 또는 예측 버튼 옆 배지로 안내
2) 광고 보기 선택 → 광고 SDK 완료 콜백 수신
3) 서버에 `watch-complete` 이벤트 보고 → 슬롯 +1
4) React Query `remaining`/`balance` 무효화로 즉시 반영

### 3. 실시간 가격 업데이트

#### 스냅샷 기반 아키텍처
- **Production**: DB 스냅샷에서만 읽기 (yfinance 호출 없음)
- **Refresh**: 백엔드 배치/크론에서 처리 (프런트 트리거 불필요)
- **Fallback**: `SNAPSHOT_NOT_AVAILABLE` 시 서버 상태 메시지 노출만 (수동 호출 없음)

#### 가격 표시 전략
```
현재가: current_price
변동률: ((current - previous_close) / previous_close) * 100
색상: 상승(빨강 #e74c3c), 하락(파랑 #3498db)
```

### 4. 정산 시스템

#### 정산 플로우
```
23:59 KST 예측 마감
↓
06:00 KST EOD 데이터 수집
↓
예측가격 vs EOD 종가 비교
↓
CORRECT(+50pt) / INCORRECT(0pt) / VOID(환불)
```

#### 정산 결과 표시
- 정산 완료 알림 (Push/In-app)
- 예측 히스토리에 결과 표시
- 포인트 변동 내역 자동 업데이트

---

API 연결(세션/마켓):
- GET `/session/today` → 오늘 세션/마켓 상태(`useTodaySession`)
- GET `/session/can-predict?trading_day=...` → 예측 가능 여부(`useCanPredict`)
- GET `/session/next-trading-day` → 다음 거래일 안내
- GET `/session/schedule/*` → 오픈/마감 시간 노출

## 🎁 리워드 교환 플로우 (상세)

### 도메인 모델 요약
- 카탈로그: `RewardItem` 목록, `points_cost`, `is_available`, 재고(`stock_quantity`)
- 요청: `RewardRedemptionRequest`(수량/주소/연락처/메모)
- 상태: `RedemptionStatus` = `pending | approved | rejected | completed | cancelled`
- 이력: `RewardRedemptionHistory`, 통계: `UserRewardStats`

### 관련 코드
- 타입: `src/types/rewards.ts`
- 서비스: `src/services/rewardService.ts` (`getRewardCatalog`, `getRewardBySku`, `redeemReward`, `getMyRedemptions`)
- 훅: `src/hooks/useRewards.ts` (`useRewardCatalog`, `useRewardBySku`, `useMyRedemptions`, `useRedeemReward`, `useRewardExchange`)
- 포인트 훅: `src/hooks/usePoints.ts` (`usePointsBalance`, 원장 조회)

### 사용자 플로우 (교환)
1) 사용자: 보상 탭 진입 → 카탈로그 조회(`useRewardCatalog(true)`)
2) 아이템 선택 → 상세(설명/가격/남은 수량/1인 제한) 표시
3) 잔액 조회(`usePointsBalance`)와 가용성 확인 (`is_available`, `stock_quantity`)
4) 물리상품일 경우 배송정보 입력(주소/연락처/요청사항)
5) 교환 확인 모달 → `useRedeemReward().mutateAsync(request)` 호출
6) 성공 시:
   - 쿼리 무효화: 카탈로그, 내 교환 내역, 포인트 잔액
   - 성공 토스트/리시트 제공, 상태 `pending`
7) 실패 시:
   - `INSUFFICIENT_POINTS` → 충전/적립 경로 안내
   - `REWARD_OUT_OF_STOCK` → 재고 알림/대체 보상 추천
   - `REWARD_REDEMPTION_FAILED` → 재시도/문의 안내

라우팅:
- 카탈로그: `/ox/rewards`
- 교환 내역: `/ox/rewards/history`

### UI 컴포넌트 제안
- `RewardCatalogGrid`(빈/로딩/에러 상태 포함)
- `RewardItemCard`(가격/뱃지/재고/1인 제한)
- `RewardDetailSheet`(상세설명 + 교환 버튼)
- `RewardCheckoutDialog`(배송정보/수량/예상 차감 포인트/확인)
- `RewardHistoryTable`(상태 배지: pending/approved/…; 페이지네이션)
- `RewardStatusChip`(색상 일관성: pending=gray, approved=blue, rejected=red, completed=green, cancelled=slate)

### 상태 동기화 규칙
- 교환 성공 후 반드시 아래 쿼리 무효화
  - `REWARDS_KEYS.catalog(true)`
  - `REWARDS_KEYS.myRedemptions()`
  - `POINTS_KEYS.balance()`
- 장바구니 개념이 없다면 낙관적 업데이트는 지양(포인트/재고 불일치 방지)

### 에지 케이스
- 재고 동시성: 서버 최종 판단. 프론트는 안내만.
- 1인 제한 초과: 서버 에러 메시지 그대로 노출 + 가이드
- 취소 기능: `pending` 상태에서만 가능(서버 지원 시). UI는 `Cancel` 액션 보호.
- 디지털 보상: 코드/링크 발급은 `completed` 시점에 표시(일회성 마스킹, 복사 버튼)

### 예시 핸들러
```ts
const { data: balance } = usePointsBalance();
const { exchangeReward, isLoading, error } = useRewardExchange();

const onRedeem = async () => {
  if (!item?.is_available) return toast.error('현재 교환 불가한 리워드입니다.');
  if ((balance?.balance ?? 0) < item.points_cost * qty) return toast.error('포인트가 부족합니다.');
  await exchangeReward({ reward_id: item.id, quantity: qty, delivery_address, contact_phone, additional_notes });
  toast.success('교환 요청이 접수되었습니다. 진행상태를 확인하세요.');
};
```

## 🖼️ 화면/내비게이션 구성 (웹 우선)

### 상단 공통
- 상단바: 마켓 인덱스 스니펫(NASDAQ, 등락%), 탭(Home | Discover | News)
- 플로팅: `FloatingInfo`(마켓 상태, 남은 슬롯, 쿨다운 툴팁)

### 홈/디스커버
- 카테고리 토글: US
- 실시간/랭킹 정렬 탭: 거래대금/인기/관심목록
- 리스트 항목: 랭킹, 티커/아이콘, 거래대금, 현재가, 전일대비 등락(▲/▼, 색상)

### 종목 예측 테이블
- 컬럼: 종목명 | 티커 | 현재가 | 1D 등락% | 오늘 예측 버튼
- 정렬/검색/가상 스크롤, 스켈레톤 로딩

### 사용자 페이지
- 예측 히스토리: 무한스크롤, 상태 필터(CORRECT/INCORRECT/VOID)
- 포인트 히스토리(원장): 입/출금, 잔액, 기간 필터, 내보내기
- 쿨다운 상태: `src/components/ox/engagement/CooldownStatusCard.tsx`
- 광고 시청 히스토리: `src/components/ox/engagement/AdWatchHistoryList.tsx`
- 리워드 히스토리: 상태 배지(pending→completed), `src/components/ox/rewards/RewardHistoryTable.tsx`

### 모바일 홈(`/ox/home`)
- 상단 스트립: 지수 배지 + 탭 네비(`src/components/ox/home/HomeTopStrip.tsx`)
-  └ 주의: 지수 값은 현재 플레이스홀더. 별도 Index Service 연동 예정
- 내 투자 카드: 포인트/남은 예측 수(`getRemainingPredictions` 사용, `src/components/ox/home/MyInvestmentCard.tsx`)
- 실시간 랭킹: 거래량/인기/관심 탭(ETF 제외), 인기 리스트 재사용(`src/components/ox/home/RealtimeRankingCard.tsx`)
- 하단 탭바: 홈/발견/예측/포인트/프로필 (`src/components/ox/home/MobileTabBar.tsx`)

### 모바일 뉴스(`/ox/news`)
- 상단 스트립: `HomeTopStrip` 재사용, activeTab="news"
- 뉴스 리스트: `src/components/ox/news/NewsListMobile.tsx`
  - 데이터: `useMarketNewsSummary({ news_type: 'market', news_date })`
  - 필터: 전체/Buy/Hold/Sell 토글
  - 항목: 티커 이니셜 원형 아이콘, 헤드라인, 요약, 상대시간, 추천 배지

### 관리자 페이지(초안)
- 경로: `src/app/ox/admin/page.tsx` (탭 기반)
- 사용자 관리: 목록/검색(초안), 권한/정지(추가 예정)
- 리워드 관리: 카탈로그 확인(비가용 포함), 생성/수정/재고 조정(추가 예정)
- 포인트 관리: 조정/원장 열람(추가 예정)

## 🎨 UI/UX 설계 원칙

### 디자인 시스템
- **Color Semantics**: 상승(Red), 하락(Blue), 중립(Gray)
- **Typography**: 숫자는 tabular-nums, 한글/영문 혼용 고려
- **Responsive**: Mobile-first (375px~), 태블릿/데스크톱 대응

### 핵심 컴포넌트 구조

#### AuthModal
- 예측 시도시 자동 오픈
- OAuth 3사 + Magic Link 옵션
- 401 에러시 자동 트리거

#### FloatingInfo
- 마켓 상태 (OPEN/CLOSED)
- 남은 예측 수(`useRemainingPredictions(tradingDay)`)와 쿨다운 안내
- 오늘의 예측 수/제출 현황

#### Points/Rewards UI
- 포인트 카드: 현재 잔액, 오늘 적립
- 원장 리스트: `src/components/ox/points/points-ledger-list.tsx` 무한스크롤/필터
- 내보내기 모달: (선택) `src/components/ox/points/points-export-modal.tsx` — API 연동 보류
- 리워드 카탈로그: `src/components/ox/rewards/RewardCatalogGrid.tsx`
- 리워드 상세/체크아웃: `src/components/ox/rewards/RewardDetailSheet.tsx`, `src/components/ox/rewards/RewardCheckoutDialog.tsx`
- 리워드 히스토리: `src/components/ox/rewards/RewardHistoryTable.tsx`, 상태 배지 `RewardStatusChip.tsx`
- 쿨다운/광고 내역: `src/components/ox/engagement/CooldownStatusCard.tsx`, `src/components/ox/engagement/AdWatchHistoryList.tsx`

#### StockTable
- 가상 스크롤 (100개 종목)
- 실시간 가격 업데이트
- 예측 상태 표시 (색상/아이콘)
- 정렬/필터링 기능

#### PredictionButton
- 로그인 체크 → 슬롯 체크 → 예측 제출
- Optimistic UI 업데이트
- 로딩/성공/실패 상태 표시

---

## ⚡ 성능 최적화 전략

### 렌더링 최적화
- **React Query 캐싱**: staleTime/cacheTime 세밀 조정
- **Code Splitting**: 라우트별 동적 import
- **Image Optimization**: Next/Image 활용
- **Virtual Scrolling**: 100개 종목 리스트

### 번들 최적화
- **Tree Shaking**: ES6 모듈 활용
- **Dynamic Imports**: 무거운 컴포넌트 lazy loading
- **Font Optimization**: next/font 활용

### SEO & 메타데이터
```typescript
// 페이지별 메타데이터 설정
export const metadata = {
  title: 'OX Universe - 미국 주식 예측 게임',
  description: '매일 100개 종목 예측하고 포인트 받자!',
  openGraph: { ... },
  twitter: { ... }
}
```

---

## 🔍 모니터링 & 에러 처리

### 에러 처리 계층
1. **API Error**: ApiError class로 통일
2. **Validation Error**: Zod 에러 처리
3. **Network Error**: Retry with exponential backoff
4. **Business Error**: 사용자 친화적 메시지 표시

### 주요 에러 케이스
- `SNAPSHOT_NOT_AVAILABLE`: 가격 스냅샷 미존재 → refresh 트리거
- `NO_SLOTS_AVAILABLE`: 슬롯 부족 → 광고/쿨다운 안내
- `PREDICTION_CLOSED`: 세션 마감 → 다음 세션 시간 안내
- `INSUFFICIENT_POINTS`: 포인트 부족 → 충전 안내
- `REWARD_OUT_OF_STOCK`: 재고 부족 → 다른 리워드 추천
- `REWARD_REDEMPTION_FAILED`: 일시 오류 → 재시도/문의 안내

### 분석 이벤트
```typescript
// 주요 추적 이벤트
- page_view: 페이지 조회
- prediction_submit: 예측 제출
- ad_watch_complete: 광고 시청 완료
- reward_redeem: 리워드 교환
- session_duration: 세션 체류 시간

// 추가 제안
- reward_checkout_open: 교환 다이얼로그 열림
- reward_redeem_success: 교환 성공
- reward_redeem_fail: 교환 실패 (error_code 포함)
- points_export: 포인트 내보내기 수행
```

---

## 🚀 배포 & 운영

### 환경 변수 관리
```env
# API
NEXT_PUBLIC_API_URL=https://api.ox-universe.com
NEXT_PUBLIC_WS_URL=wss://ws.ox-universe.com

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_KAKAO_CLIENT_ID=

# Features
NEXT_PUBLIC_ENABLE_ADS=true
NEXT_PUBLIC_MAX_SLOTS=10
```

### 배포 체크리스트
- [ ] TypeScript 빌드 에러 체크
- [ ] ESLint/Prettier 검증
- [ ] 환경 변수 설정
- [ ] API 엔드포인트 확인
- [ ] OAuth redirect URI 설정
- [ ] 타임존 설정 (KST)
- [ ] 에러 트래킹 설정

---

## 📝 개발 순서 권장사항

### Phase 1: Foundation (Week 1)
1. Next.js 프로젝트 초기 설정
2. TypeScript 타입 정의
3. API Client 구축
4. Auth Context 구현

### Phase 2: Core Features (Week 2-3)
1. OAuth 로그인 플로우
2. Universe 목록 표시
3. 예측 제출/취소
4. 슬롯 관리 시스템

### Phase 3: Advanced Features (Week 4)
1. 쿨다운 타이머
2. 광고 연동
3. 포인트/리워드 시스템
4. 정산 결과 표시

### Phase 4: Polish (Week 5)
1. 성능 최적화
2. 에러 처리 강화
3. 애니메이션/트랜지션
4. 반응형 디자인 완성

---

## 📚 컴포넌트/훅/서비스 맵 (참조)

- 인증
  - 훅: `src/hooks/useAuth.tsx`
  - 모달: `src/components/auth/login-modal.tsx`
- 예측/시그널
  - 훅: `src/hooks/usePrediction.ts`
  - 테이블/상세: `src/components/signal/SignalDataTable.tsx`, `src/components/signal/SignalDetailView.tsx`
- 대시보드(SSR 포함)
  - `src/components/dashboard/ssr/*` (시장 분석/예측/뉴스/포캐스트/주간 지표)
- 포인트
  - 훅/서비스: `src/hooks/usePoints.ts`, `src/services/pointService.ts`
  - 원장/내보내기: `src/components/ox/points/points-ledger-list.tsx`, `src/components/ox/points/points-export-modal.tsx`
- 리워드
  - 훅/서비스: `src/hooks/useRewards.ts`, `src/services/rewardService.ts`
  - UI: `src/components/ox/rewards/RewardCatalogGrid.tsx`, `RewardItemCard.tsx`, `RewardDetailSheet.tsx`, `RewardCheckoutDialog.tsx`, `RewardHistoryTable.tsx`, `RewardStatusChip.tsx`
  - 페이지: `src/app/ox/rewards/page.tsx`, `src/app/ox/rewards/history/page.tsx`
- 광고/슬롯
  - 훅/서비스: `src/hooks/useAds.ts`, `src/services/adService.ts`
  - UI: `src/components/ox/engagement/CooldownStatusCard.tsx`, `src/components/ox/engagement/AdWatchHistoryList.tsx`
- 관리자
  - 페이지: `src/app/ox/admin/page.tsx` (탭: 리워드/사용자/포인트)
- 모바일 홈
  - 페이지: `src/app/ox/home/page.tsx`
  - UI: `src/components/ox/home/HomeTopStrip.tsx`, `MyInvestmentCard.tsx`, `RealtimeRankingCard.tsx`, `MobileTabBar.tsx`

---

## ✅ 추가 제안 (코드와 문서 반영 사항)

- 접근성: 상태 배지/아이콘에 SR 텍스트 추가(예: “승인 대기”)
- 시간/통화: 모든 서버 시간은 UTC ISO, 렌더시 로컬 포맷팅(`Intl`)
- 낙관적 업데이트 범위 축소: 포인트/재고와 같이 정합성 민감 영역은 서버 확인 후 반영
- 페이지네이션 규약 통일: `limit/offset`은 `types/common.ts` 제한 준수, 무한스크롤 `getNextPageParam` 통일
- 에러 메시지 국제화 준비: 서버 에러코드→클라이언트 메시지 매핑 테이블 도입
- Admin 플로우 초안: 리워드 생성/수정/재고 조정/노출 ON/OFF, 유저별 제한 관리(추후 페이지 구성)

---

## 🧩 TODO: Services/Hooks To Implement (based on current services)

- Market Indices
  - Add: `src/services/indexService.ts`, `src/hooks/useMarketIndices.ts`
  - Types: `src/types/indices.ts` (e.g., `{ name, price, changePct }`)
  - UI: `HomeTopStrip`의 지수 배지에 연결(현재 placeholder)
  - API: GET `/market/indices` 또는 provider proxy 확정 필요

- Watchlist(관심목록) 서버 동기화
  - 현상: `useFavoriteTickers.ts` 로컬 저장만 사용
  - Add: `src/services/watchlistService.ts`, hooks `useWatchlist`, `useToggleWatchlist`
  - API: GET `/users/me/watchlist`, PUT/DELETE `/users/me/watchlist/{symbol}`
  - UI: RealtimeRankingCard “관심” 탭, 시그널 목록 즐겨찾기 토글 연동

- News Detail Sheet
  - Add: `src/components/ox/news/NewsDetailSheet.tsx` (모바일 시트/드로어)
  - Optional API: GET `/news/{id}` (리스트에 `detail_description`가 없을 경우)

- Rewards Admin API
  - Add: `src/services/rewardAdminService.ts`, hooks `useRewardAdminList`, `useUpsertReward`, `useToggleReward`
  - API: `/admin/rewards` CRUD + visibility/stock/limit
  - UI: `src/app/ox/admin/page.tsx` 리워드 탭 연결

- Points Admin API
  - Add: `src/services/pointsAdminService.ts`, hook `useAdjustPoints`
  - API: POST `/admin/points/adjust`, GET `/admin/points/ledger`
  - UI: 관리자 포인트 탭에서 조정/원장 조회

- Points Export API — 보류(미필요)
  - 현상: `points-export-modal.tsx` 더미 유지, API 연동은 추후 필요 시 진행

- Ads Provider Bridge (SDK 연동)
  - 현상: `adService.completeAdWatch` 서버 연동만 구현
  - Add: `src/lib/ads/provider.ts` + `useAdProvider`(init/show/콜백)
  - Ensure: 서버 검증 토큰/HMAC 포함하여 `/ads/watch-complete` 호출

- Universe Refresh Prices — 보류(프런트 미구현)
  - 결정: 백엔드 배치에서 수행. 프런트 트리거/버튼 불필요

- Auth: Apple + Magic Link
  - 현상: OAuth 시작은 Google/Kakao만
  - Add: `authService.startOAuthLogin('apple')`
  - Add: Magic Link `authService.requestMagicLink(email)`, `authService.verifyMagicLink(token)`
  - API: `/auth/oauth/apple/authorize`, `/auth/magic-link/request`, `/auth/magic-link/verify`
  - UI: `LoginModal`에 버튼 추가 및 플로우 연결

- Notifications (정산/승인/시스템 알림)
  - Add: `src/services/notificationService.ts`, hooks `useNotifications`, `useMarkAsRead`, `useSubscribePush`
  - API: GET `/notifications`, POST `/notifications/read`, POST `/notifications/subscribe`
  - UI: `components/layout/header.tsx` 종 아이콘 연동

- Analytics (이벤트 추적)
  - Add: `src/lib/analytics.ts` (provider-agnostic)
  - Track: `page_view`, `prediction_submit`, `ad_watch_complete`, `reward_redeem`, `points_export`, `news_filter_click`
  - Hook: `useAnalytics()`로 화면/버튼에 주입

- ETF 탭 데이터 소스 — 보류(미필요)
  - 결정: 초기 범위에서 제외. 필요 시 별도 서비스/훅 설계
