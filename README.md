# 밤톨이 (Bamtoly) 🌰

> AI 기반 미국 주식 예측 및 분석 플랫폼

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

## 📌 서비스 소개

**밤톨이**는 AI 기술을 활용하여 미국 주식 시장을 분석하고 예측하는 인터랙티브 투자 플랫폼입니다. 게임화된 예측 시스템을 통해 사용자들이 주식 시장에 대한 인사이트를 공유하고, 실시간 시장 데이터와 AI 분석을 기반으로 투자 의사결정을 지원합니다.

### 🎯 핵심 가치

- **게임화된 학습**: 주식 예측을 게임처럼 즐기면서 시장 감각을 키울 수 있습니다
- **AI 기반 인사이트**: 머신러닝 모델을 통한 시장 분석과 투자 신호 제공
- **실시간 데이터**: 미국 주식 시장의 실시간 데이터와 뉴스 제공
- **커뮤니티 트렌드**: 다른 투자자들의 예측 트렌드를 확인하고 시장 심리 파악

---

## 🌟 주요 기능

### 1. 📊 대시보드 (Dashboard)
- **실시간 시장 개요**: 주요 지수(S&P500, NASDAQ, DOW)의 실시간 움직임
- **AI 투자 신호**: 머신러닝 모델이 생성한 매수/매도 시그널
- **시장 뉴스 & 전망**: 최신 시장 뉴스와 전문가 분석
- **예측 트렌드**: 커뮤니티의 실시간 예측 동향 및 인기 종목

### 2. 🎯 O/X 예측 시스템
- **종목 예측**: 미국 주식 100개 종목에 대해 일일 상승/하락 예측
- **포인트 시스템**: 정확한 예측 시 포인트 획득
- **예측 히스토리**: 나의 예측 기록과 정확도 추적
- **실시간 랭킹**: 다른 사용자들과 예측 실력 겨루기

### 3. 📰 뉴스 & 마켓 인사이트
- **큐레이션된 뉴스**: 주요 종목 관련 뉴스 자동 필터링
- **AI 뉴스 분석**: 뉴스 콘텐츠의 감정 분석 및 영향도 평가
- **티커별 뉴스**: 관심 종목의 최신 뉴스 실시간 업데이트
- **시장 리포트**: 일일/주간 시장 분석 리포트

### 4. 💰 포인트 & 리워드
- **포인트 획득**: 정확한 예측, 로그인 보너스 등으로 포인트 적립
- **리워드 교환**: 포인트로 다양한 리워드 교환
- **거래 내역**: 포인트 획득/사용 내역 투명하게 관리
- **통계 대시보드**: 포인트 획득 추이 및 성과 분석

### 5. 📈 투자 신호 (Signals)
- **AI 모델 예측**: 다양한 AI 모델의 주식 예측 결과
- **전략별 필터링**: 모멘텀, 가치투자, 성장주 등 전략별 신호
- **상세 분석**: 각 종목의 기술적 지표와 펀더멘털 분석
- **백테스팅 결과**: AI 모델의 과거 성과 및 정확도

### 6. 👤 프로필 & 통계
- **사용자 통계**: 예측 정확도, 획득 포인트, 랭킹 등
- **예측 히스토리**: 과거 예측 기록 및 결과 분석
- **계정 설정**: 프로필 관리 및 알림 설정
- **성과 분석**: 시간대별, 종목별 예측 성과 리뷰

---

## 🏗️ 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router, Server Components)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4, Radix UI
- **Animation**: Framer Motion, React Spring
- **State Management**: Jotai, React Query (TanStack Query)
- **Charts**: Recharts
- **Form**: React Hook Form + Zod

### Data & API
- **API Client**: Axios
- **Data Fetching**: TanStack Query (React Query)
- **Real-time Data**: REST API with polling
- **Authentication**: JWT (Cookie-based)

### UI/UX
- **Design System**: shadcn/ui, Radix UI
- **Icons**: Lucide React, React Icons
- **Toast Notifications**: Sonner
- **Themes**: next-themes (Dark Mode)
- **Responsive**: Mobile-first design

### Deployment & Infrastructure
- **Hosting**: AWS ECS (Fargate)
- **Container**: Docker
- **CDN**: AWS CloudFront
- **Database**: PostgreSQL (Backend)
- **Infrastructure as Code**: Terraform

---

## 📂 프로젝트 구조

```
predict_stock_react/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 메인 대시보드
│   │   ├── ox/                # O/X 예측 시스템
│   │   │   ├── home/          # 홈 페이지
│   │   │   ├── predict/       # 예측 페이지
│   │   │   ├── news/          # 뉴스 페이지
│   │   │   ├── points/        # 포인트 관리
│   │   │   ├── rewards/       # 리워드 카탈로그
│   │   │   ├── profile/       # 사용자 프로필
│   │   │   └── dashboard/     # O/X 대시보드
│   │   ├── legacy/            # 레거시 시그널 페이지
│   │   └── @modal/            # 인터셉트 라우팅 모달
│   ├── components/            # React 컴포넌트
│   │   ├── ox/                # O/X 시스템 컴포넌트
│   │   ├── dashboard/         # 대시보드 컴포넌트
│   │   ├── signal/            # 투자 신호 컴포넌트
│   │   ├── news/              # 뉴스 컴포넌트
│   │   ├── ui/                # 재사용 가능한 UI 컴포넌트
│   │   └── auth/              # 인증 관련 컴포넌트
│   ├── services/              # API 서비스 레이어
│   │   ├── predictionService.ts   # 예측 API
│   │   ├── newsService.ts         # 뉴스 API
│   │   ├── signalService.ts       # 신호 API
│   │   ├── pointService.ts        # 포인트 API
│   │   ├── rewardService.ts       # 리워드 API
│   │   └── authService.ts         # 인증 API
│   ├── types/                 # TypeScript 타입 정의
│   ├── hooks/                 # Custom React Hooks
│   ├── contexts/              # React Context
│   └── lib/                   # 유틸리티 함수
├── public/                    # 정적 파일
├── terraform/                 # AWS 인프라 코드
├── .github/                   # GitHub Actions CI/CD
└── docker/                    # Docker 설정
```

---

## 🚀 시작하기

### Prerequisites

- Node.js 20 이상
- npm, yarn, pnpm 중 하나
- 환경 변수 설정 필요

### Installation

```bash
# 저장소 클론
git clone https://github.com/your-username/predict_stock_react.git
cd predict_stock_react

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 필요한 환경 변수 설정

# 개발 서버 실행
npm run dev
```

### 환경 변수

```env
# API Endpoints
NEXT_PUBLIC_API_BASE_URL=https://ai-api.bamtoly.com/
NEXT_PUBLIC_OX_API_BASE_URL=https://ox-universe.bamtoly.com/

# Image CDN
NEXT_PUBLIC_IMAGE_URL=https://ai.bamtoly.com/static

# AWS (배포 시)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-northeast-2
AWS_BUCKET_NAME=your_bucket_name
```

### 개발 서버

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

---

## 🏭 빌드 & 배포

### Production Build

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### Docker

```bash
# Docker 이미지 빌드
docker build -t predict-stock-react .

# 컨테이너 실행
docker run -p 3000:3000 predict-stock-react
```

### AWS ECS Deployment

Terraform을 사용한 인프라 배포:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

---

## 🎨 주요 특징

### ⚡ 성능 최적화
- **Server-Side Rendering (SSR)**: 초기 로딩 속도 최적화
- **Incremental Static Regeneration (ISR)**: 정적 페이지 점진적 재생성
- **Code Splitting**: 페이지별 코드 분할로 번들 사이즈 최소화
- **Image Optimization**: Next.js Image 컴포넌트 활용

### 🎭 사용자 경험
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 대응
- **다크 모드**: 시스템 설정에 따른 자동 테마 전환
- **애니메이션**: Framer Motion을 활용한 부드러운 인터랙션
- **실시간 업데이트**: React Query로 데이터 자동 동기화

### 🔒 보안
- **JWT 인증**: 쿠키 기반 안전한 인증 시스템
- **XSS 방지**: 입력 데이터 검증 및 sanitization
- **HTTPS**: 프로덕션 환경 SSL/TLS 적용
- **Rate Limiting**: API 요청 제한으로 남용 방지

---

## 📊 데이터 소스

- **주식 가격**: 실시간 미국 주식 시장 데이터
- **뉴스**: 주요 금융 뉴스 API 통합
- **AI 분석**: 자체 개발 머신러닝 모델
- **기술적 지표**: 실시간 계산된 기술적 분석 지표

---

## 🤝 기여하기

기여를 환영합니다! 다음 절차를 따라주세요:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 라이선스

이 프로젝트는 개인 학습 및 포트폴리오 목적으로 제작되었습니다.

---

## 📞 연락처

- **Website**: [https://ai.bamtoly.com](https://ai.bamtoly.com)
- **Email**: contact@bamtoly.com

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 라이브러리를 사용합니다:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 📈 로드맵

- [ ] 실시간 WebSocket 데이터 스트리밍
- [ ] 포트폴리오 추적 기능
- [ ] 소셜 기능 (팔로우, 피드)
- [ ] 모바일 앱 (React Native)
- [ ] 다국어 지원 (i18n)
- [ ] 고급 차트 분석 도구
- [ ] 커뮤니티 토론 게시판
- [ ] 교육 컨텐츠 & 튜토리얼

---

**Made with ❤️ by Bamtoly Team**
