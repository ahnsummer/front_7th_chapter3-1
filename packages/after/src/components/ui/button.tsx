import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/utils";

const buttonVariants = cva(
  "inline-block leading-1.5 border border-solid rounded-sm cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-secondary text-gray-600 hover:bg-secondary/80",
        danger: "bg-danger text-white hover:bg-danger/90",
        success: "bg-success text-white hover:bg-success/90",
        info: "bg-info text-white hover:bg-info/90",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base",
        lg: "px-6 py-3 text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  } & {
    fullWidth?: boolean;
    entityType?: "user" | "post";
    action?: "create" | "edit" | "delete" | "publish" | "archive";
    entity?: any; // 엔티티 객체를 직접 받음
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  disabled,
  fullWidth,
  children,
  type = "button",
  entityType,
  action,
  entity,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  // 🚨 Bad Practice: UI 컴포넌트가 비즈니스 규칙을 판단함
  let actualDisabled = disabled;
  let actualVariant = variant;
  let actualChildren = children;

  if (entityType && action && entity) {
    // 비즈니스 규칙: 관리자는 삭제 불가
    if (
      entityType === "user" &&
      action === "delete" &&
      entity.role === "admin"
    ) {
      actualDisabled = true;
    }

    // 비즈니스 규칙: 이미 게시된 글은 게시 버튼 비활성화
    if (
      entityType === "post" &&
      action === "publish" &&
      entity.status === "published"
    ) {
      actualDisabled = true;
    }

    // 비즈니스 규칙: 게시된 글만 보관 가능
    if (
      entityType === "post" &&
      action === "archive" &&
      entity.status !== "published"
    ) {
      actualDisabled = true;
    }

    // 자동 label 생성
    if (!children) {
      if (action === "create") {
        actualChildren = `새 ${
          entityType === "user" ? "사용자" : "게시글"
        } 만들기`;
      } else if (action === "edit") {
        actualChildren = "수정";
      } else if (action === "delete") {
        actualChildren = "삭제";
      } else if (action === "publish") {
        actualChildren = "게시";
      } else if (action === "archive") {
        actualChildren = "보관";
      }
    }

    // action에 따라 variant 자동 결정
    if (action === "delete") {
      actualVariant = "danger";
    } else if (action === "publish") {
      actualVariant = "success";
    } else if (action === "archive") {
      actualVariant = "secondary";
    }
  }

  return (
    <Comp
      data-slot="button"
      disabled={actualDisabled}
      type={type}
      className={cn(
        buttonVariants({
          variant: actualVariant,
          size,
          className,
          fullWidth,
        })
      )}
      {...props}>
      {actualChildren}
    </Comp>
  );
}

export { Button, buttonVariants };
