"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen w-full">{children}</main>
    </>
  );
}
