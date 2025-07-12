This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# bamtoly

Next.js는 페이지별로 다른 렌더링 및 캐싱 전략을 적용할 수 있어 유연한 최적화가 가능합니다. 주요 전략은 다음과 같습니다.

1.  정적 사이트 생성 (SSG - Static Site Generation): 빌드 시점에 페이지를 HTML로 미리 생성합니다. 블로그 게시물, 문서, 마케팅 페이지처럼 내용이 거의 변경되지 않는 페이지에
    이상적입니다.
2.  서버 사이드 렌더링 (SSR - Server-Side Rendering): 매 요청마다 서버에서 페이지를 렌더링합니다. 사용자 대시보드, 계정 설정 등 항상 최신 데이터를 보여줘야 하는 페이지에
    적합합니다.
3.  점진적 정적 재 생성 (ISR - Incremental Static Regeneration): 빌드 시점에 페이지를 생성하고, 설정된 주기마다 백그라운드에서 페이지를 다시 생성하여 업데이트합니다. 뉴스 피드,
    주요 주식 목록처럼 주기적으로 데이터가 변경되는 페이지에 효과적입니다.

현재 프로젝트 구조를 바탕으로 다음과 같은 최적화 방안을 제안합니다.

최적화 계획

1.  메인 대시보드 (`/dashboard`): 이 페이지는 여러 주식 정보를 보여주므로, 데이터가 주기적으로 업데이트되어야 합니다. ISR을 적용하여 성능과 데이터 최신성을 모두 확보하는 것이
    좋습니다. 예를 들어 5분마다 데이터를 갱신하도록 설정할 수 있습니다.
2.  개별 주식 상세 페이지 (`/dashboard/d/[symbol]`):
    - ISR 적용: 개별 주식 데이터 역시 실시간일 필요는 없으므로, ISR을 적용해 주기적으로 업데이트합니다.
    - `generateStaticParams` 활용: AAPL, GOOGL 등 인기 있는 주식 페이지는 빌드 시점에 미리 생성(SSG)하여 매우 빠른 로딩 속도를 제공하고, 그 외 주식은 사용자가 처음 접속했을 때
      생성하도록 합니다.
3.  API 서비스 (`/src/services/*.ts`): 데이터 호출 부분의 캐싱 전략은 페이지 컴포넌트에서 fetch를 호출할 때 옵션으로 제어하게 됩니다. 따라서 서비스 파일 자체를 수정할 필요는
    없습니다.
4.  컴포넌트 지연 로딩: DashboardClient.tsx와 같이 무거운 클라이언트 컴포넌트는 next/dynamic을 사용하여 필요할 때만 로드하도록 하여 초기 로딩 속도를 개선할 수 있습니다.

어떤 최적화부터 진행할까요? 가장 효과가 클 것으로 예상되는 메인 대시보드(`/dashboard`)에 ISR을 적용하는 것부터 시작하는 것을 추천합니다.
