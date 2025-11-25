import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "px-3 py-2.5 mb-4 rounded-[3px] border border-solid flex gap-2 items-start",
  {
    variants: {
      variant: {
        primary: "bg-primary border-primary/50 text-primary-foreground",
        info: "bg-info border-info/50 text-info-foreground",
        success: "bg-success border-success/50 text-success-foreground",
        warning: "bg-warning border-warning/50 text-warning-foreground",
        danger: "bg-danger border-danger/50 text-danger-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

const alertIconVariants = cva("text-xl shrink-0");

const alertContentVariants = cva("flex-1");

const alertTitleVariants = cva("font-bold mb-1 text-[15px]");

const alertBodyVariants = cva("text-sm leading-normal");

const alertCloseVariants = cva(
  "bg-transparent border-0 cursor-pointer text-xl p-0 px-1 ml-auto shrink-0"
);

type AlertProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    children: React.ReactNode;
    variant?: "primary" | "info" | "success" | "warning" | "danger";
    title?: string;
    onClose?: () => void;
    showIcon?: boolean;
  };

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "primary",
      title,
      onClose,
      showIcon = true,
      children,
      ...props
    },
    ref
  ) => {
    const getIcon = () => {
      switch (variant) {
        case "info":
          return "ℹ️";
        case "success":
          return "✓";
        case "warning":
          return "⚠️";
        case "danger":
          return "✕";
        default:
          return "•";
      }
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant, className }))}
        {...props}>
        {showIcon && <div className={alertIconVariants()}>{getIcon()}</div>}
        <div className={alertContentVariants()}>
          {title && <div className={alertTitleVariants()}>{title}</div>}
          <div className={alertBodyVariants()}>{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className={alertCloseVariants()}>
            ×
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert, alertVariants };
