import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { HelperText } from "./helper-text";
import { cva, type VariantProps } from "class-variance-authority";

const textareaVariants = cva(
  "w-full min-h-9 px-3.5 py-4 text-sm font-normal leading-1.5 text-black/87 border border-black/23 rounded bg-white box-border transition-[border-color] duration-200 outline-none resize-y focus:border-primary disabled:bg-black/12 disabled:cursor-not-allowed",
  {
    variants: {
      hasError: {
        true: "border-danger",
        false: "",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
);

type TextareaProps = React.ComponentProps<"textarea"> &
  Omit<VariantProps<typeof textareaVariants>, "hasError"> & {
    name: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    helpText?: string;
    rows?: number;
  };

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      name,
      label,
      value,
      onChange,
      required = false,
      disabled = false,
      error,
      helpText,
      rows = 4,
      ...props
    },
    ref
  ) => {
    return (
      <div className="grid gap-2">
        {label && (
          <Label htmlFor={name} required={required}>
            {label}
          </Label>
        )}
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          rows={rows}
          className={cn(textareaVariants({ hasError: !!error, className }))}
          ref={ref}
          {...props}
        />
        {error && <HelperText text={error} hasError />}
        {helpText && !error && <HelperText text={helpText} />}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
