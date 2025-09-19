"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, TrendingUp, FileText, BarChart3, Target } from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "OX",
    href: "/ox/dashboard",
    icon: Target,
  },
  {
    name: "ETF",
    href: "/etf",
    icon: TrendingUp,
  },
  {
    name: "Issue",
    href: "/research",
    icon: FileText,
  },
  {
    name: "Market",
    href: "/market",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:w-fit lg:flex-col lg:fixed lg:h-screen lg:z-10">
      <div className="flex flex-grow flex-col border-r border-gray-200 bg-white pt-4 pb-4">
        <nav className="flex-1 space-y-1 px-2">
          {navigationItems.map((item) => {
            const isActive = item.href === "/ox/dashboard" 
              ? pathname.startsWith("/ox")
              : pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex flex-col items-center gap-2 rounded-md p-3 text-sm font-medium",
                  isActive
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500",
                  )}
                />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
