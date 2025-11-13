"use client";
import { useState, useEffect } from "react";
import { Moon, Sun, LogOut, User, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateNavigation } from "@/components/ui/date-navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { FundamentalSearchModal } from "@/components/ox/layout/FundamentalSearchModal";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFundamentalModalOpen, setIsFundamentalModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, isAuthenticated, showLogin } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const paramDate = new Date(dateParam);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      paramDate.setHours(0, 0, 0, 0);

      // If future date, use today
      return paramDate > today ? new Date() : paramDate;
    }
    return new Date();
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const paramDate = new Date(dateParam);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      paramDate.setHours(0, 0, 0, 0);

      // If future date in URL, redirect to today
      if (paramDate > today) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("date", format(new Date(), "yyyy-MM-dd"));
        router.replace(`?${params.toString()}`);
        setSelectedDate(new Date());
      } else {
        setSelectedDate(paramDate);
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleDateChange = (date: Date) => {
    // Prevent future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    const finalDate = selectedDay > today ? new Date() : date;

    setSelectedDate(finalDate);
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", format(finalDate, "yyyy-MM-dd"));
    router.push(`?${params.toString()}`);
  };

  if (!mounted) {
    return null; // Prevents hydration mismatch
  }

  return (
    <>
      <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <nav className="flex h-16 w-full items-center px-6">
          {/* Left Section - Logo */}
          <div className="flex flex-1 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-700 to-orange-400 text-lg font-bold text-white">
                B
              </div>
              <span className="hidden text-xl font-bold sm:inline-block">
                밤톨이
              </span>
            </Link>
          </div>

          {/* Center Section - Date Navigation */}
          <div className="flex flex-1 items-center justify-center max-lg:hidden">
            <DateNavigation
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              showCalendar={true}
            />
          </div>

          {/* Right Section - Search, Theme Toggle & User Menu */}
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFundamentalModalOpen(true)}
              className="cursor-pointer"
              aria-label="기업 분석 검색"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {isAuthenticated ? (
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
            ) : (
              <Button onClick={showLogin} variant="default" size="sm">
                로그인
              </Button>
            )}
          </div>
        </nav>
      </header>

      {/* Fundamental Search Modal */}
      <FundamentalSearchModal
        isOpen={isFundamentalModalOpen}
        onClose={() => setIsFundamentalModalOpen(false)}
      />
    </>
  );
};

export default Header;
