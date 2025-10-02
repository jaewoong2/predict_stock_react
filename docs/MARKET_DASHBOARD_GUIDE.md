# 마켓 데이터 대시보드 사용 가이드

## 📍 위치

URL: `/market`

사이드바 메뉴에서 "마켓 데이터" 클릭

## 🎯 주요 기능

### 1. 시장 개요 카드 (Market Overview)
- **VIX 변동성 지수**: 현재 시장 변동성 수준을 한눈에 확인
  - 녹색(< 15): 낮은 변동성
  - 노란색(15-20): 보통
  - 빨간색(> 20): 높은 변동성
- **상승/하락 비율**: 시장 전반적인 분위기 파악
- **신고가 - 신저가**: 시장 모멘텀 확인

### 2. 애널리스트 목표가 (Analyst Price Targets)
- 주요 증권사의 목표가 변경 사항 실시간 확인
- 필터 기능:
  - 전체 / 상향 / 하향 / 신규 / 취소
- 영향도 점수(⭐)로 중요도 파악
- 증권사, 투자의견, 목표가 변경 이유 상세 표시

### 3. ETF 자금 흐름 (ETF Flows)
- ETF별 자금 유입/유출 현황 시각화
- 필터 옵션:
  - 전체 ETF
  - 섹터 ETF만 보기
- 차트로 상위 15개 ETF 흐름 확인
- 거래량 변화율, 섹터, 투자 테마 표시

### 4. 유동성 지표 (Liquidity)
- M2 통화량 추이 (파란색 실선)
- 역레포(RRP) 잔액 추이 (빨간색 점선)
- 최근 12주 데이터 차트
- AI 해석 코멘트 제공

### 5. 시장 폭 지표 (Market Breadth)
- **VIX 차트**: 변동성 추이 확인
- **상승/하락 종목 수**: 시장 참여도 파악
- **신고가/신저가**: 시장 강도 측정
- 최근 10일간 일별 데이터

### 6. 내부자 거래 트렌드 (Insider Trends)
- 임원/내부자들의 주식 거래 동향
- 필터 옵션:
  - 전체 / 매수 / 매도
- 대규모 거래($10M+) 하이라이트
- 신뢰도 점수로 신호 강도 확인
- SEC 서류 링크 제공

## 🔄 데이터 갱신

- 모든 데이터는 매일 자동 배치 작업으로 수집
- 미국 장 마감 후 업데이트 (동부시간 오후 6시 이후)
- 5분간 캐시 적용으로 빠른 로딩

## 🛠️ 기술 스택

### Frontend
- **UI Framework**: React 18 + Next.js 14
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts
- **Styling**: Tailwind CSS + shadcn/ui

### Architecture
```
src/
├── types/market-data.ts           # 타입 정의
├── services/marketDataService.ts  # API 호출 레이어
├── hooks/useMarketData.ts         # Custom Hooks
└── components/ox/dashboard/market/ # UI 컴포넌트
    ├── MarketDataDashboard.tsx
    ├── MarketOverviewCards.tsx
    ├── AnalystPriceTargetsWidget.tsx
    ├── ETFFlowsWidget.tsx
    ├── LiquidityWidget.tsx
    ├── MarketBreadthWidget.tsx
    └── InsiderTrendsWidget.tsx
```

## 📊 API 엔드포인트

모든 엔드포인트는 `docs/FRONTEND_API_GUIDE.md` 참조

- `GET /news/analyst-price-targets`
- `GET /news/etf/flows`
- `GET /news/liquidity`
- `GET /news/market-breadth`
- `GET /news/insider-trend`
- `GET /news/etf/portfolio`

## 🎨 UI/UX 특징

- **다크모드 지원**: 자동 테마 전환
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **스켈레톤 UI**: 로딩 중 깜빡임 없는 부드러운 전환
- **인터랙티브 차트**: Hover로 상세 정보 확인
- **실시간 필터링**: 즉각적인 데이터 필터링

## 💡 사용 팁

1. **VIX 지수 활용**: VIX가 20 이상이면 변동성 장세, 방어적 전략 고려
2. **ETF 흐름 해석**: 대규모 유입/유출은 섹터 트렌드 변화 신호
3. **내부자 거래 주목**: 임원 매수는 긍정 신호, 특히 대규모 거래
4. **목표가 상향 주목**: 여러 증권사의 동시 상향은 강한 매수 신호
5. **시장 폭 확인**: 상승 종목 > 하락 종목이면 건강한 시장

## 🐛 문제 해결

### 데이터가 로딩되지 않을 때
1. 네트워크 연결 확인
2. API 서버 상태 확인 (백엔드 팀에 문의)
3. 브라우저 콘솔에서 에러 메시지 확인

### 날짜 불일치 경고
- 요청한 날짜의 데이터가 없으면 가장 가까운 이전 날짜 데이터 표시
- 주말/공휴일에는 최근 거래일 데이터 반환

## 📞 문의

- **기술 지원**: dev@your-domain.com
- **버그 리포트**: GitHub Issues
- **API 문서**: `docs/FRONTEND_API_GUIDE.md`

---

**작성일**: 2025-10-02
**버전**: 1.0.0

