import React, { useState } from "react";

import { cn } from "@/lib/utils";
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
    // 🚨 도메인 관심사 추가
    fieldType?: "username" | "email" | "postTitle" | "slug" | "normal";
    entityType?: "user" | "post"; // 엔티티 타입까지 알고 있음
    checkBusinessRules?: boolean; // 비즈니스 규칙 검사 여부
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
      fieldType,
      checkBusinessRules,
      entityType,
      placeholder,
      required = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalError, setInternalError] = useState("");

    // 🚨 Bad Practice: UI 컴포넌트가 비즈니스 규칙을 검증함
    const validateField = (val: string) => {
      setInternalError("");

      if (!val) return;

      // 기본 필드 타입 검증
      if (fieldType === "username") {
        if (val.length < 3) {
          setInternalError("사용자명은 3자 이상이어야 합니다");
        } else if (!/^[a-zA-Z0-9_]+$/.test(val)) {
          setInternalError("영문, 숫자, 언더스코어만 사용 가능합니다");
        } else if (val.length > 20) {
          setInternalError("사용자명은 20자 이하여야 합니다");
        }

        // 🚨 도메인 특화 검증: 예약어 체크
        if (checkBusinessRules) {
          const reservedWords = ["admin", "root", "system", "administrator"];
          if (reservedWords.includes(val.toLowerCase())) {
            setInternalError("예약된 사용자명입니다");
          }
        }
      } else if (fieldType === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          setInternalError("올바른 이메일 형식이 아닙니다");
        }

        // 🚨 비즈니스 규칙: User 엔티티의 이메일은 회사 도메인만
        if (checkBusinessRules && entityType === "user") {
          if (!val.endsWith("@company.com") && !val.endsWith("@example.com")) {
            setInternalError(
              "회사 이메일(@company.com 또는 @example.com)만 사용 가능합니다"
            );
          }
        }
      } else if (fieldType === "postTitle") {
        if (val.length < 5) {
          setInternalError("제목은 5자 이상이어야 합니다");
        } else if (val.length > 100) {
          setInternalError("제목은 100자 이하여야 합니다");
        }

        // 🚨 비즈니스 규칙: 금칙어 체크
        if (checkBusinessRules && entityType === "post") {
          const bannedWords = ["광고", "스팸", "홍보"];
          const hasBannedWord = bannedWords.some((word) => val.includes(word));
          if (hasBannedWord) {
            setInternalError("제목에 금지된 단어가 포함되어 있습니다");
          }
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      validateField(newValue);
    };

    const displayError = error || internalError;

    return (
      <div>
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
        {displayError && <HelperText text={displayError} hasError />}
        {helpText && !displayError && <HelperText text={helpText} />}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
