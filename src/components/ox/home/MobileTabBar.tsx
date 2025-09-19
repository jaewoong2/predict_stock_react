"use client";

import Link from "next/link";
import { Home, Compass, Sparkles, Coins, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MobileTabBar() {
  const pathname = usePathname();
  const items = [
    { href: "/ox/home", label: "홈", icon: Home },
    { href: "/ox/dashboard", label: "발견", icon: Compass },
    { href: "/ox/predict", label: "예측", icon: Sparkles },
    { href: "/ox/points", label: "포인트", icon: Coins },
    { href: "/ox/profile", label: "프로필", icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div className="bg-white/95 backdrop-blur-sm dark:bg-[#0f1118]/95">
        <div className="pb-safe">
          <ul className="mx-auto grid max-w-md grid-cols-5 px-2 py-1">
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname?.startsWith(href);
              return (
                <li key={href} className="flex justify-center">
                  <Link 
                    href={href} 
                    className={cn(
                      "relative flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 transition-colors",
                      active 
                        ? "bg-slate-100 text-[#2b6ef2] dark:bg-[#1a2030] dark:text-slate-100"
                        : "hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#1a2030] dark:text-slate-400"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
