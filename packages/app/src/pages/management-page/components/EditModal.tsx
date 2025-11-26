import React from "react";
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
  return (
    <Dialog size="lg" isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{`${
          entityType === "user" ? "사용자" : "게시글"
        } 수정`}</DialogTitle>
        <DialogClose onClick={onClose} />
      </DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
          {selectedItem && (
            <Alert variant="info">
              ID: {selectedItem.id} | 생성일: {selectedItem.createdAt}
              {entityType === "post" &&
                ` | 조회수: ${(selectedItem as Post).views}`}
            </Alert>
          )}

          {entityType === "user" ? (
            <UserFormFields formData={formData} onChange={onFormDataChange} />
          ) : (
            <PostFormFields formData={formData} onChange={onFormDataChange} />
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="secondary" size="md" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" size="md" onClick={onUpdate}>
          수정 완료
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
