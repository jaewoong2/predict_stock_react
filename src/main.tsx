// filepath: src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import Header from "./components/header";
import { SignalSearchParamsProvider } from "./hooks/useSignalSearchParams";
import ReactGA from "react-ga4";
// 쿼리 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분
    },
  },
});

ReactGA.initialize("G-GFEX2C3MBB");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SignalSearchParamsProvider>
          <Header />
          <App />
        </SignalSearchParamsProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
