"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useTodaySession } from "@/hooks/useSession";
import { usePointsBalance } from "@/hooks/usePoints";
import { Bell, Settings, LogOut, User, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, logout } = useAuth();
  const { data: session } = useTodaySession();
  const { data: pointsBalance } = usePointsBalance();
  const [hiddenOnScroll, setHiddenOnScroll] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () =>
      setHiddenOnScroll((window.scrollY || window.pageYOffset) > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getSessionStatusColor = () => {
    if (!session) return "bg-gray-500";
    switch (session.session?.phase) {
      case "OPEN":
        return "bg-green-500";
      case "CLOSED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSessionStatusText = () => {
    if (!session || !session.session) return "로딩 중...";
    switch (session.session.phase) {
      case "OPEN":
        return "예측 가능";
      case "CLOSED":
        return "예측 마감";
      default:
        return "알 수 없음";
    }
  };

  return (
    <header
      className={cn(
        "bg-background flex items-center justify-between border-b px-6 transition-all duration-200",
        hiddenOnScroll
          ? "pointer-events-none h-0 -translate-y-2 overflow-hidden opacity-0"
          : "h-16 translate-y-0 opacity-100",
      )}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "h-2 w-2 animate-pulse rounded-full",
                getSessionStatusColor(),
              )}
            />
            <span className="text-sm font-medium">세션 상태</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {getSessionStatusText()}
          </Badge>
        </div>

        {session?.session?.trading_day && (
          <div className="text-muted-foreground text-sm">
            거래일: {session.session.trading_day}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Points Display */}
        <div className="bg-muted flex items-center space-x-2 rounded-md px-3 py-1">
          <Coins className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium">
            {pointsBalance?.balance?.toLocaleString() || 0} P
          </span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.nickname?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">
                  {user?.nickname}
                </p>
                <p className="text-muted-foreground text-xs leading-none">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>프로필</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>설정</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
