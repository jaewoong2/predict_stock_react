# 예측 트렌드 API 스펙 (롱/숏 예측 통계)

## 📝 한눈에 보기 (백엔드 팀용)

### 구현 필요 사항
- **엔드포인트**: `GET /api/ox/predictions/direction-stats`
- **기능**: 특정 날짜의 롱/숏 예측 횟수 TOP N 종목 반환
- **필수 반환 필드**: `ticker`, `count`
- **선택 반환 필드**: `winRate`, `avgProfit`, `companyName`, `lastPrice`, `changePercent`

### 핵심 쿼리 로직
```sql
-- 롱 예측 많은 종목
SELECT ticker, COUNT(*) as count
FROM predictions
WHERE trading_day = ? AND prediction_direction = 'LONG' AND prediction_status != 'CANCELLED'
GROUP BY ticker ORDER BY count DESC LIMIT ?;

-- 숏 예측 많은 종목 (동일한 로직, direction만 'SHORT')
```

### 주의사항
⚠️ "확률 높은 종목" 기능은 **별도 기존 API**를 사용합니다. 이 API에서는 구현하지 않아도 됩니다!

---

## 개요

대시보드에서 사용자 참여를 유도하기 위한 **롱/숏 예측 통계 데이터**를 제공하는 API입니다.

> **참고**: "확률 높은 종목" 데이터는 별도의 기존 API를 사용합니다. 이 API는 **롱/숏 예측 횟수 통계만** 제공합니다.

## 엔드포인트

### GET `/api/ox/predictions/direction-stats`

롱/숏 예측 횟수 통계를 반환합니다.

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `date` | string | No | 오늘 날짜 | 조회할 날짜 (YYYY-MM-DD) |
| `limit` | number | No | 5 | 각 카테고리별 최대 종목 수 (1-10) |

#### Request Example

```bash
GET /api/ox/predictions/direction-stats?date=2025-10-02&limit=5
```

#### Response Schema

```typescript
{
  // 롱 예측이 가장 많은 종목 TOP N
  "mostLongPredictions": [
    {
      "ticker": "NVDA",              // 티커 심볼
      "companyName": "NVIDIA",       // 회사명 (optional)
      "count": 1234,                 // 롱 예측 횟수
      "winRate": 68.5,               // 승률 % (optional)
      "avgProfit": 12.3,             // 평균 수익률 % (optional)
      "lastPrice": 875.32,           // 최신 가격 (optional)
      "changePercent": 2.4           // 변동률 % (optional)
    }
  ],
  
  // 숏 예측이 가장 많은 종목 TOP N
  "mostShortPredictions": [
    {
      "ticker": "META",              // 티커 심볼
      "companyName": "Meta",         // 회사명 (optional)
      "count": 692,                  // 숏 예측 횟수
      "winRate": 58.3,               // 승률 % (optional)
      "avgProfit": -4.2,             // 평균 수익률 % (optional)
      "lastPrice": 485.91,           // 최신 가격 (optional)
      "changePercent": -0.5          // 변동률 % (optional)
    }
  ],
  
  // 데이터 업데이트 시간
  "updatedAt": "2025-10-02T14:30:00Z"
}
```

#### Response Example

```json
{
  "mostLongPredictions": [
    {
      "ticker": "NVDA",
      "companyName": "NVIDIA",
      "count": 1234,
      "winRate": 68.5,
      "avgProfit": 12.3,
      "lastPrice": 875.32,
      "changePercent": 2.4
    },
    {
      "ticker": "TSLA",
      "companyName": "Tesla",
      "count": 987,
      "winRate": 62.1,
      "avgProfit": 8.7,
      "lastPrice": 245.67,
      "changePercent": -1.2
    },
    {
      "ticker": "AAPL",
      "companyName": "Apple",
      "count": 856,
      "winRate": 71.3,
      "avgProfit": 5.4,
      "lastPrice": 178.45,
      "changePercent": 0.8
    },
    {
      "ticker": "MSFT",
      "companyName": "Microsoft",
      "count": 743,
      "winRate": 69.8,
      "avgProfit": 7.2,
      "lastPrice": 405.23,
      "changePercent": 1.5
    },
    {
      "ticker": "GOOGL",
      "companyName": "Alphabet",
      "count": 621,
      "winRate": 65.4,
      "avgProfit": 6.1,
      "lastPrice": 142.89,
      "changePercent": 1.1
    }
  ],
  "mostShortPredictions": [
    {
      "ticker": "META",
      "companyName": "Meta",
      "count": 692,
      "winRate": 58.3,
      "avgProfit": -4.2,
      "lastPrice": 485.91,
      "changePercent": -0.5
    },
    {
      "ticker": "NFLX",
      "companyName": "Netflix",
      "count": 534,
      "winRate": 61.7,
      "avgProfit": -3.8,
      "lastPrice": 512.34,
      "changePercent": -2.1
    },
    {
      "ticker": "COIN",
      "companyName": "Coinbase",
      "count": 487,
      "winRate": 64.2,
      "avgProfit": -5.6,
      "lastPrice": 198.76,
      "changePercent": -3.4
    },
    {
      "ticker": "SHOP",
      "companyName": "Shopify",
      "count": 423,
      "winRate": 59.1,
      "avgProfit": -4.1,
      "lastPrice": 67.89,
      "changePercent": -1.8
    },
    {
      "ticker": "UBER",
      "companyName": "Uber",
      "count": 398,
      "winRate": 62.5,
      "avgProfit": -3.5,
      "lastPrice": 72.45,
      "changePercent": -0.9
    }
  ],
  "updatedAt": "2025-10-02T14:30:00Z"
}
```

#### HTTP Status Codes

| Status Code | 설명 |
|-------------|------|
| 200 | 성공 |
| 400 | 잘못된 요청 (날짜 형식 오류, limit 범위 초과 등) |
| 401 | 인증 필요 |
| 500 | 서버 오류 |

#### Error Response Example

```json
{
  "error": {
    "code": "INVALID_DATE_FORMAT",
    "message": "날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식을 사용하세요.",
    "details": {
      "provided": "2025-13-45",
      "expected": "YYYY-MM-DD"
    }
  }
}
```

## 데이터 계산 로직 제안

### 1. 롱/숏 예측 많은 종목

**정렬 기준:** 해당 방향의 예측 횟수가 많은 순

**SQL 예시:**
```sql
-- 롱 예측 많은 종목 TOP N
SELECT 
  ticker,
  COUNT(*) as count
FROM predictions
WHERE trading_day = '2025-10-02'
  AND prediction_direction = 'LONG'
  AND prediction_status != 'CANCELLED'
GROUP BY ticker
ORDER BY count DESC
LIMIT 5;

-- 숏 예측 많은 종목 TOP N
SELECT 
  ticker,
  COUNT(*) as count
FROM predictions
WHERE trading_day = '2025-10-02'
  AND prediction_direction = 'SHORT'
  AND prediction_status != 'CANCELLED'
GROUP BY ticker
ORDER BY count DESC
LIMIT 5;
```

### 2. 승률 계산 (winRate)

```
승률 = (성공한 예측 수 / 완료된 예측 수) × 100

- 성공: 예측 방향과 실제 가격 변동 방향이 일치
- 완료: 정산이 완료된 예측만 계산
```

### 3. 평균 수익률 (avgProfit)

```
평균 수익률 = Σ(개별 예측 수익률) / 완료된 예측 수

- 롱 예측 수익률 = ((종가 - 시가) / 시가) × 100
- 숏 예측 수익률 = ((시가 - 종가) / 시가) × 100
```

## 캐싱 권장사항

- **캐시 TTL:** 5분 (실시간성과 서버 부하 균형)
- **캐시 키:** `prediction_direction_stats:{date}:{limit}`
- **무효화:** 새로운 예측이 생성될 때마다

## 성능 고려사항

1. **인덱스 추천**
   - `(trading_day, prediction_direction, ticker)` 복합 인덱스
   - `(ticker, created_at)` 인덱스
   - `(prediction_status, settled_at)` 인덱스 (승률/수익률 계산용)

2. **쿼리 최적화**
   - 각 카테고리별 쿼리를 병렬로 실행
   - 집계 쿼리에 윈도우 함수 활용

3. **데이터 양 제한**
   - 기본 limit=5, 최대 limit=10으로 제한
   - 특정 기간(예: 최근 30일) 데이터만 집계

## 추가 고려사항

### Optional 필드 우선순위

1. **필수 구현**
   - `ticker`, `count`

2. **Phase 2 (권장)**
   - `winRate`, `avgProfit` - 사용자 참여 유도에 중요

3. **Phase 3 (선택)**
   - `companyName`, `lastPrice`, `changePercent` - 외부 API 연동 필요

### 실시간 업데이트

WebSocket 또는 Server-Sent Events를 통해 실시간 업데이트를 제공할 수 있습니다.

```typescript
// WebSocket 이벤트 예시
{
  "type": "PREDICTION_TRENDS_UPDATE",
  "data": {
    // 위와 동일한 응답 스키마
  }
}
```

## API 분리 구조

### 1. 확률 높은 종목 (별도 API 사용)
- 기존 API 사용 (예측 확률 계산 로직 포함)
- 프론트엔드에서 별도로 호출

### 2. 롱/숏 예측 통계 (신규 API)
- 이 문서에서 정의하는 `/api/ox/predictions/direction-stats` 사용
- 단순 카운트 기반 통계

## 프론트엔드 구현 상태

✅ **완료됨**
- TypeScript 타입 정의 (`src/types/prediction-trends.ts`)
- UI 컴포넌트 (`src/components/ox/dashboard/TrendingPredictionsWidget.tsx`)
- 대시보드 통합 (`src/app/ox/dashboard/page.tsx`)
- Mock 데이터를 사용한 UI 테스트

**다음 단계:** 
1. 백엔드에서 `/api/ox/predictions/direction-stats` API 구현
2. "확률 높은 종목" 기존 API 엔드포인트 확인 및 연동
3. 프론트엔드에서 두 API를 각각 호출하여 통합

## 참고사항

- 현재는 Mock 데이터로 동작 중입니다.
- API 엔드포인트가 준비되면 `src/services/` 에 서비스 함수 추가 필요
- React Query를 사용한 데이터 페칭 구현 예정

