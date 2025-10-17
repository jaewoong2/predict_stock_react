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
import { Bell, Settings, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, logout, isAuthenticated, showLogin } = useAuth();
  const { data: session } = useTodaySession();
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
        {/* Empty left section or logo */}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
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
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button onClick={showLogin} variant="default">
            로그인
          </Button>
        )}
      </div>
    </header>
  );
}
