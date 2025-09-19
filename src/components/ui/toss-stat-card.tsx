"use client";

import * as React from "react";
import { TossCard } from "./toss-card";
import { cn } from "@/lib/utils";

interface TossStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string | number;
    type: "positive" | "negative" | "neutral";
  };
  icon?: React.ReactNode;
  variant?: "default" | "gradient" | "minimal";
  className?: string;
  onClick?: () => void;
}

export function TossStatCard({
  title,
  value,
  subtitle,
  change,
  icon,
  variant = "default",
  className,
  onClick,
}: TossStatCardProps) {
  const isClickable = !!onClick;

  return (
    <TossCard
      variant={variant === "gradient" ? "gradient" : "default"}
      className={cn(
        "relative overflow-hidden",
        isClickable && "cursor-pointer transition-transform hover:-translate-y-1",
        variant === "minimal" && "bg-slate-50 dark:bg-[#151b24]",
        className,
      )}
      onClick={onClick}
    >
      {variant === "gradient" && (
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 dark:bg-white/5" />
      )}

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900 leading-none dark:text-slate-50">
                {typeof value === "number" ? value.toLocaleString() : value}
              </span>
              {change && (
                <span
                  className={cn(
                    "text-xs font-semibold",
                    change.type === "positive"
                      ? "text-red-500"
                      : change.type === "negative"
                        ? "text-blue-500"
                        : "text-slate-400",
                  )}
                >
                  {change.type === "positive" && "+"}
                  {change.value}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
            )}
          </div>

          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-[#1c2533] dark:text-slate-300">
              {icon}
            </div>
          )}
        </div>
      </div>
    </TossCard>
  );
}
