"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Sidebar from "@/components/navigation/Sidebar";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOxRoute = pathname?.startsWith("/ox");

  if (isOxRoute) {
    // /ox 경로에서는 헤더와 사이드바 없이 풀스크린
    return <main className="min-h-screen w-full">{children}</main>;
  }

  // 다른 경로에서는 기존 레이아웃 유지
  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="w-full flex-1 lg:ml-[96px]">{children}</main>
      </div>
    </>
  );
}
