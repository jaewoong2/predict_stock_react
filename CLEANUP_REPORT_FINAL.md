# 메인 페이지 클린업 최종 보고서

**분석 일자**: 2025-10-16
**대상**: 메인 페이지 + @modal 상세 페이지

---

## 📊 분석 범위

### 포함된 페이지
1. **메인 페이지**: `/src/app/page.tsx` (DashboardPageClient)
2. **모달 상세**: `/src/app/@modal/(.)detail/[symbol]/page.tsx` (SignalDetailPage)
3. **일반 상세**: `/src/app/detail/[symbol]/page.tsx` (SignalDetailPage)

### 분석 결과
- **사용되는 파일**: 158개
- **전체 프로젝트 파일**: 185개
- **미사용 파일**: 27개
- **안전 삭제 가능**: 3개

---

## ✅ 안전하게 삭제된 파일 (3개)

### 컴포넌트 (2개)
| 파일 | 설명 | 사유 |
|------|------|------|
| `src/components/navigation/Sidebar.tsx` | 사이드바 컴포넌트 | 프로젝트 전체에서 미사용 |
| `src/components/auth/GlobalLoginModal.tsx` | 전역 로그인 모달 | 프로젝트 전체에서 미사용 |

### 훅 (1개)
| 파일 | 설명 | 사유 |
|------|------|------|
| `src/hooks/useMarketIndices.ts` | 시장 지수 훅 | 프로젝트 전체에서 미사용 |

---

## ⚠️ 보존된 파일 (이유)

### 처음 삭제했다가 복원한 파일들
| 파일 | 복원 이유 |
|------|----------|
| `header.tsx` | ConditionalLayout에서 사용 (전역 레이아웃) |
| `IconBadge.tsx` | SectionHeader에서 사용 (ox/news, ox/predict) |
| `TickerBadgeRow.tsx` | ox/news/SearchAndBadges에서 사용 |
| `useTickerLookup.ts` | FundamentalSearchModal에서 사용 |
| `usePrice.ts` | PredictionModal에서 사용 |
| `MobileNavigation.tsx` | header.tsx에서 사용 |

### Legacy 페이지 전용 파일들 (향후 처리 예정)
| 파일 | 사용 위치 |
|------|----------|
| `MarketOverviewCard.tsx` | /legacy/dashboard (MarketAnalysisSection) |
| `MomentumSectorsCard.tsx` | /legacy/dashboard (MarketAnalysisSection) |
| `MarketForcastCard.tsx` | /legacy/dashboard (MarketForecastSection) |
| `MarketNewsCarousel.tsx` | /legacy/dashboard (MarketNewsSection) |
| `MarketNewsSection.tsx` | /legacy/dashboard |

---

## 📈 클린업 효과

| 항목 | 수치 |
|------|------|
| 삭제된 파일 수 | 3개 |
| 코드베이스 감소 | ~2% |
| 빌드 에러 | 0개 |
| 타입 에러 | 0개 |

---

## 🎯 다음 단계 권장사항

### Phase 1: Legacy 페이지 폐기 (선택적)
Legacy 페이지(`/legacy/*`)를 더 이상 사용하지 않는다면:

**삭제 가능한 추가 파일 (~20개)**:
```bash
# Legacy 페이지 삭제
rm -rf src/app/legacy

# Legacy 전용 컴포넌트 삭제
rm -rf src/components/dashboard/ssr
rm src/components/dashboard/HeroSection.tsx
rm src/components/dashboard/DashboardFooter.tsx
rm src/components/dashboard/DashboardLoading.tsx
rm src/components/dashboard/MarketOverviewCard.tsx
rm src/components/dashboard/MomentumSectorsCard.tsx
rm src/components/dashboard/ETFPortfolioCard.tsx
rm src/components/research/ResearchAnalysis.tsx
rm src/components/news/MarketForcastCard.tsx
rm src/components/news/MarketNewsCarousel.tsx
rm src/components/news/MarketNewsSection.tsx

# Legacy 전용 훅 삭제
rm src/hooks/useResearch.ts
rm src/hooks/useETFPortfolio.ts
```

**예상 효과**: 추가 11% 코드베이스 감소

### Phase 2: OX 미사용 위젯 검토 (선택적)
OX Dashboard 위젯 중 실제 사용하지 않는 것들:
- `ox/dashboard/fundamental/*` (3개)
- `ox/dashboard/market/*` 위젯들 (7개)
- `ox/engagement/*` (2개)

**검토 필요**: 향후 활성화 계획이 있는지 확인 후 삭제

### Phase 3: Shadcn UI 미사용 컴포넌트 정리
메인+모달에서 사용하지 않는 UI 컴포넌트들:
- `ui/avatar.tsx`
- `ui/chart.tsx`
- `ui/checkbox.tsx`
- `ui/command-palette.tsx`
- 등 12개

**참고**: 필요 시 재생성 가능하므로 삭제해도 무방

---

## 🔍 상세 의존성 분석

### 메인 페이지 의존성 트리
```
/app/page.tsx
└── DashboardPageClient
    ├── dashboard-stats (usePoints, useSession, usePrediction)
    ├── TrendingPredictionsContainer
    │   └── TrendingPredictionsWidget
    ├── OxNewsSection
    │   └── MarketNewsCard
    ├── DashboardClient
    │   ├── SignalListWrapper
    │   └── SignalDataTable
    └── CompactMarketChanges
```

### 모달 페이지 의존성 트리
```
/app/@modal/(.)detail/[symbol]/page.tsx
└── SignalDetailPage
    └── SignalDetailContent
        ├── useSignalDataByNameAndDate
        ├── useMarketNewsSummary
        ├── useWeeklyPriceMovement
        ├── useWeeklyActionCount
        ├── useDashboardFilters
        ├── MarketNewsCarousel
        ├── AiModelSelect
        └── MahaneyAnalysisCard
```

---

## ✨ 결론

### 현재 클린업
- **안전하게 3개 파일 삭제** 완료
- 빌드 에러 없음 확인
- 메인 기능 영향 없음

### 향후 계획
1. **Legacy 페이지 폐기 검토**: 추가 20개 파일 삭제 가능
2. **OX 위젯 검토**: 향후 계획 확인 후 처리
3. **UI 컴포넌트 정리**: 필요 시 추가 정리

---

*생성일: 2025-10-16*
*분석 도구: Claude Code with SuperClaude Framework*
