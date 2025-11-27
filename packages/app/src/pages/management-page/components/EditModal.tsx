import React, { useState } from "react";
import {
  Button,
  Alert,
  Dialog,
  DialogBody,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/after";
import { UserFormFields } from "./UserFormFields";
import { PostFormFields } from "./PostFormFields";
import type { User } from "@/services/userService";
import type { Post } from "@/services/postService";

interface EditModalProps {
  isOpen: boolean;
  entityType: "user" | "post";
  selectedItem: User | Post | null;
  formData: any;
  onFormDataChange: (data: any) => void;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  entityType,
  selectedItem,
  formData,
  onFormDataChange,
  onClose,
  onUpdate,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleValidate = (field: string, error: string | undefined) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error || "",
    }));
  };

  return (
    <Dialog size="lg" isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle className="text-lg sm:text-xl">{`${
          entityType === "user" ? "사용자" : "게시글"
        } 수정`}</DialogTitle>
        <DialogClose onClick={onClose} />
      </DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-3 sm:gap-4">
          {selectedItem && (
            <Alert variant="info" className="text-xs sm:text-sm break-words">
              ID: {selectedItem.id} | 생성일: {selectedItem.createdAt}
              {entityType === "post" &&
                ` | 조회수: ${(selectedItem as Post).views}`}
            </Alert>
          )}

          {entityType === "user" ? (
            <UserFormFields
              formData={formData}
              onChange={onFormDataChange}
              errors={errors}
              onValidate={handleValidate}
            />
          ) : (
            <PostFormFields
              formData={formData}
              onChange={onFormDataChange}
              errors={errors}
              onValidate={handleValidate}
            />
          )}
        </div>
      </DialogBody>
      <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
        <Button 
          variant="secondary" 
          size="md" 
          onClick={onClose}
          className="w-full sm:w-auto order-2 sm:order-1 min-h-[44px] sm:min-h-0">
          취소
        </Button>
        <Button 
          variant="primary" 
          size="md" 
          onClick={onUpdate}
          className="w-full sm:w-auto order-1 sm:order-2 min-h-[44px] sm:min-h-0">
          수정 완료
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
