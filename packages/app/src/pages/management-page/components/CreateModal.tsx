import React from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/after";
import { UserFormFields } from "./UserFormFields";
import { PostFormFields } from "./PostFormFields";

interface CreateModalProps {
  isOpen: boolean;
  entityType: "user" | "post";
  formData: any;
  onFormDataChange: (data: any) => void;
  onClose: () => void;
  onCreate: () => void;
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  entityType,
  formData,
  onFormDataChange,
  onClose,
  onCreate,
}) => {
  return (
    <Dialog size="lg" isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>
          {`새 ${entityType === "user" ? "사용자" : "게시글"} 만들기`}
        </DialogTitle>
        <DialogClose onClick={onClose} />
      </DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
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
        <Button variant="primary" size="md" onClick={onCreate}>
          생성
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
