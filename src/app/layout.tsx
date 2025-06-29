import type { Metadata } from "next";
import "@/styles/globals.css";
import Freesentation from "./fonts";
import Header from "@/components/header";
import { SignalSearchParamsProvider } from "@/hooks/useSignalSearchParams";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { Suspense } from "react";

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
        <Suspense>
          <ReactQueryProvider>
            <SignalSearchParamsProvider>
              <Header />
              {children}
            </SignalSearchParamsProvider>
          </ReactQueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
