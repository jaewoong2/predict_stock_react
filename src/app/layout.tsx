import type { Metadata } from "next";
import "@/styles/globals.css";
import Freesentation from "./fonts";
import Header from "@/components/header";
import Sidebar from "@/components/navigation/Sidebar";
import { SignalSearchParamsProvider } from "@/hooks/useSignalSearchParams";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import Script from "next/script";
import { Suspense } from "react";
import { DashboardProvider } from "@/contexts/DashboardProvider";
import { AuthProvider } from "@/hooks/useAuth";
import GlobalLoginModal from "@/components/auth/GlobalLoginModal";
import GlobalAuthModal from "@/components/auth/GlobalAuthModal";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Stock Predict AI LLM",
  description: "Predict stock prices with AI models",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  // modal이 NaN인지 확인하고 처리
  const safeChidren =
    typeof children === "object" && children !== null ? children : null;

  const safeModal = typeof modal === "object" && modal !== null ? modal : null;

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={Freesentation.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GFEX2C3MBB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GFEX2C3MBB');
          `}
        </Script>
        <Suspense>
          <ReactQueryProvider>
            <AuthProvider>
              <SignalSearchParamsProvider>
                <DashboardProvider>
                  <Header />
                  <div className="flex min-h-screen">
                    <Sidebar />
                    <main className="w-full flex-1">{safeChidren}</main>
                  </div>
                  {safeModal}
                  {/* URL 파라미터(login=1) 트리거 + 전역 인증 상태 트리거 모두 지원 */}
                  <GlobalLoginModal />
                  <GlobalAuthModal />
                  <Toaster />
                </DashboardProvider>
              </SignalSearchParamsProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
