import React from "react";

import { cn } from "@repo/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Label } from "./label";
import { HelperText } from "./helper-text";

const inputVariants = cva(
  "w-full px-2.5 py-2 border border-gray-400 rounded-md text-sm text-gray-950 bg-white box-border focus:border-primary focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed",
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
      hasError: false,
    },
  }
);

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  Omit<VariantProps<typeof inputVariants>, "hasError"> & {
    name: string;
    label?: string;
    error?: string;
    helpText?: string;
    onChange: (value: string) => void;
    onValidate?: (value: string) => string | undefined;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      className,
      type = "text",
      size = "full",
      label,
      error,
      helpText,
      onChange,
      onValidate,
      placeholder,
      required = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      onValidate?.(newValue);
    };

    return (
      <div className="grid gap-2">
        {label && (
          <Label htmlFor={name} required={required}>
            {label}
          </Label>
        )}
        <input
          id={name}
          name={name}
          data-slot="input"
          ref={ref}
          type={type}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn(inputVariants({ className, hasError: !!error, size }))}
          {...props}
        />
        {error && <HelperText text={error} hasError />}
        {helpText && !error && <HelperText text={helpText} />}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
