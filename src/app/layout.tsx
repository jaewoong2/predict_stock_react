import type { Metadata } from "next";
import "@/styles/globals.css";
import Freesentation from "./fonts";
import Header from "@/components/header";
import { SignalSearchParamsProvider } from "@/hooks/useSignalSearchParams";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Stock Predict AI LLM",
  description: "Predict stock prices with AI models",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

        <ReactQueryProvider>
          <SignalSearchParamsProvider>
            <Header />
            {children}
          </SignalSearchParamsProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
