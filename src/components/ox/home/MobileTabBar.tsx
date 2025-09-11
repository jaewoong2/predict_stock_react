"use client";

import Link from "next/link";
import { Home, Compass, Sparkles, Coins, User } from "lucide-react";
import { usePathname } from "next/navigation";

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
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-white/90 py-2 backdrop-blur dark:bg-black/60 md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <li key={href} className="text-center">
              <Link href={href} className="inline-flex flex-col items-center text-xs">
                <Icon className={`mb-1 h-5 w-5 ${active ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}`} />
                <span className={active ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

