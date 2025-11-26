import React, { useEffect } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@repo/utils";

const dialogOverlayVariants = cva(
  "fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
);

const dialogContentVariants = cva(
  "bg-white rounded max-h-[90vh] flex flex-col shadow-[0px_11px_15px_-7px_rgba(0,0,0,0.2),0px_24px_38px_3px_rgba(0,0,0,0.14),0px_9px_46px_8px_rgba(0,0,0,0.12)]",
  {
    variants: {
      size: {
        sm: "w-full max-w-[400px]",
        md: "w-full max-w-[600px]",
        lg: "w-full max-w-[900px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const dialogHeaderVariants = cva(
  "px-6 py-4 border-b border-black/12 flex justify-between items-center"
);

const dialogTitleVariants = cva("m-0 text-xl font-medium text-black/87");

const dialogCloseVariants = cva(
  "bg-transparent border-0 text-[28px] leading-none text-black/54 cursor-pointer p-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/4"
);

const dialogBodyVariants = cva("px-6 py-6 overflow-y-auto flex-1");

const dialogFooterVariants = cva(
  "px-6 py-4 border-t border-black/12 flex gap-2 justify-end"
);

interface DialogProps {
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

  // Size
  size?: "sm" | "md" | "lg";
}

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
          <button className={dialogCloseVariants()} onClick={onClose}>
            ×
          </button>
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

// Export 개별 컴포넌트 (조립식으로 사용 가능)
const DialogHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn(dialogHeaderVariants(), className)}>{children}</div>
  );
};

const DialogTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <h3 className={cn(dialogTitleVariants(), className)}>{children}</h3>;
};

const DialogClose: React.FC<{
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}> = ({ onClick, className, children = "×" }) => {
  return (
    <button className={cn(dialogCloseVariants(), className)} onClick={onClick}>
      {children}
    </button>
  );
};

const DialogBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn(dialogBodyVariants(), className)}>{children}</div>;
};

const DialogFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
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
