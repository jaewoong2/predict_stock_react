"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tossButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        default: "bg-[#2b6ef2] text-white hover:bg-[#1f5cd8]",
        primary: "bg-[#2b6ef2] text-white hover:bg-[#1f5cd8]",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-[#171a24] dark:text-slate-100",
        success: "bg-green-500 text-white hover:bg-green-600",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-[#1c1f2b]",
        ghost: "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-[#1c1f2b]",
        link: "text-[#2b6ef2] underline-offset-4 hover:underline",
        glass: "border border-white/40 bg-white/70 backdrop-blur-sm text-slate-700 hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-slate-200",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-4 text-sm",
        lg: "h-13 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface TossButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tossButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const TossButton = React.forwardRef<HTMLButtonElement, TossButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(tossButtonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
TossButton.displayName = "TossButton";

export { TossButton, tossButtonVariants };
