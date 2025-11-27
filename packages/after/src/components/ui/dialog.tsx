import React, { useEffect } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@repo/utils";
import { Button } from "./button";

const dialogOverlayVariants = cva(
  "fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-1000 p-3 sm:p-4"
);

const dialogContentVariants = cva(
  "bg-white dark:bg-gray-50 rounded-xl sm:rounded-xl max-h-[90vh] flex flex-col shadow-xl dark:shadow-xl",
  {
    variants: {
      size: {
        sm: "w-full max-w-[calc(100vw-2rem)] sm:max-w-[400px]",
        md: "w-full max-w-[calc(100vw-2rem)] sm:max-w-[600px]",
        lg: "w-full max-w-[calc(100vw-2rem)] sm:max-w-[900px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const dialogHeaderVariants = cva(
  "px-6 py-4 border-b border-black/12 dark:border-gray-200 flex justify-between items-center"
);

const dialogTitleVariants = cva(
  "m-0 text-xl font-medium text-black/87 dark:text-gray-900"
);

const dialogBodyVariants = cva("px-6 py-6 overflow-y-auto flex-1");

const dialogFooterVariants = cva(
  "px-6 py-4 border-t border-black/12 dark:border-gray-200 flex gap-2 justify-end"
);

type DialogProps = {
  size?: "sm" | "md" | "lg";
  isOpen: boolean;
  onClose: () => void;

  // Header options
  title?: string; // 간단한 title 문자열
  header?: React.ReactNode; // 또는 커스텀 header

  // Body
  children: React.ReactNode;

  // Footer options
  showFooter?: boolean;
  footerContent?: React.ReactNode; // 커스텀 footer
  footer?: React.ReactNode; // 또는 footer prop으로도 가능
};

const Dialog = ({
  isOpen,
  onClose,
  title,
  header,
  children,
  size = "md",
  showFooter = false,
  footerContent,
  footer,
}: DialogProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Header 렌더링: header prop > title prop 우선순위
  const renderHeader = () => {
    if (header) {
      return <div className={dialogHeaderVariants()}>{header}</div>;
    }

    if (title) {
      return (
        <div className={dialogHeaderVariants()}>
          <h3 className={dialogTitleVariants()}>{title}</h3>
          <Button variant="secondary" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
      );
    }

    return null;
  };

  // Footer 렌더링: footer prop > footerContent prop 우선순위
  const actualFooter = footer || footerContent;

  return (
    <div className={dialogOverlayVariants()} onClick={onClose}>
      <div
        className={cn(dialogContentVariants({ size }))}
        onClick={(e) => e.stopPropagation()}>
        {renderHeader()}
        <div className={dialogBodyVariants()}>{children}</div>
        {showFooter && actualFooter && (
          <div className={dialogFooterVariants()}>{actualFooter}</div>
        )}
      </div>
    </div>
  );
};

export type DialogBaseProps = {
  children: React.ReactNode;
  className?: string;
};

const DialogHeader = ({ children, className }: DialogBaseProps) => {
  return (
    <div className={cn(dialogHeaderVariants(), className)}>{children}</div>
  );
};

const DialogTitle = ({ children, className }: DialogBaseProps) => {
  return <h3 className={cn(dialogTitleVariants(), className)}>{children}</h3>;
};

const DialogClose = ({
  onClick,
  children = "×",
}: {
  onClick: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <Button variant="secondary" size="sm" onClick={onClick}>
      {children}
    </Button>
  );
};

const DialogBody = ({ children, className }: DialogBaseProps) => {
  return <div className={cn(dialogBodyVariants(), className)}>{children}</div>;
};

const DialogFooter = ({ children, className }: DialogBaseProps) => {
  return (
    <div className={cn(dialogFooterVariants(), className)}>{children}</div>
  );
};

export {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogBody,
  DialogFooter,
  dialogOverlayVariants,
  dialogContentVariants,
};
