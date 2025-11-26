import React from "react";
import { Input, Select } from "@repo/after";

interface UserFormFieldsProps {
  formData: any;
  onChange: (data: any) => void;
}

export const UserFormFields: React.FC<UserFormFieldsProps> = ({
  formData,
  onChange,
}) => {
  return (
    <>
      <Input
        name="username"
        value={formData.username || ""}
        onChange={(value) => onChange({ ...formData, username: value })}
        label="사용자명"
        placeholder="사용자명을 입력하세요"
        required
        width="full"
        fieldType="username"
      />
      <Input
        name="email"
        value={formData.email || ""}
        onChange={(value) => onChange({ ...formData, email: value })}
        label="이메일"
        placeholder="이메일을 입력하세요"
        type="email"
        required
        width="full"
        fieldType="email"
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
