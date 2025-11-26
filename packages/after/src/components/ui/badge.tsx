import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/utils";

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

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & {
    pill?: boolean;
    status?: "published" | "draft" | "archived" | "pending" | "rejected";
    userRole?: "admin" | "moderator" | "user" | "guest";
    priority?: "high" | "medium" | "low";
    paymentStatus?: "paid" | "pending" | "failed" | "refunded";
    showIcon?: boolean;
  };

function Badge({
  className,
  variant,
  size,
  pill,
  children,
  userRole,
  priority,
  paymentStatus,
  status,
  showIcon,
  ...props
}: BadgeProps) {
  void showIcon; // 미구현이지만 DOM 전달 방지
  let actualType = variant;
  let actualContent = children;

  if (status) {
    switch (status) {
      case "published":
        actualType = "success";
        actualContent = actualContent || "게시됨";
        break;
      case "draft":
        actualType = "warning";
        actualContent = actualContent || "임시저장";
        break;
      case "archived":
        actualType = "secondary";
        actualContent = actualContent || "보관됨";
        break;
      case "pending":
        actualType = "info";
        actualContent = actualContent || "대기중";
        break;
      case "rejected":
        actualType = "danger";
        actualContent = actualContent || "거부됨";
        break;
    }
  }

  if (userRole) {
    switch (userRole) {
      case "admin":
        actualType = "danger";
        actualContent = actualContent || "관리자";
        break;
      case "moderator":
        actualType = "warning";
        actualContent = actualContent || "운영자";
        break;
      case "user":
        actualType = "primary";
        actualContent = actualContent || "사용자";
        break;
      case "guest":
        actualType = "secondary";
        actualContent = actualContent || "게스트";
        break;
    }
  }

  if (priority) {
    switch (priority) {
      case "high":
        actualType = "danger";
        actualContent = actualContent || "높음";
        break;
      case "medium":
        actualType = "warning";
        actualContent = actualContent || "보통";
        break;
      case "low":
        actualType = "info";
        actualContent = actualContent || "낮음";
        break;
    }
  }

  if (paymentStatus) {
    switch (paymentStatus) {
      case "paid":
        actualType = "success";
        actualContent = actualContent || "결제완료";
        break;
      case "pending":
        actualType = "warning";
        actualContent = actualContent || "결제대기";
        break;
      case "failed":
        actualType = "danger";
        actualContent = actualContent || "결제실패";
        break;
      case "refunded":
        actualType = "secondary";
        actualContent = actualContent || "환불됨";
        break;
    }
  }

  return (
    <div
      className={cn(
        badgeVariants({ variant: actualType, size, className, pill }),
        className
      )}
      children={actualContent}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
