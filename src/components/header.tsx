import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button"; // shadcn/ui 버튼 경로
import { AlertTitle, DismissibleAlert } from "./ui/alert";
import { Link } from "react-router-dom";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

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
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-16 items-center justify-between px-6">
        <Link className="flex items-center w-full" to={"/dashboard"}>
          <img src="/favicon.png" className="w-12 h-12" />
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
      <DismissibleAlert variant="default" className="px-8 rounded-none">
        <AlertTitle>🎉 Add Nova AI, Perplexity Sonar Pro Model 🎉</AlertTitle>
      </DismissibleAlert>
    </header>
  );
};

export default Header;
