"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TossCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "glass" | "elevated";
  padding?: "sm" | "md" | "lg" | "xl";
}

const TossCard = React.forwardRef<HTMLDivElement, TossCardProps>(
  (
    { className, variant = "default", padding = "md", children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl transition-colors duration-200",
          {
            "bg-white shadow-none dark:bg-[#11131a]": variant === "default",
            "bg-gradient-to-br from-white to-slate-50 shadow-none dark:from-[#11131a] dark:to-[#151823]":
              variant === "gradient",
            "bg-white/80 backdrop-blur-sm shadow-none dark:bg-white/5":
              variant === "glass",
            "bg-white dark:bg-[#11131a]": variant === "elevated",
          },
          {
            "p-3": padding === "sm",
            "p-4": padding === "md",
            "p-6": padding === "lg",
            "p-8": padding === "xl",
          },
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TossCard.displayName = "TossCard";

const TossCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
TossCardHeader.displayName = "TossCardHeader";

const TossCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg leading-tight font-semibold text-gray-900",
      className,
    )}
    {...props}
  />
));
TossCardTitle.displayName = "TossCardTitle";

const TossCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm leading-relaxed text-gray-500", className)}
    {...props}
  />
));
TossCardDescription.displayName = "TossCardDescription";

const TossCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props} />
));
TossCardContent.displayName = "TossCardContent";

const TossCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
TossCardFooter.displayName = "TossCardFooter";

export {
  TossCard,
  TossCardHeader,
  TossCardTitle,
  TossCardDescription,
  TossCardContent,
  TossCardFooter,
};
