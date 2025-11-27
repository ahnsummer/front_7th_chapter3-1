import React from "react";
import { Input, Select } from "@repo/after";
import { validateUsername, validateEmail } from "@/utils/validation";

interface UserFormFieldsProps {
  formData: any;
  onChange: (data: any) => void;
  errors?: Record<string, string>;
  onValidate?: (field: string, error: string | undefined) => void;
}

export const UserFormFields: React.FC<UserFormFieldsProps> = ({
  formData,
  onChange,
  errors = {},
  onValidate,
}) => {
  return (
    <>
      <Input
        name="username"
        value={formData.username || ""}
        onChange={(value) => onChange({ ...formData, username: value })}
        onValidate={(value) => {
          const error = validateUsername(value);
          onValidate?.("username", error);
          return error;
        }}
        label="사용자명"
        placeholder="사용자명을 입력하세요"
        required
        size="full"
        error={errors.username}
      />
      <Input
        name="email"
        value={formData.email || ""}
        onChange={(value) => onChange({ ...formData, email: value })}
        onValidate={(value) => {
          const error = validateEmail(value);
          onValidate?.("email", error);
          return error;
        }}
        label="이메일"
        placeholder="이메일을 입력하세요"
        type="email"
        required
        size="full"
        error={errors.email}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          name="role"
          value={formData.role || "user"}
          onChange={(value) => onChange({ ...formData, role: value })}
          options={[
            { value: "user", label: "사용자" },
            { value: "moderator", label: "운영자" },
            { value: "admin", label: "관리자" },
          ]}
          label="역할"
          size="full"
        />
        <Select
          name="status"
          value={formData.status || "active"}
          onChange={(value) => onChange({ ...formData, status: value })}
          options={[
            { value: "active", label: "활성" },
            { value: "inactive", label: "비활성" },
            { value: "suspended", label: "정지" },
          ]}
          label="상태"
          size="full"
        />
      </div>
    </>
  );
};
