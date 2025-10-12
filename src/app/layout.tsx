import Freesentation from "./fonts";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import Script from "next/script";
import { Suspense } from "react";
import { DashboardProvider } from "@/contexts/DashboardProvider";
import { AuthProvider } from "@/hooks/useAuth";
import GlobalAuthModal from "@/components/auth/GlobalAuthModal";
import { FloatingInfo } from "@/components/ox/layout/FloatingInfo";
import { Toaster } from "@/components/ui/sonner";
import { ConditionalLayout } from "@/components/ConditionalLayout";

import "../app/globals.css";
// export const metadata: Metadata = {
//   title: "Stock Predict AI LLM",
//   description: "Predict stock prices with AI models",
// };

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
        {/* Google Analytics - Only in production */}
        {process.env.NODE_ENV === "production" && (
          <>
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
          </>
        )}
        <Suspense>
          <ReactQueryProvider>
            <AuthProvider>
              <DashboardProvider>
                <ConditionalLayout>{safeChidren}</ConditionalLayout>
                {safeModal}
                <GlobalAuthModal />
                <FloatingInfo />
                <Toaster />
              </DashboardProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
