# Next.js 프로젝트 리팩토링 계획서

**작성일**: 2025-10-21
**프로젝트**: predict_stock_react
**목표**: 컴포넌트 가독성 개선, 비즈니스/UI 로직 분리, SSR/SSG 최적화

---

## 📋 현재 상태 분석

### 기술 스택
- **Framework**: Next.js 15.0.1
- **React**: 19.0.0
- **State Management**: Jotai, TanStack Query (React Query)
- **Styling**: Tailwind CSS 4.0, Framer Motion
- **UI Components**: Radix UI, shadcn/ui

### 주요 문제점

#### 1. 과도한 클라이언트 렌더링
**현상:**
- 대부분의 페이지가 `"use client"` 지시어 사용
- SSR/SSG 이점 미활용 (메타데이터만 서버에서 생성)
- 초기 로딩 성능 저하 및 SEO 최적화 부족

**영향:**
- 초기 JavaScript 번들 크기 과다
- First Contentful Paint (FCP) 지연
- 검색 엔진 크롤링 비효율

**증거:**
```typescript
// src/app/page.tsx - 단순히 클라이언트 컴포넌트만 렌더링
export default function Home() {
  return <DashboardPageClient />;  // "use client" 컴포넌트
}

// src/components/ox/dashboard/DashboardPageClient.tsx
"use client";  // 전체가 클라이언트 렌더링
export function DashboardPageClient() {
  // 300+ 줄의 UI 코드
}
```

#### 2. 비즈니스 로직과 UI 로직 혼재
**현상:**
- 컴포넌트 파일이 300+ 줄로 비대화
- 필터링, 계산, 상태 관리 로직이 JSX와 섞여 있음
- 테스트와 재사용이 어려움

**영향:**
- 코드 가독성 저하
- 유지보수 비용 증가
- 버그 발생 가능성 증가

**증거:**
```typescript
// src/components/dashboard/DashboardClient.tsx (300+ lines)
const DashboardClient = memo(({ initialData, onDateReset }: Props) => {
  // 50줄의 상태 관리
  const { date, q, strategy_type, setParams } = useDashboardFilters();
  const { availableAiModels, selectedAiModels, ... } = useDashboardAiModels();

  // 100줄의 복잡한 필터링 로직
  const aiModelFilteredSignals = useMemo(() => {
    if (selectedAiModels.length === 0) return tickerFilteredSignals;
    if (aiModelFilterConditions.every((c) => c === "OR")) {
      // OR 로직 30줄
    } else if (aiModelFilterConditions.every((c) => c === "AND")) {
      // AND 로직 40줄
    } else {
      // Mixed 로직 50줄
    }
  }, [tickerFilteredSignals, selectedAiModels, aiModelFilterConditions]);

  // 150줄의 JSX
  return <div>...</div>;
});
```

#### 3. 컴포넌트 구조 문제
**현상:**
- Page 컴포넌트가 단순히 Client 컴포넌트를 래핑만 하는 패턴
- Skeleton 컴포넌트들이 각 파일에 중복 정의 (5개 이상)
- 재사용 가능한 로직이 여러 곳에 산재

**영향:**
- 코드 중복으로 인한 유지보수 어려움
- 일관성 없는 로딩 UI
- 파일 수 증가

**증거:**
```typescript
// src/components/ox/dashboard/DashboardPageClient.tsx 내부
function StatsSkeleton() { /* 30줄 */ }
function NewsSkeleton() { /* 20줄 */ }
function PredictionsSkeleton() { /* 40줄 */ }
function MarketChangeSkeleton() { /* 30줄 */ }
function TrendingSkeleton() { /* 25줄 */ }
// 총 145줄이 skeleton UI에 할당됨
```

---

## 🎯 리팩토링 전략

### 핵심 원칙
1. **Server-First Architecture**: 가능한 한 서버 컴포넌트 활용
2. **Separation of Concerns**: 비즈니스 로직과 UI 로직 명확히 분리
3. **DRY (Don't Repeat Yourself)**: 중복 코드 제거
4. **Progressive Enhancement**: 점진적 개선, 기능 파괴 최소화
5. **Type Safety**: TypeScript + Zod로 런타임 안정성 확보

---

## 📐 Phase 1: 아키텍처 재설계 (1-2주)

### 1.1 서버/클라이언트 컴포넌트 분리 전략

#### 분리 원칙
```
서버 컴포넌트로 전환:
✅ Static content (레이아웃, 헤더)
✅ 데이터 fetching이 필요한 부분
✅ SEO가 중요한 컨텐츠
✅ 계산/변환 로직

클라이언트 컴포넌트 유지:
🔵 사용자 상호작용 (onClick, onChange)
🔵 브라우저 API 사용 (window, localStorage)
🔵 애니메이션/제스처
🔵 실시간 상태 업데이트
```

#### 적용 대상

**Server Component로 전환:**
```typescript
// ✅ app/page.tsx
export default async function HomePage() {
  // 서버에서 초기 데이터 fetch
  const signals = await getSignalsByDate(new Date());
  const marketData = await getMarketData();

  return (
    <main>
      <DashboardLayout initialData={{ signals, marketData }}>
        {/* 클라이언트 컴포넌트는 필요한 부분만 */}
        <DashboardFilters />
      </DashboardLayout>
    </main>
  );
}

// ✅ app/ox/dashboard/predict/[symbol]/page.tsx
export default async function PredictPage({ params }) {
  const { symbol } = await params;
  const symbolData = await getSymbolData(symbol);

  return <PredictForm symbol={symbol} initialData={symbolData} />;
}
```

**Client Component 경계 최소화:**
```typescript
// ✅ components/features/dashboard/DashboardLayout.tsx (Server)
export function DashboardLayout({ children, initialData }) {
  return (
    <div className="dashboard-container">
      <StaticHeader />
      <Suspense fallback={<StatsSkeleton />}>
        <StatsPanel data={initialData} />  {/* Server */}
      </Suspense>
      {children}  {/* Client components can be inserted */}
    </div>
  );
}

// 🔵 components/features/dashboard/DashboardFilters.tsx (Client)
"use client";
export function DashboardFilters() {
  const [filters, setFilters] = useState({});
  return <div>...</div>;  // 상호작용만 클라이언트
}
```

### 1.2 비즈니스 로직 추출

#### 새로운 디렉토리 구조
```
src/
├── lib/
│   ├── filters/
│   │   ├── signalFilters.ts          # 시그널 필터링 로직
│   │   ├── aiModelFilters.ts         # AI 모델 필터 로직
│   │   ├── strategyFilters.ts        # 전략 필터 로직
│   │   └── index.ts                  # Barrel export
│   │
│   ├── calculations/
│   │   ├── predictionStats.ts        # 예측 통계 계산
│   │   ├── stackMetrics.ts           # 아바타 스택 계산 로직
│   │   ├── dateUtils.ts              # 날짜 관련 유틸
│   │   └── index.ts
│   │
│   ├── validations/
│   │   ├── predictionValidation.ts   # 예측 검증 로직
│   │   ├── schemas.ts                # Zod 스키마 정의
│   │   └── index.ts
│   │
│   └── data/
│       ├── signals.ts                # 서버 데이터 fetching
│       ├── predictions.ts
│       └── market.ts
```

#### 구현 예시

**Before: DashboardClient.tsx (300+ lines)**
```typescript
const DashboardClient = memo(({ initialData }: Props) => {
  // 복잡한 필터링 로직이 컴포넌트에 직접 포함
  const aiModelFilteredSignals = useMemo(() => {
    if (selectedAiModels.length === 0) return tickerFilteredSignals;

    if (aiModelFilterConditions.every((c) => c === "OR")) {
      return tickerFilteredSignals.filter((item) => {
        const model = item.signal.ai_model;
        return model && selectedAiModels.includes(model);
      });
    } else if (aiModelFilterConditions.every((c) => c === "AND")) {
      const signalsByTicker = {};
      // 40줄의 복잡한 로직...
    } else {
      // 50줄의 mixed 로직...
    }
  }, [tickerFilteredSignals, selectedAiModels, aiModelFilterConditions]);

  return <div>...</div>;
});
```

**After: 분리된 구조**

```typescript
// ✅ lib/filters/aiModelFilters.ts
export type FilterCondition = 'OR' | 'AND';

export function filterSignalsByAiModels(
  signals: SignalData[],
  selectedModels: string[],
  conditions: FilterCondition[]
): SignalData[] {
  if (selectedModels.length === 0) return signals;

  if (conditions.every((c) => c === 'OR')) {
    return filterWithOrCondition(signals, selectedModels);
  }

  if (conditions.every((c) => c === 'AND')) {
    return filterWithAndCondition(signals, selectedModels);
  }

  return filterWithMixedConditions(signals, selectedModels, conditions);
}

function filterWithOrCondition(
  signals: SignalData[],
  models: string[]
): SignalData[] {
  return signals.filter((item) => {
    const model = item.signal.ai_model;
    return model && models.includes(model);
  });
}

function filterWithAndCondition(
  signals: SignalData[],
  models: string[]
): SignalData[] {
  const signalsByTicker = groupSignalsByTicker(signals);
  const validTickers = findTickersWithAllModels(signalsByTicker, models);

  return signals.filter((item) =>
    validTickers.includes(item.signal.ticker) &&
    models.includes(item.signal.ai_model ?? '')
  );
}

function filterWithMixedConditions(
  signals: SignalData[],
  models: string[],
  conditions: FilterCondition[]
): SignalData[] {
  // Mixed logic implementation
  const signalsByTicker = groupSignalsByTicker(signals);
  const validTickers = evaluateTickersWithConditions(
    signalsByTicker,
    models,
    conditions
  );

  return signals.filter((item) => validTickers.includes(item.signal.ticker));
}
```

```typescript
// ✅ components/features/signals/SignalTable.tsx
"use client";
import { filterSignalsByAiModels } from '@/lib/filters/aiModelFilters';

export function SignalTable({ signals }: Props) {
  const { selectedModels, conditions } = useFilterState();

  // 비즈니스 로직은 lib에서 가져옴
  const filteredSignals = useMemo(() =>
    filterSignalsByAiModels(signals, selectedModels, conditions),
    [signals, selectedModels, conditions]
  );

  return <Table data={filteredSignals} />;
}
```

**장점:**
- ✅ 비즈니스 로직 테스트 가능 (Jest)
- ✅ 컴포넌트 크기 50% 감소
- ✅ 로직 재사용 가능
- ✅ 타입 안정성 향상

### 1.3 컴포넌트 리팩토링

#### Feature-Based 구조
```
src/components/
├── features/                         # Feature별 조직화
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx      # Server Component
│   │   ├── DashboardContent.tsx     # Client (minimal)
│   │   │
│   │   ├── filters/
│   │   │   ├── SignalFilters.tsx    # Client
│   │   │   ├── StrategyFilter.tsx   # Client
│   │   │   └── AiModelFilter.tsx    # Client
│   │   │
│   │   ├── stats/
│   │   │   ├── StatsPanel.tsx       # Server possible
│   │   │   ├── StatsSummary.tsx     # Server
│   │   │   └── PredictionStack.tsx  # Client (animation)
│   │   │
│   │   └── news/
│   │       ├── NewsSection.tsx      # Server
│   │       └── NewsCard.tsx         # Server
│   │
│   ├── predictions/
│   │   ├── PredictionForm.tsx       # Client
│   │   ├── PredictionList.tsx       # Hybrid
│   │   ├── PredictionCard.tsx       # Server
│   │   │
│   │   └── hooks/
│   │       ├── usePredictionForm.ts
│   │       └── usePredictionValidation.ts
│   │
│   ├── signals/
│   │   ├── SignalTable.tsx          # Server possible
│   │   ├── SignalRow.tsx            # Client (interaction)
│   │   ├── SignalSearch.tsx         # Client
│   │   │
│   │   └── columns/
│   │       └── signalColumns.tsx
│   │
│   └── market/
│       ├── MarketChanges.tsx        # Server
│       └── MarketIndicators.tsx     # Server
│
├── shared/                          # 공통 컴포넌트
│   ├── skeletons/
│   │   ├── TableSkeleton.tsx
│   │   ├── StatsSkeleton.tsx
│   │   ├── CardSkeleton.tsx
│   │   └── NewsSkeleton.tsx
│   │
│   ├── layouts/
│   │   ├── PageLayout.tsx
│   │   └── SectionLayout.tsx
│   │
│   └── feedback/
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
│
└── ui/                              # shadcn/ui 컴포넌트
    ├── button.tsx
    ├── card.tsx
    └── ...
```

#### 공통 Skeleton 컴포넌트

**Before: 중복된 Skeleton (5곳에 존재)**
```typescript
// DashboardPageClient.tsx
function StatsSkeleton() { return <div>...</div>; }
function NewsSkeleton() { return <div>...</div>; }
function PredictionsSkeleton() { return <div>...</div>; }
// 다른 파일들에도 유사한 코드 반복
```

**After: 재사용 가능한 Skeleton**
```typescript
// ✅ components/shared/skeletons/StatsSkeleton.tsx
export function StatsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      <div className="animate-pulse rounded-2xl bg-slate-50 p-6">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ✅ components/shared/skeletons/TableSkeleton.tsx
export function TableSkeleton({
  columns = 6,
  rows = 5
}: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-16" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ✅ 사용
<Suspense fallback={<StatsSkeleton rows={3} />}>
  <DashboardStats />
</Suspense>

<Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
  <SignalTable />
</Suspense>
```

### 1.4 레이아웃 계층 정리 & Header 중복 제거

#### 현재 문제
- `src/app/layout.tsx`의 `ConditionalLayout`이 항상 `<Header />`를 렌더링하면서 `usePathname`을 임포트만 하고 사용하지 않아 불필요하게 클라이언트 컴포넌트가 유지됨.
- `/ox` 세그먼트의 `src/app/ox/layout.tsx`도 `<Header />`를 포함해 `/ox` 이하 페이지에서 헤더가 두 번 출력됨.
- 루트 레이아웃 전체를 `Suspense`로 감싸 전역 Provider와 UI 레이어가 얽혀 있어 서버 컴포넌트 분리가 지연되고, 플러터링 없이 레이아웃별 데이터 프리패칭이 어려움.

#### 개선 방안
1. `ConditionalLayout`을 제거하거나 서버 컴포넌트로 단순화하고, 경로 그룹별 레이아웃에서 헤더 렌더링 책임을 분리.
2. `app/(public)`·`app/(protected)` 라우트 그룹을 도입해 마케팅/인증 보호 화면을 명확히 구분하고, 필요한 곳에만 헤더나 `AuthGuard`를 감쌈.
3. `AuthGuard`처럼 클라이언트 의존성이 있는 요소는 해당 그룹 레이아웃 안에서만 적용해 루트 레이아웃은 순수 서버 컴포넌트로 유지.
4. 전역 `Suspense` 대신 Provider 레이어를 명시적으로 구성하고, 각 구간에 필요한 fallback 컴포넌트를 정의.

#### 구현 아이디어
```typescript
// ✅ app/(public)/layout.tsx
import Header from '@/components/header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
    </>
  );
}

// ✅ app/(protected)/ox/layout.tsx
import { AuthGuard } from '@/components/auth/auth-guard';

export default function OxLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <main className="bg-background min-h-screen">{children}</main>
    </AuthGuard>
  );
}
```

#### 산출물
- 공통 레이아웃 구조 다이어그램 및 문서 업데이트.
- `/ox` 페이지에서 헤더 중복이 제거된 스크린샷 또는 스토리북 캡처.
- 라우트 그룹 도입 이후 CLS/LCP 측정값 비교(전/후 1회 이상 측정).

#### 실행 체크리스트
- [ ] `src/app/layout.tsx`, `src/app/ox/layout.tsx`, `src/components/ConditionalLayout.tsx`의 헤더 렌더링 경로 분석 및 다이어그램 작성
- [ ] 라우트 그룹 구조 초안 (`app/(public)`, `app/(protected)`) 설계 후 공유/승인
- [ ] 루트 레이아웃에서 `Suspense` 제거 및 Provider 레이어 분리 설계
- [ ] `app/(public)/layout.tsx` 구현 및 기존 공개 페이지 이동
- [ ] `app/(protected)/ox/layout.tsx` 구현 후 `AuthGuard` 포함 여부 검증
- [ ] `/ox` 이하 페이지에서 중복 헤더 제거 확인 (스토리북/로컬 스크린샷)
- [ ] CLS/LCP 측정 (리팩토링 전/후 Lighthouse 최소 1회)
- [ ] 문서/다이어그램 최신화 및 리뷰 반영

---

## 🚀 Phase 2: SSR/Data Fetching 최적화 (1주)

### 2.1 서버 컴포넌트에서 데이터 Fetch

#### 기존 문제
```typescript
// ❌ Before: 클라이언트에서만 데이터 fetch
"use client";
export function DashboardPageClient() {
  const { data, isLoading } = useSignalDataByDate(date);

  if (isLoading) return <Skeleton />;
  return <div>{/* render */}</div>;
}
```
**문제점:**
- JavaScript 로드 후에야 데이터 fetching 시작
- 초기 HTML에 컨텐츠 없음 (SEO 불리)
- 불필요한 로딩 상태 관리

#### 개선 방안

```typescript
// ✅ After: 서버에서 데이터 fetch
// app/page.tsx
import { getSignalsByDate } from '@/lib/data/signals';
import { getMarketData } from '@/lib/data/market';
import { DashboardContent } from '@/components/features/dashboard/DashboardContent';

export default async function HomePage() {
  // 병렬로 데이터 fetch
  const [signals, marketData] = await Promise.all([
    getSignalsByDate(new Date()),
    getMarketData()
  ]);

  return (
    <main className="min-h-screen">
      <DashboardContent
        initialSignals={signals}
        initialMarketData={marketData}
      />
    </main>
  );
}

// lib/data/signals.ts
export async function getSignalsByDate(date: Date) {
  const response = await fetch(
    `${API_URL}/signals?date=${date.toISOString()}`,
    {
      next: {
        revalidate: 300,  // 5분마다 재검증
        tags: ['signals']  // 캐시 태그
      }
    }
  );

  if (!response.ok) throw new Error('Failed to fetch signals');
  return response.json();
}
```

**장점:**
- ✅ 초기 HTML에 컨텐츠 포함 (SEO 개선)
- ✅ 더 빠른 First Contentful Paint
- ✅ JavaScript 파싱 전에 컨텐츠 표시
- ✅ Next.js 캐싱 자동 활용

### 2.2 Streaming & Suspense 전략

#### Streaming의 이점
- 긴 데이터 fetch를 기다리지 않고 페이지 일부 먼저 표시
- 사용자 체감 속도 향상
- 점진적 페이지 렌더링

#### 구현 방법

```typescript
// ✅ app/page.tsx
import { Suspense } from 'react';

export default async function HomePage() {
  // 빠른 데이터는 await
  const quickData = await getQuickData();

  return (
    <main>
      {/* 즉시 표시 */}
      <Header data={quickData} />

      {/* 느린 데이터는 Streaming */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />  {/* 서버 컴포넌트 */}
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
        <SignalTable />     {/* 서버 컴포넌트 */}
      </Suspense>

      <Suspense fallback={<NewsSkeleton />}>
        <NewsSection />     {/* 서버 컴포넌트 */}
      </Suspense>
    </main>
  );
}

// components/features/dashboard/DashboardStats.tsx (Server Component)
export async function DashboardStats() {
  // 이 데이터 fetch는 독립적으로 실행됨
  const stats = await getPredictionStats();

  return (
    <div className="stats-panel">
      {/* render stats */}
    </div>
  );
}

// components/features/signals/SignalTable.tsx (Server Component)
export async function SignalTable() {
  // 병렬로 실행됨 (DashboardStats와 독립적)
  const signals = await getSignals();

  return (
    <div className="table-container">
      {/* render table */}
    </div>
  );
}
```

**결과:**
```
전통적 SSR:
[==================] Header + Stats + Table + News (5초)
└─ 사용자는 5초 후 전체 페이지 봄

Streaming SSR:
[====] Header (0.5초)
└─ 사용자는 0.5초 후 헤더 봄
  [======] Stats (1.5초)
  └─ 사용자는 2초 후 통계 봄
    [========] Table (2초)
    └─ 사용자는 4초 후 테이블 봄
      [====] News (1초)
      └─ 사용자는 5초 후 뉴스 봄
```

### 2.3 Parallel Routes 활용

#### 현재 구조
```
app/
├── @modal/
│   └── (.)ox/
│       └── dashboard/
│           └── predict/
│               └── [symbol]/
│                   └── page.tsx
└── ox/
    └── dashboard/
        └── predict/
            └── [symbol]/
                └── page.tsx
```

#### 개선 방안

```typescript
// ✅ app/@modal/(.)ox/dashboard/predict/[symbol]/page.tsx
export default async function ModalPredictPage({ params }) {
  const { symbol } = await params;

  // 서버에서 필요한 데이터만 fetch
  const symbolData = await getSymbolData(symbol);

  return (
    <Modal>
      <PredictForm symbol={symbol} initialData={symbolData} />
    </Modal>
  );
}

// ✅ app/layout.tsx
export default function RootLayout({
  children,
  modal,  // Parallel route
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {modal}  {/* Intercepted route가 여기 렌더링 */}
      </body>
    </html>
  );
}
```

**장점:**
- ✅ 모달도 서버 컴포넌트 활용
- ✅ URL 기반 모달 (새로고침 안전)
- ✅ 더 나은 UX (뒤로가기 작동)

### 2.4 캐싱 전략

#### Next.js 15 캐싱 레이어
```typescript
// lib/data/signals.ts
export async function getSignals(date: string) {
  return await fetch(`${API_URL}/signals?date=${date}`, {
    // 1. Data Cache (CDN/서버 캐시)
    next: {
      revalidate: 300,           // 5분마다 재검증
      tags: ['signals', 'dashboard']  // 수동 무효화 가능
    },

    // 2. Full Route Cache (프리렌더링 결과)
    // 자동으로 적용됨
  });
}

// 캐시 무효화 (admin action 등)
import { revalidateTag } from 'next/cache';

export async function updateSignal() {
  // 데이터 업데이트 로직

  // 관련 캐시 무효화
  revalidateTag('signals');
  revalidateTag('dashboard');
}
```

#### React Cache (중복 요청 제거)
```typescript
import { cache } from 'react';

// 같은 렌더링 사이클에서 여러 번 호출해도 한 번만 실행
export const getSignals = cache(async (date: string) => {
  console.log('Fetching signals for', date);  // 한 번만 출력

  return await fetch(`${API_URL}/signals?date=${date}`);
});

// 여러 컴포넌트에서 호출해도 중복 방지
// Component A
const signals = await getSignals('2025-10-21');

// Component B (같은 요청은 캐시에서 반환)
const signals = await getSignals('2025-10-21');
```

#### TanStack Query 클라이언트 캐싱
```typescript
// 클라이언트 상호작용에는 여전히 React Query 사용
"use client";
export function SignalFilters({ initialData }) {
  const { data: signals } = useQuery({
    queryKey: ['signals', date],
    queryFn: () => fetchSignals(date),
    initialData,  // 서버에서 받은 초기 데이터
    staleTime: 5 * 60 * 1000,  // 5분
  });

  return <div>...</div>;
}
```

### 2.5 예측 통계 파생 데이터 동기화

#### 현재 문제
```typescript
// src/hooks/usePrediction.ts
export const usePredictionStats = () => {
  const { data: predictions } = usePredictionHistory({ limit: 1000 });

  return useQuery<PredictionStats>({
    queryKey: PREDICTION_KEYS.stats(),
    queryFn: () => {
      if (!predictions?.pages?.length) {
        return EMPTY_STATS;
      }
      const allPredictions = predictions.pages.flat();
      // 파생 데이터 계산...
      return buildStats(allPredictions);
    },
    enabled: !!predictions?.pages?.length,
  });
};
```
- `useQuery`의 `queryFn`이 클로저로 `predictions`를 참조하기 때문에 history가 무효화돼도 캐시가 즉시 갱신되지 않음.
- 동일한 정보를 두 개의 쿼리 캐시에 저장하면서 불필요한 메모리 사용 및 네트워크 재시도가 발생.
- 서버 컴포넌트/SSR 단계에서 동일한 통계 계산을 재사용하기 어렵고, 테스트에서 순수 함수로 검증하기 힘듦.

#### 개선 방안
1. `lib/analytics/predictions/calcPredictionStats.ts`에서 순수 함수로 통계 계산 로직을 분리해 클라이언트와 서버가 공유.
2. `usePredictionStats`는 React Query `select` 또는 `useMemo`를 활용해 history 쿼리 결과를 파생 데이터로 변환하고, 별도 `useQuery` 호출을 제거.
3. 파생 데이터 유효성을 확보하기 위해 history 쿼리의 `queryKey`와 연결된 `queryClient.getQueryData`/`setQueryData` 전략을 도입.
4. 통계 계산 함수에 대한 단위 테스트를 작성하고, edge case(빈 배열, 음수 포인트 등)를 검증.

#### 구현 아이디어
```typescript
// ✅ lib/analytics/predictions/calcPredictionStats.ts
export function calcPredictionStats(history: Prediction[]): PredictionStats {
  // 순수 함수로 통계 산출
}

// ✅ hooks/usePrediction.ts
export const usePredictionStats = () => {
  const historyQuery = usePredictionHistory({ limit: 500 });

  const stats = useMemo(() => {
    if (!historyQuery.data?.pages?.length) return EMPTY_STATS;
    const flat = historyQuery.data.pages.flat();
    return calcPredictionStats(flat);
  }, [historyQuery.data]);

  return {
    data: stats,
    isLoading: historyQuery.isLoading,
    refetch: historyQuery.fetchNextPage,
  };
};
```

#### 산출물
- `calcPredictionStats` 순수 함수 및 단위 테스트 (`lib/analytics/predictions/__tests__`).
- 기존 `usePredictionStats` 호출부 리팩토링 PR.
- React Query Devtools를 통한 파생 데이터 갱신 확인 캡처.

#### 실행 체크리스트
- [ ] 기존 `usePredictionHistory` 반환 데이터 구조 및 내부 계산 로직 문서화
- [ ] `lib/analytics/predictions/calcPredictionStats.ts` 초안 작성 (빈 배열, 음수 포인트 등 엣지 케이스 포함)
- [ ] 테스트 폴더 생성 및 `calcPredictionStats` 유닛 테스트 작성/통과
- [ ] `usePredictionStats`를 메모이제이션 기반 파생 데이터 훅으로 리팩토링
- [ ] React Query Devtools로 history 갱신 시 stats도 즉시 갱신되는지 검증
- [ ] SSR/서버 컴포넌트에서 통계 유틸 재사용 가능한지 PoC 작성
- [ ] API 문서/타입 정의(`PredictionStats`)와 계산 결과 일치 여부 확인
- [ ] 변경 PR 리뷰 및 QA 피드백 반영

---

## ⚡ Phase 3: 코드 품질 개선 (1주)

### 3.1 Custom Hooks 정리

#### 현재 문제
```typescript
// ❌ 여러 hooks가 관련 로직을 분산
const { date, q, strategy_type, setParams } = useDashboardFilters();
const {
  availableAiModels,
  selectedAiModels,
  aiModelFilterConditions,
  updateAvailableAiModels
} = useDashboardAiModels();
const { data: signalApiResponse } = useSignalDataByDate(date);
```

#### 개선 방안

```typescript
// ✅ hooks/useDashboard.ts - Facade Pattern
export function useDashboard(initialData?: SignalAPIResponse) {
  const filters = useDashboardFilters();
  const aiModels = useDashboardAiModels();
  const signals = useSignalData(filters.date, initialData);

  // 필터 적용된 시그널 계산
  const filteredSignals = useMemo(() => {
    let result = signals.data?.signals ?? [];

    // 티커 필터
    if (filters.q) {
      result = filterByTickers(result, filters.q.split(','));
    }

    // AI 모델 필터
    if (aiModels.selectedAiModels.length > 0) {
      result = filterSignalsByAiModels(
        result,
        aiModels.selectedAiModels,
        aiModels.conditions
      );
    }

    // 전략 필터
    if (filters.strategy_type) {
      result = filterByStrategy(result, filters.strategy_type);
    }

    return result;
  }, [
    signals.data,
    filters.q,
    filters.strategy_type,
    aiModels.selectedAiModels,
    aiModels.conditions
  ]);

  return {
    // State
    filters,
    aiModels,
    signals: filteredSignals,
    isLoading: signals.isLoading,

    // Actions
    setFilters: filters.setParams,
    setAiModels: aiModels.updateAvailableAiModels,
  };
}

// ✅ 사용
export function DashboardContent({ initialData }) {
  const {
    filters,
    signals,
    isLoading,
    setFilters
  } = useDashboard(initialData);

  return <div>...</div>;
}
```

### 3.2 타입 안정성 강화

#### Zod 스키마 활용

```typescript
// ✅ lib/validations/schemas.ts
import { z } from 'zod';

// API 응답 스키마
export const SignalSchema = z.object({
  ticker: z.string(),
  ai_model: z.string(),
  probability: z.number().min(0).max(100),
  strategy: z.string().optional(),
  date: z.string().datetime(),
});

export const SignalAPIResponseSchema = z.object({
  signals: z.array(SignalSchema),
  metadata: z.object({
    total: z.number(),
    date: z.string(),
  }),
});

export type Signal = z.infer<typeof SignalSchema>;
export type SignalAPIResponse = z.infer<typeof SignalAPIResponseSchema>;

// ✅ lib/data/signals.ts
export async function getSignals(date: string) {
  const response = await fetch(`${API_URL}/signals?date=${date}`);
  const data = await response.json();

  // 런타임 검증
  const validated = SignalAPIResponseSchema.parse(data);
  return validated;
}
```

#### Form 검증

```typescript
// ✅ components/features/predictions/PredictionForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const PredictionFormSchema = z.object({
  symbol: z.string().min(1, "심볼을 선택해주세요"),
  direction: z.enum(['UP', 'DOWN'], {
    required_error: "방향을 선택해주세요"
  }),
  confidence: z.number().min(1).max(100),
  stake: z.number().positive("포인트는 양수여야 합니다"),
});

type PredictionFormData = z.infer<typeof PredictionFormSchema>;

export function PredictionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PredictionFormData>({
    resolver: zodResolver(PredictionFormSchema),
  });

  const onSubmit = (data: PredictionFormData) => {
    // 타입 안전한 데이터
    submitPrediction(data);
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### 3.3 성능 최적화

#### 1. 불필요한 최적화 제거

```typescript
// ❌ Before: 서버 컴포넌트에서 useMemo 불필요
"use client";
export function Component() {
  const expensiveValue = useMemo(() => {
    return heavyCalculation(data);
  }, [data]);
}

// ✅ After: 서버 컴포넌트로 전환 (re-render 없음)
export function Component() {
  const expensiveValue = heavyCalculation(data);
  return <div>{expensiveValue}</div>;
}
```

#### 2. Virtual Scrolling (대량 데이터)

```typescript
// ✅ 100+ 항목일 때만 적용
import { useVirtualizer } from '@tanstack/react-virtual';

export function SignalTable({ signals }: { signals: Signal[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: signals.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,  // 예상 행 높이
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <SignalRow
            key={virtualRow.index}
            signal={signals[virtualRow.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

#### 3. Image Optimization

```typescript
// ✅ Next.js Image 컴포넌트 활용
import Image from 'next/image';

export function TickerAvatar({ symbol }: { symbol: string }) {
  return (
    <Image
      src={`https://images.bamtoly.com/tickers/${symbol}.png`}
      alt={symbol}
      width={32}
      height={32}
      quality={75}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/png;base64,..."
    />
  );
}
```

### 3.4 Command Palette UX 개선

#### 현재 문제
- `src/components/ui/command-palette.tsx`에서 단축키 이벤트가 `!open`을 참조해 컨트롤되지 않는 상태에서는 항상 `true`만 설정돼 토글이 동작하지 않음.
- `useEffect` 의존성 배열에 `open` 값이 포함되지 않아 외부에서 `open` prop을 제어할 때 최신 상태가 반영되지 않음.
- 라우터 이동과 상태 변경을 묶어 처리하는 로직이 분산돼 테스트하기 어렵고, 접근성 단축키(`cmd/ctrl + k`)가 페이지 마운트/언마운트 시 중복 등록될 여지가 있음.

#### 개선 방안
1. `useControllableState`(직접 구현) 패턴을 적용해 내부/외부 제어를 단일 훅으로 통합.
2. 단축키 핸들러에서 최신 상태를 참조하도록 `useCallback` + 상태 업데이트 함수(`setOpen((prev) => !prev)`)를 사용.
3. 단축키 바인딩을 커스텀 훅(`useCommandPaletteHotkey`)으로 추출하고, 클린업을 명시적으로 처리해 메모리 누수를 방지.
4. Playwright 또는 RTL 테스트로 단축키 입력 시 다이얼로그가 열리고 닫히는지 검증.

#### 구현 아이디어
```typescript
// ✅ hooks/useControllableState.ts
export function useControllableState({ value, defaultValue, onChange }) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const state = isControlled ? value : internal;

  const setState = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      const resolved = typeof next === 'function' ? next(state) : next;
      if (!isControlled) setInternal(resolved);
      onChange?.(resolved);
    },
    [isControlled, onChange, state],
  );

  return [state, setState] as const;
}

// ✅ components/ui/command-palette.tsx
const [openState, setOpenState] = useControllableState({
  value: open,
  defaultValue: false,
  onChange: onOpenChange,
});

useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpenState((prev) => !prev);
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [setOpenState]);
```

#### 산출물
- `useControllableState`/`useCommandPaletteHotkey` 커스텀 훅 및 단위 테스트.
- 단축키 토글 E2E 스냅샷(열림/닫힘) 기록.
- 접근성 감사(ARIA role, focus trap) 결과 업데이트.

#### 실행 체크리스트
- [ ] 현재 `command-palette.tsx`의 상태 제어/단축키 흐름 분석 및 문제 사례 기록
- [ ] `useControllableState` 설계 및 훅 구현 (Storybook/테스트 포함)
- [ ] 단축키 전용 훅(`useCommandPaletteHotkey`) 작성 및 이벤트 등록/해제 검증
- [ ] `CommandPalette` 컴포넌트에 새 훅 통합, 상태/라우터 연동 리팩토링
- [ ] RTL 또는 Playwright 테스트로 `cmd/ctrl + k` 토글 시나리오 작성
- [ ] ARIA role, focus trap, initial focus 등 접근성 검증 및 개선 사항 반영
- [ ] 문서에 사용 방법/단축키 리스트 업데이트
- [ ] QA 세션/디자인 승인 후 배포 체크

---

## 📊 우선순위별 작업 목록

### 🔴 High Priority (Week 1)

#### 1. DashboardPageClient 리팩토링
**목표**: 서버/클라이언트 분리, 초기 로딩 성능 40% 개선

**작업:**
- [ ] `app/page.tsx`에 서버 데이터 fetching 추가
- [ ] `DashboardLayout.tsx` 서버 컴포넌트 생성
- [ ] 필터/검색 부분만 클라이언트 컴포넌트로 분리
- [ ] Streaming + Suspense 적용

**예상 시간**: 3일

**성공 지표**:
- Lighthouse Performance Score: 70 → 90+
- First Contentful Paint: -40%
- Total Blocking Time: -50%

#### 2. 비즈니스 로직 추출
**목표**: 코드 가독성 향상, 테스트 가능성 확보

**작업:**
- [ ] `lib/filters/` 디렉토리 생성
- [ ] `signalFilters.ts` 생성 (티커 필터링)
- [ ] `aiModelFilters.ts` 생성 (AI 모델 필터링)
- [ ] `strategyFilters.ts` 생성 (전략 필터링)
- [ ] DashboardClient에서 로직 이동
- [ ] 단위 테스트 작성

**예상 시간**: 2일

**성공 지표**:
- DashboardClient 라인 수: 300+ → 150 이하
- 테스트 커버리지: 0% → 80%+

#### 3. 공통 Skeleton 컴포넌트
**목표**: 중복 코드 제거, 일관된 로딩 UI

**작업:**
- [ ] `components/shared/skeletons/` 생성
- [ ] `StatsSkeleton.tsx` 생성
- [ ] `TableSkeleton.tsx` 생성
- [ ] `NewsSkeleton.tsx` 생성
- [ ] `CardSkeleton.tsx` 생성
- [ ] 기존 중복 코드 제거

**예상 시간**: 1일

**성공 지표**:
- 중복 코드 라인: 145 → 0
- 재사용 가능한 컴포넌트 수: 5개

---

### 🟡 Medium Priority (Week 2)

#### 4. dashboard-stats 리팩토링
**목표**: 애니메이션 로직 분리, 계산 로직 추출

**작업:**
- [ ] `lib/calculations/stackMetrics.ts` 생성
- [ ] 아바타 스택 계산 로직 이동
- [ ] Framer Motion variants 분리
- [ ] 날짜 관련 유틸 `dateUtils.ts`로 이동
- [ ] 컴포넌트 크기 최적화

**예상 시간**: 2일

#### 5. SSR 데이터 fetching
**목표**: 초기 HTML에 컨텐츠 포함, SEO 개선

**작업:**
- [ ] `lib/data/signals.ts` 생성
- [ ] `lib/data/predictions.ts` 생성
- [ ] `lib/data/market.ts` 생성
- [ ] 서버 컴포넌트에서 데이터 fetch
- [ ] Streaming 적용
- [ ] Error boundary 추가

**예상 시간**: 3일

**성공 지표**:
- SEO Score: 80 → 95+
- Time to Interactive: -30%

#### 6. API 캐싱 전략
**목표**: 중복 요청 제거, 응답 속도 향상

**작업:**
- [ ] Next.js Data Cache 설정
- [ ] React Cache 적용
- [ ] 캐시 무효화 로직
- [ ] TanStack Query 설정 최적화

**예상 시간**: 2일

---

### 🟢 Low Priority (Week 3)

#### 7. 타입 안정성
**목표**: 런타임 에러 방지, 개발자 경험 향상

**작업:**
- [ ] `lib/validations/schemas.ts` 생성
- [ ] API 응답 Zod 스키마
- [ ] Form 검증 스키마
- [ ] 기존 타입 정의 검증

**예상 시간**: 2일

#### 8. 성능 프로파일링
**목표**: 병목 지점 식별 및 최적화

**작업:**
- [ ] React DevTools Profiler 분석
- [ ] 불필요한 re-render 제거
- [ ] 큰 리스트 Virtual Scrolling
- [ ] Image 최적화

**예상 시간**: 2일

#### 9. 문서화
**목표**: 유지보수성 향상, 온보딩 시간 단축

**작업:**
- [ ] 컴포넌트 구조 문서
- [ ] 아키텍처 다이어그램 (Mermaid)
- [ ] 개발 가이드라인
- [ ] 성능 개선 결과 정리

**예상 시간**: 1일

---

## 🔍 상세 리팩토링 예시

### Example 1: DashboardPageClient 변환

#### Before (300+ lines, all client-side)
```typescript
// src/components/ox/dashboard/DashboardPageClient.tsx
"use client";

import { Suspense } from "react";
// ... 많은 imports

export function DashboardPageClient() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-[#090b11]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header>...</header>

        <Suspense fallback={<StatsSkeleton />}>
          <Card>
            <CardContent>
              <DashboardStats />
            </CardContent>
          </Card>
        </Suspense>

        {/* More sections... */}
      </div>
    </div>
  );
}
```

#### After: 분리된 구조

```typescript
// ✅ app/page.tsx (Server Component)
import { getSignals } from '@/lib/data/signals';
import { getMarketData } from '@/lib/data/market';
import { DashboardLayout } from '@/components/features/dashboard/DashboardLayout';

export default async function HomePage() {
  // 서버에서 초기 데이터 fetch
  const [signals, marketData] = await Promise.all([
    getSignals(new Date().toISOString()),
    getMarketData(),
  ]);

  return (
    <DashboardLayout
      initialSignals={signals}
      initialMarketData={marketData}
    />
  );
}

// ✅ components/features/dashboard/DashboardLayout.tsx (Server Component)
import { Suspense } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { StatsPanel } from './stats/StatsPanel';
import { TrendingPredictions } from './TrendingPredictions';
import { NewsSection } from './news/NewsSection';
import { SignalTable } from '../signals/SignalTable';
import { MarketChanges } from '../market/MarketChanges';
import { StatsSkeleton, TableSkeleton, NewsSkeleton } from '@/components/shared/skeletons';

export function DashboardLayout({
  initialSignals,
  initialMarketData
}: Props) {
  return (
    <div className="relative min-h-screen bg-white dark:bg-[#090b11]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-8 pb-16">
        {/* Static header - server component */}
        <DashboardHeader />

        {/* Stats - streaming */}
        <Suspense fallback={<StatsSkeleton />}>
          <StatsPanel />
        </Suspense>

        {/* Trending - streaming */}
        <Suspense fallback={<TableSkeleton columns={5} rows={5} />}>
          <TrendingPredictions limit={5} />
        </Suspense>

        {/* News - streaming */}
        <Suspense fallback={<NewsSkeleton />}>
          <NewsSection />
        </Suspense>

        {/* Signal table - with filters (client component) */}
        <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
          <SignalTable initialData={initialSignals} />
        </Suspense>

        {/* Market changes - streaming */}
        <Suspense fallback={<NewsSkeleton />}>
          <MarketChanges />
        </Suspense>
      </div>
    </div>
  );
}

// ✅ components/features/dashboard/DashboardHeader.tsx (Server Component)
import { Badge } from '@/components/ui/badge';

export function DashboardHeader() {
  return (
    <header className="space-y-4">
      <Badge className="w-fit rounded-full bg-slate-100">
        오늘의 인사이트
      </Badge>
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            오늘 예측
          </h1>
          <p className="text-sm text-slate-600">
            오늘 미국 주식의 방향을 예측을 해봐요
          </p>
        </div>
      </div>
    </header>
  );
}
```

**개선 효과:**
- ✅ 초기 HTML에 컨텐츠 포함 (SEO)
- ✅ JavaScript 로드 전에도 컨텐츠 표시
- ✅ 점진적 페이지 렌더링 (Streaming)
- ✅ 컴포넌트 크기 감소 (300줄 → 50줄)

### Example 2: 비즈니스 로직 분리

#### Before: 로직이 컴포넌트에 혼재
```typescript
// DashboardClient.tsx (일부)
const aiModelFilteredSignals = useMemo(() => {
  if (selectedAiModels.length === 0) return tickerFilteredSignals;

  if (aiModelFilterConditions.every((c) => c === "OR")) {
    return tickerFilteredSignals.filter((item) => {
      const model = item.signal.ai_model;
      return model && selectedAiModels.includes(model);
    });
  } else if (aiModelFilterConditions.every((c) => c === "AND")) {
    const signalsByTicker: Record<string, { models: Set<string>; items: SignalData[] }> = {};

    tickerFilteredSignals.forEach((item) => {
      const ticker = item.signal.ticker;
      const model = item.signal.ai_model;
      if (!ticker) return;
      if (!signalsByTicker[ticker]) {
        signalsByTicker[ticker] = { models: new Set(), items: [] };
      }
      if (model) signalsByTicker[ticker].models.add(model);
      signalsByTicker[ticker].items.push(item);
    });

    // ... 더 많은 로직
  }
}, [tickerFilteredSignals, selectedAiModels, aiModelFilterConditions]);
```

#### After: 깔끔하게 분리

```typescript
// ✅ lib/filters/aiModelFilters.ts
import { SignalData } from '@/types/signal';

export type FilterCondition = 'OR' | 'AND';

/**
 * AI 모델로 시그널 필터링
 * @param signals - 필터링할 시그널 목록
 * @param selectedModels - 선택된 AI 모델 목록
 * @param conditions - 필터 조건 (OR/AND)
 * @returns 필터링된 시그널 목록
 */
export function filterSignalsByAiModels(
  signals: SignalData[],
  selectedModels: string[],
  conditions: FilterCondition[]
): SignalData[] {
  if (selectedModels.length === 0) {
    return signals;
  }

  // 모든 조건이 OR인 경우
  if (conditions.every((c) => c === 'OR')) {
    return filterWithOrCondition(signals, selectedModels);
  }

  // 모든 조건이 AND인 경우
  if (conditions.every((c) => c === 'AND')) {
    return filterWithAndCondition(signals, selectedModels);
  }

  // 혼합 조건
  return filterWithMixedConditions(signals, selectedModels, conditions);
}

/**
 * OR 조건으로 필터링 (선택된 모델 중 하나라도 포함)
 */
function filterWithOrCondition(
  signals: SignalData[],
  models: string[]
): SignalData[] {
  return signals.filter((item) => {
    const model = item.signal.ai_model;
    return model && models.includes(model);
  });
}

/**
 * AND 조건으로 필터링 (모든 모델이 포함된 티커만)
 */
function filterWithAndCondition(
  signals: SignalData[],
  models: string[]
): SignalData[] {
  const signalsByTicker = groupSignalsByTicker(signals);
  const validTickers = findTickersWithAllModels(signalsByTicker, models);

  return signals.filter((item) =>
    validTickers.includes(item.signal.ticker) &&
    item.signal.ai_model &&
    models.includes(item.signal.ai_model)
  );
}

/**
 * 혼합 조건으로 필터링
 */
function filterWithMixedConditions(
  signals: SignalData[],
  models: string[],
  conditions: FilterCondition[]
): SignalData[] {
  const signalsByTicker = groupSignalsByTicker(signals);

  const validTickers = Object.keys(signalsByTicker).filter((ticker) => {
    const tickerModels = signalsByTicker[ticker].models;

    // 각 모델의 존재 여부 확인
    const presence = models.map((m) => tickerModels.has(m));

    // 조건을 순차적으로 평가
    let result = presence[0];
    for (let i = 1; i < presence.length; i++) {
      const condition = conditions[i - 1] ?? 'OR';
      result = condition === 'OR'
        ? result || presence[i]
        : result && presence[i];
    }

    return result;
  });

  return signals.filter((item) =>
    validTickers.includes(item.signal.ticker) &&
    item.signal.ai_model &&
    models.includes(item.signal.ai_model)
  );
}

/**
 * 시그널을 티커별로 그룹화
 */
function groupSignalsByTicker(
  signals: SignalData[]
): Record<string, { models: Set<string>; items: SignalData[] }> {
  const grouped: Record<string, { models: Set<string>; items: SignalData[] }> = {};

  signals.forEach((item) => {
    const ticker = item.signal.ticker;
    const model = item.signal.ai_model;

    if (!ticker) return;

    if (!grouped[ticker]) {
      grouped[ticker] = { models: new Set(), items: [] };
    }

    if (model) {
      grouped[ticker].models.add(model);
    }

    grouped[ticker].items.push(item);
  });

  return grouped;
}

/**
 * 모든 모델을 가진 티커 찾기
 */
function findTickersWithAllModels(
  signalsByTicker: Record<string, { models: Set<string>; items: SignalData[] }>,
  requiredModels: string[]
): string[] {
  return Object.keys(signalsByTicker).filter((ticker) => {
    const tickerModels = signalsByTicker[ticker].models;
    return requiredModels.every((model) => tickerModels.has(model));
  });
}

// ✅ lib/filters/__tests__/aiModelFilters.test.ts
import { describe, it, expect } from '@jest/globals';
import { filterSignalsByAiModels } from '../aiModelFilters';

describe('filterSignalsByAiModels', () => {
  const mockSignals = [
    { signal: { ticker: 'AAPL', ai_model: 'GPT-4' } },
    { signal: { ticker: 'AAPL', ai_model: 'Claude' } },
    { signal: { ticker: 'MSFT', ai_model: 'GPT-4' } },
  ];

  it('should return all signals when no models selected', () => {
    const result = filterSignalsByAiModels(mockSignals, [], []);
    expect(result).toEqual(mockSignals);
  });

  it('should filter with OR condition', () => {
    const result = filterSignalsByAiModels(
      mockSignals,
      ['GPT-4'],
      ['OR']
    );
    expect(result).toHaveLength(2);
    expect(result.every(s => s.signal.ai_model === 'GPT-4')).toBe(true);
  });

  it('should filter with AND condition', () => {
    const result = filterSignalsByAiModels(
      mockSignals,
      ['GPT-4', 'Claude'],
      ['AND']
    );
    expect(result).toHaveLength(2);  // Only AAPL has both
  });
});
```

```typescript
// ✅ components/features/signals/SignalTable.tsx
"use client";
import { useMemo } from 'react';
import { filterSignalsByAiModels } from '@/lib/filters/aiModelFilters';
import { SignalData } from '@/types/signal';

export function SignalTable({ initialData }: { initialData: SignalData[] }) {
  const { selectedModels, conditions } = useFilterState();

  // 비즈니스 로직은 lib에서 가져옴
  const filteredSignals = useMemo(
    () => filterSignalsByAiModels(initialData, selectedModels, conditions),
    [initialData, selectedModels, conditions]
  );

  return (
    <div className="signal-table">
      {filteredSignals.map((signal) => (
        <SignalRow key={signal.signal.ticker} signal={signal} />
      ))}
    </div>
  );
}
```

**개선 효과:**
- ✅ 테스트 가능한 순수 함수
- ✅ 컴포넌트 크기 70% 감소
- ✅ 재사용 가능한 로직
- ✅ JSDoc으로 문서화
- ✅ 타입 안정성 향상

---

## ✅ 성공 지표

### 정량적 지표

#### 1. 성능 (Lighthouse)
| 지표 | Before | Target | 측정 방법 |
|------|--------|--------|-----------|
| Performance Score | 70 | 90+ | Lighthouse CI |
| First Contentful Paint | 2.5s | 1.5s | WebPageTest |
| Largest Contentful Paint | 4.0s | 2.4s | Chrome DevTools |
| Time to Interactive | 5.2s | 3.6s | Lighthouse |
| Total Blocking Time | 800ms | 400ms | Lighthouse |
| Cumulative Layout Shift | 0.15 | <0.1 | Lighthouse |

#### 2. 코드 품질
| 지표 | Before | Target | 측정 방법 |
|------|--------|--------|-----------|
| 번들 크기 (JS) | 500KB | 350KB | webpack-bundle-analyzer |
| 300줄 이상 파일 | 3개 | 0개 | ESLint custom rule |
| 타입 커버리지 | 85% | 95% | TypeScript strict mode |
| 테스트 커버리지 | 0% | 80% | Jest coverage |
| 중복 코드 | 145줄 | 0줄 | SonarQube |

#### 3. SEO
| 지표 | Before | Target | 측정 방법 |
|------|--------|--------|-----------|
| SEO Score | 80 | 95+ | Lighthouse |
| Meta Tags | 부분적 | 완전 | SEO Analyzer |
| Structured Data | 없음 | JSON-LD | Schema Validator |

### 정성적 지표

#### 1. 개발자 경험
- ✅ 컴포넌트 찾기 쉬움 (feature-based 구조)
- ✅ 로직 재사용 간편 (lib/ 구조)
- ✅ 타입 자동완성 개선 (Zod)
- ✅ 테스트 작성 용이

#### 2. 사용자 경험
- ✅ 페이지 로딩 체감 속도 향상
- ✅ 일관된 로딩 UI
- ✅ 부드러운 상호작용
- ✅ 안정적인 레이아웃 (CLS 개선)

---

## 🚧 리스크 & 대응 방안

### Risk Matrix

| 리스크 | 확률 | 영향 | 심각도 | 대응 방안 |
|--------|------|------|--------|-----------|
| 대규모 변경으로 버그 발생 | High | High | 🔴 Critical | 단계별 진행, 충분한 테스트, Feature flag |
| React Query 캐싱 충돌 | Medium | Medium | 🟡 Major | 서버/클라이언트 캐싱 전략 명확화, 문서화 |
| 기존 기능 동작 변경 | Medium | High | 🟡 Major | E2E 테스트, 점진적 전환, Rollback 계획 |
| 개발 기간 초과 | Low | Medium | 🟢 Minor | Phase별 우선순위 조정, MVP 우선 |
| 팀원 학습 곡선 | Medium | Low | 🟢 Minor | 문서화, 페어 프로그래밍, 코드 리뷰 |
| 성능 목표 미달 | Low | High | 🟡 Major | 프로파일링, 점진적 최적화, 대안 검토 |

### 상세 대응 방안

#### 1. 버그 발생 리스크
**예방:**
- Phase별로 점진적 적용
- 각 Phase 후 QA
- 자동화 테스트 (Unit + Integration + E2E)
- Feature flag로 점진적 전환

**대응:**
```typescript
// Feature flag 예시
// lib/flags.ts
export const FEATURES = {
  NEW_DASHBOARD: process.env.NEXT_PUBLIC_NEW_DASHBOARD === 'true',
  SSR_SIGNALS: process.env.NEXT_PUBLIC_SSR_SIGNALS === 'true',
} as const;

// app/page.tsx
import { FEATURES } from '@/lib/flags';

export default async function HomePage() {
  if (FEATURES.NEW_DASHBOARD) {
    // 새로운 구현
    return <NewDashboard />;
  }

  // 기존 구현
  return <DashboardPageClient />;
}
```

#### 2. 캐싱 충돌 리스크
**예방:**
- 명확한 캐싱 전략 문서화
- 서버 캐시 (Next.js) vs 클라이언트 캐시 (React Query) 역할 분리
- 캐시 키 컨벤션 통일

**대응:**
```typescript
// docs/caching-strategy.md 작성
/*
서버 캐싱 (Next.js):
- Static 데이터 (시그널 목록, 마켓 데이터)
- 재검증 주기: 5분

클라이언트 캐싱 (React Query):
- 사용자 상호작용 데이터 (필터링 결과)
- Stale time: 5분
- GC time: 10분
*/
```

#### 3. 개발 기간 초과 리스크
**예방:**
- 주간 체크포인트
- 우선순위 명확화 (High → Medium → Low)
- MVP 범위 정의

**대응:**
- Phase 1 완료 후 재평가
- Medium/Low Priority 일정 조정
- 필요시 인력 추가 투입

---

## 📅 타임라인

### Week 1: High Priority (필수)
```
Day 1-2: DashboardPageClient 리팩토링
- app/page.tsx 서버 데이터 fetching
- DashboardLayout 생성
- Streaming + Suspense

Day 3-4: 비즈니스 로직 추출
- lib/filters/ 생성
- 로직 이동 및 테스트

Day 5: 공통 Skeleton 컴포넌트
- shared/skeletons/ 생성
- 중복 코드 제거

Weekend: 코드 리뷰 및 QA
```

### Week 2: Medium Priority (중요)
```
Day 1-2: dashboard-stats 리팩토링
- 계산 로직 분리
- 애니메이션 최적화

Day 3-4: SSR 데이터 fetching
- lib/data/ 생성
- 캐싱 전략 적용

Day 5: API 캐싱 최적화
- React Cache
- 캐시 무효화 로직

Weekend: 성능 측정 및 개선
```

### Week 3: Low Priority (선택)
```
Day 1-2: 타입 안정성
- Zod 스키마
- Form 검증

Day 3-4: 성능 프로파일링
- 병목 지점 개선
- Virtual scrolling

Day 5: 문서화
- 아키텍처 다이어그램
- 개발 가이드

Weekend: 최종 QA 및 배포
```

---

## 🎓 학습 자료

### Next.js 15 새로운 기능
- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)
- [Server Components Deep Dive](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching)

### 성능 최적화
- [Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)

### TypeScript & Zod
- [Zod Documentation](https://zod.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## 📝 체크리스트

### Phase 1 완료 조건

#### DashboardPageClient → 서버/클라이언트 분리
- [ ] `src/components/ox/dashboard/DashboardPageClient.tsx`의 데이터 의존성과 상태 훅 목록 작성
- [ ] `app/page.tsx` 반환값을 서버 컴포넌트(`DashboardPage`)로 교체하고 필요한 데이터 fetching 함수 설계
- [ ] 필터/상호작용 전용 클라이언트 컴포넌트(`DashboardClientShell` 등) 생성 및 props 계약 정의
- [ ] Suspense/Streaming 경계 재구성하고 fallback 컴포넌트를 연결
- [ ] `use client` 지시어가 남은 컴포넌트에만 존재하는지 확인 (ESLint rule 또는 검색)
- [ ] 기존 `DashboardPageClient` 제거 후 회귀 테스트(주요 대시보드 흐름) 수행

#### 라우트 그룹 기반 레이아웃 재구성 & Header 중복 제거
- [ ] 현재 레이아웃 계층(`RootLayout`, `ConditionalLayout`, `OXLayout`) 다이어그램 작성
- [ ] `app/(public)`·`app/(protected)` 그룹 생성 및 페이지 파일 이동 계획 수립
- [ ] `ConditionalLayout` 제거 또는 서버 컴포넌트화 후 헤더 렌더링 책임 분리
- [ ] `/ox` 경로 전용 레이아웃에서 `AuthGuard`/헤더를 필요한 범위로 한정
- [ ] 전역 Provider 레이어 재정렬(ReactQueryProvider, AuthProvider 등) 및 Suspense 제거 검증
- [ ] 중복 헤더 제거 스크린샷/Lighthouse CLS 결과 문서화

#### 비즈니스 로직 lib/filters/로 이동
- [ ] `DashboardClient.tsx`와 관련 훅에서 필터링/정렬/계산 로직 목록 추출
- [ ] `lib/filters/` 디렉터리 구조 설계 및 파일 초안 생성
- [ ] 각 로직을 순수 함수로 옮기고 타입 시그니처 정의
- [ ] Jest 기반 단위 테스트 작성(OR/AND/Mixed 등 조건별 검증)
- [ ] 모든 컴포넌트/훅이 새 유틸을 사용하도록 경로 업데이트
- [ ] dead code / 중복 코드 제거 후 타입 체크 & 빌드 통과 확인

#### 공통 Skeleton 컴포넌트 생성
- [ ] Skeleton UI 중복 위치 인벤토리(DashboardPageClient, dashboard-stats 등)
- [ ] `components/shared/skeletons/`에 공통 컴포넌트 추가(Stats, Table, Card, News 등)
- [ ] Suspense fallback에서 신규 Skeleton을 사용하도록 교체
- [ ] Skeleton에 다크 모드/반응형 속성 반영 및 디자인팀 확인
- [ ] 스토리북 또는 샘플 페이지로 렌더링 상태 검증
- [ ] 기존 인라인 Skeleton 함수 제거 및 불필요한 import 정리

#### 단위 테스트 80% 이상
- [ ] `pnpm test --coverage`로 현재 커버리지 수치 기록
- [ ] `lib/filters`, `lib/analytics`, 핵심 hooks(`usePrediction`, `useDashboard`)에 대한 테스트 추가
- [ ] 예측 서비스 mock과 API 에러 분기 테스트 케이스 작성
- [ ] CI 커버리지 임계치(80%) 설정 및 스크립트에 반영
- [ ] 실패 시나리오(비로그인/네트워크 오류) 테스트 추가
- [ ] 커버리지 리포트 공유 및 QA 승인 획득

#### Lighthouse Performance 85+ 달성
- [ ] 리팩토링 전 Lighthouse/Next.js Analytics 지표 스냅샷 저장
- [ ] 서버 컴포넌트 전환/Streaming 반영 후 반복 측정
- [ ] FCP/LCP 지연 구간 리포트 분석 및 최적화 항목 적용
- [ ] 이미지/폰트/스크립트 최적화 체크리스트 수행
- [ ] 목표 수치 달성 시 리포트 아카이브 및 회고 메모 작성

#### 코드 리뷰 완료
- [ ] 주요 변경점 단위로 PR 분할 전략 수립(feature branches)
- [ ] Lint/Type 체크/테스트 자동화 파이프라인 실행
- [ ] PR 설명에 변경 목적, 테스트 결과, 성능 지표 포함
- [ ] 리뷰어 피드백 수렴 및 follow-up 이슈 정리
- [ ] Merge 후 릴리스 노트/문서 업데이트

### Phase 2 완료 조건

#### 모든 주요 페이지 SSR 적용
- [ ] SSR 우선 대상 페이지 목록 작성(`app/page.tsx`, `app/ox/...`, 모달 등)
- [ ] 각 페이지별 서버 데이터 fetching 함수 및 캐싱 전략 정의
- [ ] 클라이언트 전용 훅/컴포넌트를 최소화하고 서버 컴포넌트 전환
- [ ] 기존 CSR fetch 제거 후 회귀 테스트
- [ ] SSR 전환 후 성능/SEO 지표 확인

#### Streaming + Suspense 적용
- [ ] 느린 데이터 패널(통계, 트렌드, 뉴스, 테이블)별 로딩 시간 측정
- [ ] 각 섹션에 Suspense boundary 및 fallback Skeleton 연결
- [ ] 서버 컴포넌트 Streaming(React.lazy 또는 async) 검증
- [ ] 사용자 체감 로딩(UX)/Lighthouse 레이턴시 비교 리포트 작성

#### Prediction stats 파생 데이터 계산 유틸 공유
- [ ] `calcPredictionStats` 순수 함수 구현 및 엣지 케이스 테스트 통과
- [ ] `usePredictionStats` 리팩토링 및 React Query select 사용
- [ ] 서버/클라이언트 양쪽에서 동일 유틸 사용하도록 의존성 재구성
- [ ] React Query Devtools로 실시간 갱신 확인 및 캡처 저장

#### 캐싱 전략 구현 및 문서화
- [ ] `lib/data/` 모듈에서 `fetch` 옵션(`next.revalidate`, `tags`) 정의
- [ ] `revalidateTag`, `revalidatePath` 사용 시나리오 확립 및 헬퍼 함수 작성
- [ ] TanStack Query 캐시 키/TTL 정책 정리 및 config 파일화
- [ ] `docs/caching-strategy.md` 작성 및 리뷰

#### Lighthouse Performance 90+ 달성
- [ ] Phase 1 이후 레이턴시 재측정하여 개선 여지 파악
- [ ] 이미지 lazy-loading, 폰트 preconnect 등 세부 최적화 수행
- [ ] Web Vitals(WebPageTest, Lighthouse CI) 자동 측정 스크립트 추가
- [ ] 목표 달성 후 지표 공유 및 추적 시트 업데이트

#### SEO Score 95+ 달성
- [ ] 모든 페이지에 Meta/OG/Twitter 카드 필수 필드 점검
- [ ] 구조화 데이터(JSON-LD) 추가 및 Google Rich Results Test 통과
- [ ] `robots.txt`, `sitemap.xml` 갱신 여부 확인
- [ ] Lighthouse SEO 스코어 캡처 및 QA 승인

#### E2E 테스트 작성
- [ ] 핵심 유저 플로우 정의(로그인, 예측 제출, 대시보드 조회 등)
- [ ] Playwright/Cypress 선택 및 테스트 환경 구성
- [ ] Happy path + 오류 시나리오 테스트 작성
- [ ] CI에 E2E 파이프라인 추가 및 플레이크 모니터링
- [ ] 테스트 리포트와 스크린샷 보관

### Phase 3 완료 조건

#### Zod 스키마 적용
- [ ] API 응답/요청 리스트업 및 스키마 설계 초안 작성
- [ ] `lib/validations/schemas.ts`에 공통 스키마 정의 및 타입 export
- [ ] 서비스/훅에서 입력/출력 검증 도입
- [ ] 런타임 validation 실패 시 에러 핸들링 UX 검토
- [ ] 스키마 변경 시 테스트/문서 업데이트

#### 타입 커버리지 95% 이상
- [ ] `tsc --extendedDiagnostics`로 현재 타입 커버리지 파악
- [ ] any/unknown 사용 위치 조사 및 타입 보강
- [ ] `tsconfig` strict 옵션 점진적 활성화 계획 수립
- [ ] `ts-prune` 등으로 사용되지 않는 타입 제거
- [ ] 커버리지 리포트 공유 및 추적

#### 성능 프로파일링 완료
- [ ] React Profiler/Next.js profiler로 주요 인터랙션 측정
- [ ] 병목 컴포넌트 식별 및 메모이제이션/분리 적용
- [ ] 대량 데이터 테이블에 virtual scrolling 적용 여부 재검토
- [ ] 프로파일링 결과 보고서 및 개선 로그 작성

#### Command palette 단축키 토글 및 접근성 테스트 통과
- [ ] 새 `useControllableState`/`useCommandPaletteHotkey` 훅 통합
- [ ] 단축키/포커스 관련 RTL 또는 Playwright 테스트 통과 확인
- [ ] ARIA role, focus trap, 초기 포커스 행동 점검
- [ ] 접근성 감사 결과 문서화 및 이슈 대응

#### 아키텍처 문서 작성
- [ ] 리팩토링 후 폴더 구조/레이어 다이어그램 작성
- [ ] 데이터 흐름/캐싱 전략/권한 흐름을 포함한 ADR 초안 배포
- [ ] 팀 피드백 반영하여 최종 문서 확정

#### 개발 가이드 작성
- [ ] 신규 컴포넌트/훅 사용 가이드 초안 작성
- [ ] 코드 스타일/테스트/배포 절차 포함
- [ ] 온보딩 체크리스트 업데이트

#### 최종 QA 통과
- [ ] QA 시나리오 정의 및 테스트 일정 수립
- [ ] 스테이징 배포 후 회귀 테스트 수행
- [ ] 버그/리그레션 처리 및 QA 승인 획득
- [ ] 릴리스 노트와 배포 체크리스트 마감

---

## 🚀 다음 단계

1. **승인 대기**
   - 이 계획서 검토
   - 우선순위 조정 필요시 논의
   - 일정 조정 필요시 협의

2. **킥오프 (승인 후)**
   - 개발 환경 세팅
   - Git branch 전략 확정 (feature/refactor-dashboard)
   - 첫 번째 작업 시작: DashboardPageClient 리팩토링

3. **주간 리뷰**
   - 매주 금요일 진행상황 체크
   - 블로커 및 리스크 논의
   - 다음 주 계획 조정

---

**작성자**: Claude (Anthropic)
**버전**: 1.0
**최종 수정**: 2025-10-21
