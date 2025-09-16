"use client";

import { cn } from "@/lib/utils";

type IconBadgeProps = {
  children: React.ReactNode;
  variant?: "blue" | "green" | "purple" | "orange" | "gray";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const variantMap: Record<NonNullable<IconBadgeProps["variant"]>, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
  gray: "bg-gray-100 text-gray-600",
};

const sizeMap: Record<NonNullable<IconBadgeProps["size"]>, string> = {
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
};

export function IconBadge({ children, variant = "blue", size = "md", className }: IconBadgeProps) {
  return (
    <div className={cn("rounded-2xl inline-flex", variantMap[variant], sizeMap[size], className)}>
      {children}
    </div>
  );
}

