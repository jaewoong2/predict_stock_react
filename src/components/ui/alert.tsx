import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react"; // Import X icon for close button

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert"
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

function AlertClose({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      data-slot="alert-close"
      className={cn(
        "absolute cursor-pointer top-2 right-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  );
}

// 자동 닫기 기능이 내장된 새 컴포넌트
function DismissibleAlert({
  children,
  onClose,
  ...props
}: AlertProps & { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleClose = React.useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <Alert {...props}>
      {children}
      <AlertClose onClick={handleClose} className="px-6" />
    </Alert>
  );
}

export { Alert, AlertTitle, AlertDescription, AlertClose, DismissibleAlert };
