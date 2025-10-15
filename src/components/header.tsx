"use client";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import { CommandPalette } from "@/components/ui/command-palette";
import { DateNavigation } from "@/components/ui/date-navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
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
      <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <nav className="flex h-16 w-full items-center px-6">
          <div className="flex flex-1 items-center" />

          <div className="flex flex-1 items-center justify-center max-lg:hidden">
            <DateNavigation
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              showCalendar={true}
            />
          </div>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <MobileNavigation />
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
          </div>
        </nav>
        {/* <DismissibleAlert variant="default" className="rounded-none px-8">
          <AlertTitle>🎉 Add Nova AI, Perplexity Sonar Pro Model 🎉</AlertTitle>
        </DismissibleAlert> */}
      </header>
    </>
  );
};

export default Header;
