"use client";

import { IconBadge } from "@/components/atomic/atoms/IconBadge";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  icon?: React.ReactNode;
  iconVariant?: "blue" | "green" | "purple" | "orange" | "gray";
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  icon,
  iconVariant = "blue",
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-6 space-y-3", align === "center" ? "text-center" : "text-left", className)}>
      {icon && (
        <div className={cn("flex", align === "center" ? "justify-center" : "justify-start") }>
          <IconBadge variant={iconVariant}>{icon}</IconBadge>
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mx-auto max-w-md text-sm text-gray-600">{subtitle}</p>}
    </div>
  );
}

