import React from "react";

import { cn } from "@repo/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Label } from "./label";
import { HelperText } from "./helper-text";

const selectVariants = cva(
  "px-2.5 py-2 text-sm border border-gray-400 dark:border-gray-400 rounded-md bg-white dark:bg-input box-border transition-colors focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:outline-none disabled:bg-[var(--color-muted)] dark:disabled:bg-[var(--color-muted)] disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        sm: "w-[200px]",
        md: "w-[300px]",
        lg: "w-[400px]",
        full: "w-full",
      },
      hasError: {
        true: "border-danger",
        false: "",
      },
    },
    defaultVariants: {
      size: "full",
      hasError: false,
    },
  }
);

interface Option {
  value: string;
  label: string;
}

type SelectProps = Omit<React.ComponentProps<"select">, "size"> &
  Omit<VariantProps<typeof selectVariants>, "hasError"> & {
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    helpText?: string;
    size?: "sm" | "md" | "lg" | "full"; // API 호환성 유지
  };

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      name,
      value,
      onChange,
      options,
      label,
      placeholder = "Select an option...",
      required = false,
      disabled = false,
      error,
      helpText,
      size = "full",
      ...props
    },
    ref
  ) => {
    void size;

    return (
      <div className="grid gap-2">
        {label && (
          <Label htmlFor={name} required={required}>
            {label}
          </Label>
        )}

        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={cn(selectVariants({ hasError: !!error, className, size }))}
          ref={ref}
          {...props}>
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <HelperText text={error} hasError />}
        {helpText && !error && <HelperText text={helpText} />}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select, selectVariants };
export type { SelectProps, Option };
