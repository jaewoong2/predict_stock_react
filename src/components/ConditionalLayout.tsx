"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOxRoute = pathname?.startsWith("/ox");

  if (isOxRoute) {
    // /ox 경로에서는 헤더와 사이드바 없이 풀스크린
    return <main className="min-h-screen w-full">{children}</main>;
  }

  // 다른 경로에서는 헤더만 표시하고 전체 너비 사용
  return (
    <>
      <Header />
      <main className="min-h-screen w-full">{children}</main>
    </>
  );
}
