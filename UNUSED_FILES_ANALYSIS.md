# 메인 페이지에서 사용되지 않는 파일 분석 보고서

**분석 일자**: 2025-10-16  
**대상 페이지**: 메인 페이지 (`src/app/page.tsx`)

---

## 📊 요약

| 구분 | 전체 | 메인 사용 | 미사용 | 비율 |
|------|------|-----------|---------|------|
| **컴포넌트** | 155개 | 34개 | 121개 | 78% |
| **훅** | 30개 | 14개 | 16개 | 53% |
| **합계** | 185개 | 48개 | 137개 | 74% |

---

## 🎯 삭제 우선순위 개요

| 우선순위 | 설명 | 컴포넌트 | 훅 | 합계 |
|----------|------|----------|-----|------|
| 🔴 **HIGH** | 즉시 삭제 가능 (완전 미사용) | 11개 | 3개 | **14개** |
| 🟡 **MEDIUM** | 검토 후 삭제 가능 | 29개 | 6개 | **35개** |
| 🟢 **LOW** | 다른 페이지에서 사용 중 (보존) | 81개 | 7개 | **88개** |

---

## 🔴 HIGH 우선순위: 즉시 삭제 가능 (14개)

### 컴포넌트 (11개)

| # | 파일 경로 | 설명 | 비고 |
|---|-----------|------|------|
| 1 | `src/components/header.tsx` | 구 헤더 컴포넌트 | OxNavBar로 대체됨 |
| 2 | `src/components/navigation/MobileNavigation.tsx` | 구 모바일 네비게이션 | MobileTabBar로 대체됨 |
| 3 | `src/components/navigation/Sidebar.tsx` | 사이드바 | 미사용 |
| 4 | `src/components/news/MarketForcastCard.tsx` | Legacy 시장 예측 카드 | 신규 버전 존재 |
| 5 | `src/components/news/MarketNewsCarousel.tsx` | 뉴스 캐러셀 | 미사용 |
| 6 | `src/components/news/MarketNewsSection.tsx` | Legacy 뉴스 섹션 | 신규 버전 존재 |
| 7 | `src/components/auth/GlobalLoginModal.tsx` | 전역 로그인 모달 | 미사용 |
| 8 | `src/components/ticker/TickerBadgeRow.tsx` | 티커 배지 행 | 미사용 |
| 9 | `src/components/dashboard/MarketOverviewCard.tsx` | 시장 개요 카드 | 미사용 |
| 10 | `src/components/dashboard/MomentumSectorsCard.tsx` | 모멘텀 섹터 카드 | 미사용 |
| 11 | `src/components/atomic/atoms/IconBadge.tsx` | 아이콘 배지 | 미사용 |

### 훅 (3개)

| # | 파일 경로 | 설명 | 비고 |
|---|-----------|------|------|
| 1 | `src/hooks/useMarketIndices.ts` | 시장 지수 훅 | 완전 미사용 |
| 2 | `src/hooks/usePrice.ts` | 가격 훅 | 완전 미사용 |
| 3 | `src/hooks/useTickerLookup.ts` | 티커 조회 훅 | 완전 미사용 |

### 삭제 명령어

```bash
# HIGH 우선순위 - 즉시 삭제 가능
rm src/components/header.tsx
rm src/components/navigation/MobileNavigation.tsx
rm src/components/navigation/Sidebar.tsx
rm src/components/news/MarketForcastCard.tsx
rm src/components/news/MarketNewsCarousel.tsx
rm src/components/news/MarketNewsSection.tsx
rm src/components/auth/GlobalLoginModal.tsx
rm src/components/ticker/TickerBadgeRow.tsx
rm src/components/dashboard/MarketOverviewCard.tsx
rm src/components/dashboard/MomentumSectorsCard.tsx
rm src/components/atomic/atoms/IconBadge.tsx

rm src/hooks/useMarketIndices.ts
rm src/hooks/usePrice.ts
rm src/hooks/useTickerLookup.ts

# 빈 디렉토리 정리
rmdir src/components/navigation 2>/dev/null
rmdir src/components/news 2>/dev/null
rmdir src/components/ticker 2>/dev/null
```

---

## 🟡 MEDIUM 우선순위: 검토 후 삭제 (35개)

### OX Dashboard 위젯 (메인 페이지 미사용) - 10개

**설명**: 대시보드 페이지에 존재하지만 메인 페이지에서는 렌더링되지 않는 시장 데이터 위젯들

| 파일 | 설명 | 검토 사항 |
|------|------|----------|
| `ox/dashboard/fundamental/FundamentalAnalysisCard.tsx` | 펀더멘털 분석 카드 | 향후 활성화 계획 확인 |
| `ox/dashboard/fundamental/FundamentalAnalysisSection.tsx` | 펀더멘털 분석 섹션 | 향후 활성화 계획 확인 |
| `ox/dashboard/fundamental/RatingBadge.tsx` | 레이팅 배지 | FundamentalAnalysisCard 의존 |
| `ox/dashboard/market/AnalystPriceTargetsWidget.tsx` | 애널리스트 목표가 위젯 | 향후 활성화 계획 확인 |
| `ox/dashboard/market/ETFFlowsWidget.tsx` | ETF 흐름 위젯 | 향후 활성화 계획 확인 |
| `ox/dashboard/market/InsiderTrendsWidget.tsx` | 내부자 트렌드 위젯 | 향후 활성화 계획 확인 |
| `ox/dashboard/market/LiquidityWidget.tsx` | 유동성 위젯 | 향후 활성화 계획 확인 |
| `ox/dashboard/market/MarketBreadthWidget.tsx` | 시장 폭 위젯 | 향후 활성화 계획 확인 |
| `ox/dashboard/market/MarketDataDashboard.tsx` | 시장 데이터 대시보드 | 향후 활성화 계획 확인 |
| `ox/dashboard/market/MarketOverviewCards.tsx` | 시장 개요 카드 | 향후 활성화 계획 확인 |

### OX Engagement - 2개

| 파일 | 설명 | 검토 사항 |
|------|------|----------|
| `ox/engagement/AdWatchHistoryList.tsx` | 광고 시청 히스토리 | 광고 기능 사용 여부 확인 |
| `ox/engagement/CooldownStatusCard.tsx` | 쿨다운 상태 카드 | 쿨다운 기능 사용 여부 확인 |

### Signal 컴포넌트 - 3개

| 파일 | 설명 | 검토 사항 |
|------|------|----------|
| `signal/MahaneyAnalysisCard.tsx` | Mahaney 분석 카드 | 실제 사용처 확인 |
| `signal/AiModelSelect.tsx` | AI 모델 선택 | 실제 사용처 확인 |
| `signal/DateSelector.tsx` | 날짜 선택 (기본) | SelectDateSelector와 중복 |

### 기타 컴포넌트 - 2개

| 파일 | 설명 | 검토 사항 |
|------|------|----------|
| `stocks/PopularStocksList.tsx` | 인기 주식 리스트 | 실제 사용처 확인 |
| `atomic/molecules/PredictActionBar.tsx` | 예측 액션바 | 실제 사용처 확인 |

### UI 컴포넌트 (Shadcn) - 12개

**설명**: Shadcn UI 라이브러리 컴포넌트. 필요 시 재생성 가능하므로 삭제해도 무방

| 파일 | 설명 |
|------|------|
| `ui/avatar.tsx` | 아바타 |
| `ui/chart.tsx` | 차트 |
| `ui/checkbox.tsx` | 체크박스 |
| `ui/command-palette.tsx` | 커맨드 팔레트 |
| `ui/date-navigation.tsx` | 날짜 네비게이션 |
| `ui/dropdown-menu.tsx` | 드롭다운 메뉴 |
| `ui/label.tsx` | 라벨 |
| `ui/pagination.tsx` | 페이지네이션 |
| `ui/radio-group.tsx` | 라디오 그룹 |
| `ui/scroll-area.tsx` | 스크롤 영역 |
| `ui/separator.tsx` | 구분선 |
| `ui/switch.tsx` | 스위치 |

### 훅 (6개)

| 파일 | 설명 | 검토 사항 |
|------|------|----------|
| `useAds.ts` | 광고 훅 | ox/engagement에서 사용 가능성 |
| `useCooldownStatus.ts` | 쿨다운 상태 훅 | ox/engagement에서 사용 가능성 |
| `useFundamentalAnalysis.ts` | 펀더멘털 분석 훅 | FundamentalAnalysisSection 의존 |
| `useMahaneyAnalysis.ts` | Mahaney 분석 훅 | MahaneyAnalysisCard 의존 |
| `useMarketData.ts` | 시장 데이터 훅 | market widgets 의존 |
| `usePopularTickers.ts` | 인기 티커 훅 | PopularStocksList 의존 |

---

## 🟢 LOW 우선순위: 다른 페이지에서 사용 중 (보존 권장)

### Legacy 페이지 컴포넌트 - 13개

**사용 위치**: `/legacy/dashboard`, `/legacy/etf`, `/legacy/research`

<details>
<summary>상세 목록 보기</summary>

#### Dashboard SSR 컴포넌트 (8개)
- `dashboard/ssr/MarketForecastSection.tsx` - /legacy/dashboard
- `dashboard/ssr/MarketNewsSection.tsx` - /legacy/dashboard
- `dashboard/ssr/RecommendationAiSection.tsx` - /legacy/dashboard
- `dashboard/ssr/RecommendationNewsSection.tsx` - /legacy/dashboard
- `dashboard/ssr/SignalsSection.tsx` - /legacy/dashboard
- `dashboard/ssr/WeeklyActionCountSection.tsx` - /legacy/dashboard
- `dashboard/ssr/WeeklyPriceMovementSection.tsx` - /legacy/dashboard
- `dashboard/ssr/MarketAnalysisSection.tsx` - (사용처 불명)

#### Legacy Dashboard 기타 (5개)
- `dashboard/HeroSection.tsx` - /legacy/dashboard
- `dashboard/DashboardFooter.tsx` - /legacy/dashboard
- `dashboard/DashboardLoading.tsx` - /legacy/dashboard
- `dashboard/ETFPortfolioCard.tsx` - /legacy/etf
- `research/ResearchAnalysis.tsx` - /legacy/research

</details>

**삭제 조건**: Legacy 페이지 전체 폐기 시 함께 삭제

---

### OX 기능별 컴포넌트 - 53개

#### /ox/home (4개)
- `ox/home/HomeTopStrip.tsx`
- `ox/home/MobileTabBar.tsx` (여러 페이지에서 공통 사용)
- `ox/home/MyInvestmentCard.tsx`
- `ox/home/RealtimeRankingCard.tsx`

#### /ox/profile (6개)
- `ox/profile/profile-page-client.tsx`
- `ox/profile/profile-page-server.tsx`
- `ox/profile/user-profile-card.tsx`
- `ox/profile/user-stats-card.tsx`
- `ox/profile/profile-edit-form.tsx`
- `ox/profile/account-settings-form.tsx`

#### /ox/points (5개)
- `ox/points/points-page-client.tsx`
- `ox/points/points-page-server.tsx`
- `ox/points/points-balance-card.tsx`
- `ox/points/points-stats-card.tsx`
- `ox/points/points-ledger-list.tsx`

#### /ox/rewards (6개)
- `ox/rewards/RewardCatalogGrid.tsx`
- `ox/rewards/RewardStatusChip.tsx`
- `ox/rewards/RewardItemCard.tsx`
- `ox/rewards/RewardCheckoutDialog.tsx`
- `ox/rewards/RewardDetailSheet.tsx`
- `ox/rewards/RewardHistoryTable.tsx`

#### /ox/predict (6개)
- `ox/predict/prediction-form.tsx`
- `ox/predict/prediction-history.tsx`
- `ox/predict/universe-list.tsx`
- `ox/predict/PredictionButton.tsx`
- `ox/predict/PredictionCancelButton.tsx`
- `ox/predict/PredictionModal.tsx`

#### /ox/news (7개)
- `ox/news/NewsListMobile.tsx`
- `ox/news/NewsDetailSheet.tsx`
- `ox/news/parts/NewsItemsList.tsx`
- `ox/news/parts/NewsItemRow.tsx`
- `ox/news/parts/SearchAndBadges.tsx`
- `ox/news/parts/RecBadge.tsx`
- `ox/news/parts/FiltersBar.tsx`

#### /ox/layout (3개)
- `ox/layout/OxNavBar.tsx` - 전역 네비게이션
- `ox/layout/FloatingInfo.tsx` - 전역 레이아웃
- `ox/layout/FundamentalSearchModal.tsx` - OxNavBar 의존

#### /ox/dashboard news (3개)
- `ox/dashboard/news/shared/ForecastBadge.tsx` - MarketForecastCard 의존
- `ox/dashboard/news/shared/ForecastDetailDrawer.tsx` - MarketForecastCard 의존
- `ox/dashboard/news/shared/RecommendationBadge.tsx` - MarketNewsCard 의존

---

### Signal Detail 페이지 컴포넌트 - 10개

**사용 위치**: `/detail/[symbol]`, modal

- `signal/SignalDetailPage.tsx`
- `signal/SignalDetailView.tsx`
- `signal/SignalDetailContent.tsx`
- `signal/WeeklyPriceMovementCard.tsx`
- `signal/WeeklyActionCountCard.tsx`
- `signal/RecommendationByAICard.tsx`
- `signal/RecommendationCard.tsx`
- `signal/DateSelectorWrapper.tsx` - /legacy/dashboard
- `signal/SelectDateSelector.tsx` - /legacy/etf, /legacy/research
- `signal/SummaryTabsCard.tsx` - /legacy/dashboard

---

### 전역 레이아웃/프로바이더 - 5개

**사용 위치**: 전역 레이아웃 (`/app/layout.tsx`, `/ox/layout.tsx`)

- `ConditionalLayout.tsx`
- `auth/GlobalAuthModal.tsx`
- `auth/login-modal.tsx` - `/login` 페이지
- `providers/ReactQueryProvider.tsx`
- `theme-provider.tsx`
- `atomic/molecules/SectionHeader.tsx` - /ox/predict, /ox/news

---

### 훅 - 7개

| 파일 | 사용 위치 |
|------|----------|
| `useDashboardFilters.ts` | SignalDetailContent |
| `useETFPortfolio.ts` | ETFPortfolioCard |
| `useResearch.ts` | ResearchAnalysis |
| `useRewards.ts` | rewards 페이지 |
| `useTickerSearch.ts` | FundamentalSearchModal |
| `useUniverse.ts` | universe-list |
| `useUser.ts` | profile, points, rewards |

---

## 📋 삭제 실행 플랜

### Phase 1: 즉시 삭제 (HIGH 우선순위)

**예상 효과**: 14개 파일 삭제, 코드베이스 약 7% 감소

```bash
# 1단계: HIGH 우선순위 파일 삭제
./cleanup-high-priority.sh

# 검증
git status
npm run build
```

### Phase 2: 검토 후 삭제 (MEDIUM 우선순위)

**실행 전 검토 사항**:
1. OX Dashboard 위젯 향후 활성화 계획 확인
2. Engagement 기능 (광고, 쿨다운) 사용 여부 확인
3. Shadcn UI 컴포넌트 향후 사용 계획 확인

**예상 효과**: 최대 35개 파일 삭제, 코드베이스 약 19% 감소

### Phase 3: Legacy 페이지 폐기 (선택적)

**조건**: Legacy 페이지 (/legacy/*) 전체 폐기 결정 시

**예상 효과**: 추가 20개 파일 삭제, 코드베이스 약 11% 감소

```bash
# Legacy 페이지 및 관련 컴포넌트 삭제
rm -rf src/app/legacy
rm -rf src/components/dashboard/ssr
rm src/components/dashboard/HeroSection.tsx
rm src/components/dashboard/DashboardFooter.tsx
rm src/components/dashboard/DashboardLoading.tsx
rm src/components/dashboard/ETFPortfolioCard.tsx
rm src/components/research/ResearchAnalysis.tsx
rm src/hooks/useResearch.ts
rm src/hooks/useETFPortfolio.ts
```

---

## 🎯 최종 권장 사항

### 즉시 실행
✅ **HIGH 우선순위 14개 파일 삭제**
- 명확하게 미사용
- 삭제로 인한 리스크 없음
- 코드베이스 정리 효과

### 단기 검토 후 실행
⚠️ **MEDIUM 우선순위 컴포넌트 검토**
- OX Dashboard 위젯: 향후 활성화 계획 확인 필요
- Shadcn UI 컴포넌트: 삭제해도 재생성 가능

### 장기 전략적 결정
💡 **Legacy 페이지 폐기 검토**
- Legacy 페이지 사용 통계 분석
- 신규 페이지로의 완전 이전 확인
- 약 20개 컴포넌트 추가 삭제 가능

---

## 📊 예상 효과

| 단계 | 삭제 파일 수 | 코드베이스 감소 | 누적 효과 |
|------|-------------|----------------|-----------|
| Phase 1 (HIGH) | 14개 | 7% | 7% |
| Phase 2 (MEDIUM) | 35개 | 19% | 26% |
| Phase 3 (Legacy) | 20개 | 11% | **37%** |

**최종 효과**: 전체 185개 파일 중 69개 삭제 가능 → **37% 코드베이스 감소**

---

*분석 기준: 메인 페이지 (`src/app/page.tsx`) 의존성 트리*  
*생성일: 2025-10-16*
