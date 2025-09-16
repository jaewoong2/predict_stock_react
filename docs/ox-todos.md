# OX Universe 컴포넌트 재개발 계획

## 📋 프로젝트 개요

components.md 문서를 기반으로 src/app/ox 관련 컴포넌트들을 재개발하여 아키텍처와 요구사항에 맞게 구현

## 🏗️ 현재 구조 분석

### 기존 페이지 구조
- `/ox/home` - 모바일 홈페이지
- `/ox/news` - 뉴스 리스트 (모바일)
- `/ox/dashboard` - 대시보드
- `/ox/predict` - 예측 페이지
- `/ox/profile` - 프로필 페이지  
- `/ox/points` - 포인트 관리
- `/ox/rewards` - 리워드 카탈로그
- `/ox/rewards/history` - 리워드 교환 내역
- `/ox/admin` - 관리자 페이지

### 기존 컴포넌트 구조
- `ox/home/` - HomeTopStrip, MobileTabBar, MyInvestmentCard, RealtimeRankingCard
- `ox/news/` - NewsListMobile
- `ox/rewards/` - 리워드 관련 컴포넌트들 (완성도 높음)
- `ox/engagement/` - CooldownStatusCard, AdWatchHistoryList
- `ox/points/` - 포인트 관련 컴포넌트들
- `ox/profile/` - 프로필 관련 컴포넌트들
- `ox/predict/` - 예측 관련 컴포넌트들
- `ox/dashboard/` - 대시보드 컴포넌트들

## 📝 재개발 우선순위 및 단계

### Phase 1: Foundation & Core Features (Week 1)
- [ ] **1.1 인증 시스템 구현**
  - [ ] AuthModal 컴포넌트 (`components/auth/auth-modal.tsx`)
  - [ ] useAuth 훅 (`hooks/useAuth.tsx`)
  - [ ] OAuth 플로우 구현 (Google, Kakao)
  - [ ] 토큰 관리 및 401 에러 처리

- [ ] **1.2 API 통신 레이어 구축**
  - [ ] API Client 구현 (`services/api.ts`)
  - [ ] React Query 설정 (`lib/react-query.ts`)
  - [ ] 에러 처리 및 재시도 로직
  - [ ] TypeScript 타입 정의 완성

- [ ] **1.3 기본 레이아웃 및 네비게이션**
  - [ ] 공통 레이아웃 업데이트 (`app/ox/layout.tsx`)
  - [ ] 상단바 마켓 인덱스 스니펫
  - [ ] FloatingInfo 컴포넌트 (마켓 상태, 슬롯 정보)

### Phase 2: 예측 시스템 (Week 2)
- [ ] **2.1 Universe 데이터 표시**
  - [ ] SignalDataTable 업데이트 (100개 종목, 가상 스크롤)
  - [ ] 실시간 가격 업데이트 로직
  - [ ] 종목 검색 및 필터링 기능

- [ ] **2.2 예측 제출 시스템**
  - [ ] PredictionButton 컴포넌트 (Optimistic UI)
  - [ ] 예측 상태 관리 (Context API)
  - [ ] 슬롯 체크 및 쿨다운 로직
  - [ ] 예측 취소 기능 (5분 제한)

- [ ] **2.3 예측 히스토리**
  - [ ] 예측 이력 페이지 (`predict/page.tsx`)
  - [ ] 무한스크롤 구현
  - [ ] 상태 필터 (CORRECT/INCORRECT/VOID)

### Phase 3: 포인트 & 리워드 시스템 (Week 3)
- [ ] **3.1 포인트 시스템**
  - [ ] 포인트 잔액 표시 및 실시간 업데이트
  - [ ] 포인트 원장 (ledger) 컴포넌트 개선
  - [ ] 포인트 내보내기 기능 (API 연동 대기)

- [ ] **3.2 리워드 시스템 완성**
  - [ ] 리워드 카탈로그 그리드 개선
  - [ ] 리워드 상세 시트 및 체크아웃 다이얼로그
  - [ ] 교환 히스토리 테이블 완성
  - [ ] 상태 배지 시스템 (pending→completed)

- [ ] **3.3 슬롯 & 광고 시스템**
  - [ ] 슬롯 관리 시스템
  - [ ] 쿨다운 타이머 컴포넌트
  - [ ] 광고 시청 히스토리
  - [ ] 광고 SDK 연동 준비

### Phase 4: 모바일 & 뉴스 (Week 4)
- [ ] **4.1 모바일 홈페이지 완성**
  - [ ] HomeTopStrip 지수 데이터 연동
  - [ ] MyInvestmentCard 실제 데이터 연동
  - [ ] RealtimeRankingCard ETF 제외 로직
  - [ ] MobileTabBar 네비게이션 완성

- [ ] **4.2 뉴스 시스템**
  - [ ] NewsListMobile 필터 기능 (Buy/Hold/Sell)
  - [ ] 뉴스 상세 시트 구현
  - [ ] 실시간 뉴스 업데이트

### Phase 5: 관리자 & 고급 기능 (Week 5)
- [ ] **5.1 관리자 페이지**
  - [ ] 사용자 관리 탭
  - [ ] 리워드 관리 (생성/수정/재고 조정)
  - [ ] 포인트 관리 및 조정 기능

- [ ] **5.2 성능 최적화**
  - [ ] 가상 스크롤 최적화
  - [ ] React Query 캐싱 전략
  - [ ] 번들 크기 최적화
  - [ ] 이미지 최적화

- [ ] **5.3 에러 처리 & 모니터링**
  - [ ] 에러 바운더리 구현
  - [ ] 에러 추적 시스템
  - [ ] 분석 이벤트 추가
  - [ ] 사용자 피드백 시스템

## 🎯 핵심 구현 원칙

### 1. 아키텍처 준수
- **State Management**: Context API + React Query
- **Type Safety**: TypeScript + Zod validation  
- **Styling**: TailwindCSS + Shadcn/ui
- **API Client**: Custom fetch wrapper with retry

### 2. 사용자 경험
- **Optimistic UI**: 예측 제출시 즉시 반영
- **실시간 업데이트**: 가격, 슬롯, 포인트
- **반응형 디자인**: Mobile-first approach
- **접근성**: SR 텍스트, 키보드 네비게이션

### 3. 성능 최적화
- **가상 스크롤**: 100개 종목 리스트
- **캐싱 전략**: React Query staleTime 최적화
- **코드 분할**: 라우트별 동적 import
- **이미지 최적화**: Next/Image 활용

### 4. 보안 & 품질
- **인증 보안**: JWT + HttpOnly Cookie
- **데이터 검증**: Zod 스키마 활용
- **에러 처리**: 계층별 에러 관리
- **테스트**: 단위 테스트 + E2E 테스트

## 📊 기존 시스템 분석 결과

### ✅ 완성도가 높은 컴포넌트들
- **인증 시스템**: useAuth 훅, AuthModal, OAuth 플로우 완성도 90%
- **API 통신 레이어**: oxApi, 에러 처리, 토큰 관리 완성도 95%
- **리워드 시스템**: 카탈로그, 교환, 히스토리 완성도 85%
- **포인트 시스템**: 잔액, 원장, 내보내기 완성도 80%
- **홈 컴포넌트**: HomeTopStrip, MyInvestmentCard 완성도 75%

### 🔧 개선이 필요한 영역
- **예측 시스템**: Optimistic UI, 슬롯 관리 로직 미완성
- **실시간 데이터**: 가격 업데이트, 마켓 인덱스 연동 필요
- **뉴스 시스템**: 필터링, 상세 보기 기능 부족
- **관리자 기능**: 기본 틀만 있고 실제 기능 미구현
- **성능 최적화**: 가상 스크롤, 캐싱 전략 개선 필요

### 📋 재정의된 우선순위

#### Phase 1: 핵심 기능 완성 (Week 1)
- **1.1 예측 시스템 완성**
  - Optimistic UI 구현
  - 슬롯 관리 및 쿨다운 로직
  - 예측 취소 기능
- **1.2 실시간 데이터 연동**
  - 마켓 인덱스 API 연동
  - 가격 업데이트 최적화
- **1.3 사용자 경험 개선**
  - 로딩 상태 개선
  - 에러 처리 강화

#### Phase 2: 고급 기능 구현 (Week 2)
- **2.1 뉴스 시스템 완성**
  - 필터링 기능 구현
  - 뉴스 상세 시트
- **2.2 성능 최적화**
  - 가상 스크롤 구현
  - React Query 캐싱 최적화
- **2.3 관리자 기능**
  - 리워드 관리 완성
  - 사용자 관리 기능

## 📊 진행 상황 추적

### ✅ 완료된 작업 (Phase 1 핵심 기능)
- ✅ 프로젝트 구조 분석 및 기존 시스템 분석 완료
- ✅ 개발 계획 수립 및 우선순위 재정의
- ✅ **FloatingInfo 컴포넌트 구현** - 마켓 상태, 슬롯 정보, 쿨다운 안내
- ✅ **PredictionButton 컴포넌트 개선** - Optimistic UI, 인증 체크, 상태 표시
- ✅ **PredictionCancelButton 구현** - 5분 제한, 실시간 타이머
- ✅ **SignalDataTable PredictionButton 연동** - 상승/하락 버튼, 예측 상태 표시
- ✅ **마켓 인덱스 시스템 구현** - 서비스, 훅, HomeTopStrip 실시간 연동
- ✅ **GlobalAuthModal 레이아웃 추가** - 전역 인증 처리

### ✅ 완료된 작업 (Toss 스타일 디자인 개선)
- ✅ **Toss 스타일 공통 컴포넌트 제작** - TossCard, TossButton, TossStatCard
- ✅ **홈페이지 (ox/home) Toss 스타일 개선** - 그라데이션 배경, 투자 현황 카드, 실시간 랭킹
- ✅ **예측 페이지 (ox/predict) Toss 스타일 개선** - 중앙 헤더, 커스텀 탭, 스켈레톤 컴포넌트
- ✅ **포인트 페이지 (ox/points) Toss 스타일 개선** - 포인트 잔액 카드, 거래내역, 필터 탭
- ✅ **리워드 페이지 (ox/rewards) Toss 스타일 개선** - 그리드 레이아웃, 상품 카드, 로딩 상태
- ✅ **프로필 페이지 (ox/profile) Toss 스타일 개선** - 계정 관리 탭, 프로필 카드
- ✅ **뉴스 페이지 (ox/news) Toss 스타일 개선** - 필터링, 뉴스 카드, 추천 배지

### 🎯 주요 구현 성과

#### 1. 예측 시스템 개선
- **Optimistic UI**: 예측 제출시 즉시 UI 반영 → 서버 확인 → 실패시 롤백
- **인증 통합**: 비로그인시 자동 AuthModal 표시
- **상태 관리**: 로딩, 성공, 실패 상태별 버튼 스타일링
- **예측 취소**: 5분 제한, 실시간 카운트다운 타이머

#### 2. 사용자 경험 개선
- **FloatingInfo**: 우하단 고정 위치, 마켓 상태/슬롯 정보 실시간 표시
- **실시간 인덱스**: HomeTopStrip에서 나스닥/다우/S&P 500 실시간 데이터
- **로딩 상태**: 스켈레톤 UI, 에러 처리, 폴백 데이터

#### 3. Toss 스타일 디자인 시스템
- **일관된 디자인**: 모든 OX 페이지에 Toss 스타일 적용
- **모바일 최적화**: Mobile-first 디자인, 터치 친화적 인터랙션
- **공통 컴포넌트**: TossCard, TossButton, TossStatCard로 디자인 통일성 확보
- **시각적 개선**: 그라데이션 배경, glass morphism, 현대적인 카드 디자인
- **사용자 경험**: 로딩 스켈레톤, 빈 상태, 에러 상태 개선

#### 4. 아키텍처 품질
- **React Native 호환성**: 문서 요구사항에 따라 크로스 플랫폼 고려
- **Type Safety**: TypeScript + Zod validation 적극 활용
- **성능 최적화**: React Query 캐싱, 1분 간격 자동 갱신
- **에러 처리**: 계층별 에러 관리, 사용자 친화적 메시지

### 🔄 남은 작업 (추후 Phase 2)
- ⏳ **슬롯 및 쿨다운 시스템** - 광고 시청, 자동 충전 로직
- ⏳ **Universe 데이터 연동** - SignalDataTable과 실제 주식 데이터 연결
- ⏳ **관리자 기능** - 리워드 관리, 사용자 관리 실제 구현
- ⏳ **성능 최적화** - 가상 스크롤, 번들 크기 최적화

## 🔧 개발 환경 설정

### 필수 의존성 확인
- [ ] Next.js 14+ (App Router)
- [ ] TypeScript 설정
- [ ] TailwindCSS + Shadcn/ui
- [ ] React Query 설정
- [ ] Zod validation
- [ ] date-fns (KST timezone)

### 개발 도구
- [ ] ESLint/Prettier 설정
- [ ] 타입 체크 명령어 확인
- [ ] 테스트 환경 설정

---

**마지막 업데이트**: 2025-09-11  
**담당자**: Claude Code  
**상태**: Phase 1 완료, Toss 스타일 디자인 개선 완료






## 🔌 페이지별 API 매핑 (엔드포인트/요청/응답) <2025:09:15>

각 페이지에서 사용할 수 있는 백엔드 엔드포인트를 정리했습니다. 이미 구현된 것은 바로 연동하고, 미구현 항목은 아래 TODO에 작업 항목으로 추가했습니다. 응답 포맷은 기본적으로 `BaseResponse` 래핑을 따르며, 일부 `/points/*`와 `/ads/*`는 직접 스키마를 반환합니다. 상세 타입/예시는 `docs/ox-universe-api` 참고.

### /ox/home (모바일 홈)
- Market status: `GET /api/v1/session/today`
  - Response data: { session, market_status: { current_date,current_time_kst,is_trading_day,message,next_trading_day? } }
- Can predict now: `GET /api/v1/session/can-predict?trading_day=YYYY-MM-DD`
  - Response data: { can_predict, trading_day, current_time }
- Available slots summary: `GET /api/v1/ads/available-slots`
  - Direct response: { current_max_predictions, predictions_made, available_predictions, can_unlock_by_ad, can_unlock_by_cooldown, today_ad_unlocks, today_cooldown_unlocks }
- MyInvestmentCard (요약): `GET /api/v1/users/me/financial-summary`
  - Response data: { user_id,current_balance,points_earned_today,can_make_predictions,summary_date }

### /ox/predict (예측 페이지)
- Universe today with price snapshot: `GET /api/v1/universe/today/with-prices`
  - Response data: { universe: { trading_day, items:[{ symbol, seq, current_price, previous_close, change_percent, market_status, last_price_updated }] } }
- Poll universe prices (snapshot DB): `GET /api/v1/prices/universe/{trading_day}`
  - Response data: { universe_prices: { trading_day, items:[{ symbol, close_price, previous_close, change_percent, market_status, last_price_updated }] } }
- Submit prediction: `POST /api/v1/predictions/{symbol}` body { choice: "UP"|"DOWN" }
  - Response data: { prediction: { id,user_id,symbol,choice,status,trading_day,created_at,points_awarded? } }
- Update prediction: `PUT /api/v1/predictions/{prediction_id}` body { choice }
- Cancel prediction: `DELETE /api/v1/predictions/{prediction_id}` (5분 제한, 서버강제)
- Remaining slots: `GET /api/v1/predictions/remaining/{trading_day}` → { remaining_predictions }
- Cooldown status: `GET /api/v1/cooldown/status` → { has_active_cooldown, remaining_seconds, unlock_at? }
- Unlock via Ad: `POST /api/v1/ads/watch-complete` body { ad_id?,duration? }
  - Direct response: { success,message,slots_unlocked,current_max_predictions }
- Unlock via Cooldown: `POST /api/v1/ads/unlock-slot`
  - Direct response: { success,message,current_max_predictions,unlocked_slots,method_used }

### /ox/profile (프로필)
- My profile: `GET /api/v1/users/me` → data { id,email,nickname,auth_provider,created_at,last_login_at?,is_active }
- Update profile: `PUT /api/v1/users/me` body { nickname?,email? }
- Profile + points: `GET /api/v1/users/me/profile-with-points`
  - Response data: { user_profile:{...}, points_balance, last_updated }

### /ox/points (포인트)
- Balance: `GET /api/v1/points/balance` (direct)
  - { balance }
- Ledger: `GET /api/v1/points/ledger?limit&offset` (direct)
  - { balance, entries:[...], total_count, has_next }
- Earned today: `GET /api/v1/points/earned/{trading_day}` (direct)
  - { user_id,trading_day,points_earned }
- Integrity (my): `GET /api/v1/points/integrity/my` (direct)
  - { status, ... }
- Affordability (편의): `GET /api/v1/users/me/can-afford/{amount}`
  - Response data: { amount,can_afford,current_balance,shortfall }

### /ox/rewards (카탈로그/상세/교환)
- Catalog: `GET /api/v1/rewards/catalog?available_only=true`
  - Response: catalog list (see docs/frontend-api.md)
- Reward by SKU: `GET /api/v1/rewards/catalog/{sku}`
- Redeem: `POST /api/v1/rewards/redeem` body { sku,quantity?,meta? }
- My redemption history: `GET /api/v1/rewards/my-redemptions?limit&offset`

### /ox/dashboard (대시보드)
- Prediction stats (day): `GET /api/v1/predictions/stats/{trading_day}`
  - Response data: { total_predictions, up_predictions, down_predictions, ... }
- User stats (admin): `GET /api/v1/users/stats/overview`
- Settlement summary (admin): `GET /api/v1/admin/settlement/summary/{trading_day}`

### /ox/admin (관리자)
- Prices admin: `POST /api/v1/prices/collect-eod/{trading_day}` / `GET /api/v1/prices/admin/validate-settlement/{trading_day}`
- Prediction admin: lock/pending/bulk status under `/api/v1/predictions/admin/*`
- Settlement admin: `/api/v1/admin/settlement/*` (settle-day, summary, retry, manual-settle)
- Rewards admin: `/api/v1/rewards/admin/*` (items, stock, delete, stats)
- Points admin: `/api/v1/points/admin/*` (add, deduct, adjust, stats)
- Error monitor: `/api/v1/admin/errors/*` (recent, stats, summaries, trending)
- Schema check/create: `/api/v1/admin/db/schema/*`

## ⚙️ 이번 커밋에 포함된 백엔드 변경사항

- New: 사용자 집계 엔드포인트 추가
  - `GET /api/v1/users/me/profile-with-points`
  - `GET /api/v1/users/me/financial-summary`
  - `GET /api/v1/users/me/can-afford/{amount}`
  - Files: `myapi/routers/user_router.py`, `myapi/services/user_service.py` (기존 메서드 활용)
