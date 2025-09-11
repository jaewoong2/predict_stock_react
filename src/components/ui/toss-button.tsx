"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tossButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
        primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg hover:shadow-xl",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl",
        outline: "border-2 border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
        link: "text-blue-600 underline-offset-4 hover:underline",
        glass: "bg-white/80 backdrop-blur-sm text-gray-700 border border-white/20 shadow-lg hover:bg-white/90",
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