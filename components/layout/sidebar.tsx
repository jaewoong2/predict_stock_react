"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { usePointsBalance } from "@/hooks/usePoints";
import {
  BarChart3,
  TrendingUp,
  Coins,
  User,
  Menu,
  X,
  Home,
  Target,
  History,
  Settings,
  LineChart,
} from "lucide-react";

const navigation = [
  {
    name: "대시보드",
    href: "/ox/dashboard",
    icon: Home,
    description: "전체 현황 및 통계",
  },
  {
    name: "예측하기",
    href: "/ox/predict",
    icon: Target,
    description: "주식 O/X 예측",
  },
  {
    name: "예측 히스토리",
    href: "/ox/history",
    icon: History,
    description: "예측 기록 및 결과",
  },
  {
    name: "포인트",
    href: "/ox/points",
    icon: Coins,
    description: "포인트 관리",
  },
  {
    name: "통계",
    href: "/ox/stats",
    icon: BarChart3,
    description: "상세 통계 및 분석",
  },
  {
    name: "마켓 데이터",
    href: "/market",
    icon: LineChart,
    description: "시장 분석 대시보드",
  },
  {
    name: "프로필",
    href: "/ox/profile",
    icon: User,
    description: "개인 정보 및 설정",
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { data: pointsBalance } = usePointsBalance();

  return (
    <div
      className={cn(
        "bg-card flex flex-col border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-primary h-6 w-6" />
            <span className="font-semibold">O/X 예측</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed ? "px-2" : "px-3",
                  )}
                >
                  <item.icon
                    className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-3")}
                  />
                  {!collapsed && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {item.description}
                      </span>
                    </div>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Info */}
      {!collapsed && (
        <div className="border-t p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage alt={user?.nickname} />
              <AvatarFallback>
                {user?.nickname?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.nickname}</p>
              <div className="flex items-center space-x-1">
                <Coins className="h-3 w-3 text-yellow-500" />
                <span className="text-muted-foreground text-xs">
                  {pointsBalance?.balance?.toLocaleString() || 0} P
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed User Info */}
      {collapsed && (
        <div className="border-t p-2">
          <Avatar className="mx-auto h-8 w-8">
            <AvatarImage alt={user?.nickname} />
            <AvatarFallback>{user?.nickname?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
}
