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
      {/* Glass morphism background */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
        {/* Safe area padding for iOS */}
        <div className="pb-safe">
          <ul className="mx-auto grid max-w-md grid-cols-5 px-2 py-1">
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname?.startsWith(href);
              return (
                <li key={href} className="flex justify-center">
                  <Link 
                    href={href} 
                    className={cn(
                      "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 active:scale-95",
                      active 
                        ? "bg-blue-600 text-white shadow-lg" 
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{label}</span>
                    
                    {/* Active indicator dot */}
                    {active && (
                      <div className="absolute -top-1 h-1 w-1 rounded-full bg-white" />
                    )}
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

