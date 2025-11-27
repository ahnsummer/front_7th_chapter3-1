import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/utils";

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & {
    pill?: boolean;
    showIcon?: boolean;
  };

const Badge = ({
  className,
  variant,
  size,
  pill,
  showIcon,
  ...props
}: BadgeProps) => {
  void showIcon; // 미구현이지만 DOM 전달 방지

  return (
    <div
      className={cn(
        badgeVariants({ variant, size, className, pill }),
        className
      )}
      {...props}
    />
  );
};

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/80",
        danger:
          "border-transparent bg-danger text-danger-foreground hover:bg-danger/80",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        info: "border-transparent bg-info text-info-foreground hover:bg-info/80",
      },
      size: {
        sm: "px-1 py-0.5 text-xs",
        md: "px-1.5 py-0.5 text-sm",
        lg: "px-2 py-1 text-md",
      },
      pill: {
        true: "rounded-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      pill: false,
    },
  }
);

export { Badge, badgeVariants };
