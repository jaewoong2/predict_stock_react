"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertTitle, DismissibleAlert } from "@/components/ui/alert";

const Header = () => {
  const [mounted, setMounted] = useState(false);

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

  if (!mounted) {
    return null; // Prevents hydration mismatch
  }

  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <nav className="flex h-16 items-center justify-between px-6">
        <Link className="flex w-fit items-center" href="/dashboard">
          <img
            alt="Favicon"
            src={"/favicon.png"}
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <span className="text-base font-light">Stock Predict AI LLM</span>
        </Link>
        <div className="flex flex-1 items-center justify-end">
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
      <DismissibleAlert variant="default" className="rounded-none px-8">
        <AlertTitle>🎉 Add Nova AI, Perplexity Sonar Pro Model 🎉</AlertTitle>
      </DismissibleAlert>
    </header>
  );
};

export default Header;
