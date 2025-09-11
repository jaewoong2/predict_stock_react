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
        isClickable && "cursor-pointer hover:scale-105 active:scale-95",
        variant === "minimal" && "bg-gray-50 border-gray-200",
        className
      )}
      onClick={onClick}
    >
      {/* Background decoration */}
      {variant === "gradient" && (
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      )}
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-gray-900 leading-none">
                {typeof value === "number" ? value.toLocaleString() : value}
              </span>
              {change && (
                <span
                  className={cn(
                    "text-sm font-semibold",
                    {
                      "text-red-600": change.type === "positive",
                      "text-blue-600": change.type === "negative", 
                      "text-gray-500": change.type === "neutral",
                    }
                  )}
                >
                  {change.type === "positive" && "+"}
                  {change.value}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          
          {icon && (
            <div className="flex-shrink-0 ml-3">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                {icon}
              </div>
            </div>
          )}
        </div>
      </div>
    </TossCard>
  );
}