import { cn } from "@repo/utils";
import { cva } from "class-variance-authority";

const helperTextVariants = cva("mt-1 text-gray-600 text-xs", {
  variants: {
    hasError: {
      true: "text-danger",
      false: "",
    },
  },
  defaultVariants: {
    hasError: false,
  },
});

type HelperTextProps = {
  text: string;
  hasError?: boolean;
};

const HelperText = ({ text, hasError = false }: HelperTextProps) => {
  return <span className={cn(helperTextVariants({ hasError }))}>{text}</span>;
};

export { HelperText, helperTextVariants };
