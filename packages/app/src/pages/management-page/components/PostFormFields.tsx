import React from "react";
import { Input, Select, Textarea } from "@repo/after";

interface PostFormFieldsProps {
  formData: any;
  onChange: (data: any) => void;
}

export const PostFormFields: React.FC<PostFormFieldsProps> = ({
  formData,
  onChange,
}) => {
  return (
    <>
      <Input
        name="title"
        value={formData.title || ""}
        onChange={(value) => onChange({ ...formData, title: value })}
        label="제목"
        placeholder="게시글 제목을 입력하세요"
        required
        width="full"
        fieldType="postTitle"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="author"
          value={formData.author || ""}
          onChange={(value) => onChange({ ...formData, author: value })}
          label="작성자"
          placeholder="작성자명"
          required
          width="full"
        />
        <Select
          name="category"
          value={formData.category || ""}
          onChange={(value) => onChange({ ...formData, category: value })}
          options={[
            { value: "development", label: "Development" },
            { value: "design", label: "Design" },
            { value: "accessibility", label: "Accessibility" },
          ]}
          label="카테고리"
          placeholder="카테고리 선택"
          size="full"
        />
      </div>
      <Textarea
        name="content"
        value={formData.content || ""}
        onChange={(value) => onChange({ ...formData, content: value })}
        label="내용"
        placeholder="게시글 내용을 입력하세요"
        rows={6}
      />
    </>
  );
};
