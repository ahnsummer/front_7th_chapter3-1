import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/utils";

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    fullWidth?: boolean;
  };

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  disabled = false,
  fullWidth,
  children,
  type = "button",
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      disabled={disabled}
      type={type}
      className={cn(
        buttonVariants({
          variant,
          size,
          fullWidth,
          className,
        })
      )}
      {...props}>
      {children}
    </Comp>
  );
};

const buttonVariants = cva(
  "inline-block leading-1.5 rounded-sm cursor-pointer whitespace-nowrap transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary-hover",
        danger:
          "bg-danger text-danger-foreground hover:bg-danger-hover dark:bg-danger dark:text-danger-foreground dark:hover:bg-danger-hover",
        success:
          "bg-success text-success-foreground hover:bg-success-hover dark:bg-success dark:text-success-foreground dark:hover:bg-success-hover",
        info: "bg-info text-info-foreground hover:bg-info/90 dark:bg-info dark:text-info-foreground dark:hover:bg-info/90",
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

export { Button, buttonVariants };
