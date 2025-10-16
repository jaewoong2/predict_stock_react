"use client";
import { useState, useEffect } from "react";
import { Moon, Sun, Search, Command, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/ui/command-palette";
import { DateNavigation } from "@/components/ui/date-navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { FundamentalSearchModal } from "./ox/layout/FundamentalSearchModal";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: logout, isPending } = useLogout();
  const { isAuthenticated, showLogin } = useAuth();

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
      <CommandPalette />
      <FundamentalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <nav className="flex h-16 w-full items-center gap-2 px-3 sm:gap-4 sm:px-6">
          {/* Mobile: Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop: Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className={cn(
              "group hidden h-10 max-w-2xl flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 transition-all hover:border-slate-300 hover:bg-white lg:flex dark:border-slate-800 dark:bg-[#151b24] dark:hover:border-slate-700 dark:hover:bg-[#1a2030]",
            )}
          >
            <Search className="h-4 w-4 text-slate-400" />
            <span className="flex-1 text-left text-sm text-slate-500 dark:text-slate-400">
              기업 검색...
            </span>
            <kbd className="hidden items-center gap-1 rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 xl:inline-flex dark:bg-slate-800 dark:text-slate-400">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>

          {/* Mobile: Compact Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Center: Date Navigation */}
          <div className="flex flex-1 justify-center lg:flex-initial">
            <DateNavigation
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              showCalendar={true}
            />
          </div>

          {/* Desktop: Right Side Actions */}
          <div className="hidden items-center gap-2 lg:flex">
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
              <Button
                onClick={() => {
                  logout(undefined, {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  });
                }}
                disabled={isPending}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                <span>로그아웃</span>
              </Button>
            ) : (
              <Button
                onClick={showLogin}
                variant="default"
                size="sm"
                className="px-4 font-semibold"
              >
                로그인
              </Button>
            )}
          </div>

          {/* Mobile: Login Button Only */}
          <div className="lg:hidden">
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  logout(undefined, {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  });
                }}
                disabled={isPending}
                variant="ghost"
                size="icon"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                onClick={showLogin}
                variant="default"
                size="sm"
                className="px-3 text-sm"
              >
                로그인
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="border-border/40 bg-background/95 border-t px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                onClick={toggleDarkMode}
                className="w-full justify-start gap-2"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-5 w-5" />
                    <span>라이트 모드</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" />
                    <span>다크 모드</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
