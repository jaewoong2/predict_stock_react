"use client";

import { useState } from "react";
import { Search, Command, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { FundamentalSearchModal } from "./FundamentalSearchModal";
import { useLogout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function OxNavBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { mutate: logout, isPending } = useLogout();
  const router = useRouter();

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-[#0f1118]/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              OX Predict
            </h1>
          </div>

          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className={cn(
              "group flex h-10 w-full max-w-md items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 transition-all hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-[#151b24] dark:hover:border-slate-700 dark:hover:bg-[#1a2030]"
            )}
          >
            <Search className="h-4 w-4 text-slate-400" />
            <span className="flex-1 text-left text-sm text-slate-500 dark:text-slate-400">
              기업 검색...
            </span>
            <kbd className="hidden items-center gap-1 rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400 sm:inline-flex">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>

          {/* Right side - Logout Button */}
          <div className="flex items-center gap-4">
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
              className="gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">로그아웃</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <FundamentalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
