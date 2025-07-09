import type { Metadata } from "next";
import "@/styles/globals.css";
import Freesentation from "./fonts";
import Header from "@/components/header";
import { SignalSearchParamsProvider } from "@/hooks/useSignalSearchParams";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import Script from "next/script";
import { Suspense } from "react";

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
            <SignalSearchParamsProvider>
              <Header />
              {safeChidren}
              {safeModal}
            </SignalSearchParamsProvider>
          </ReactQueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
