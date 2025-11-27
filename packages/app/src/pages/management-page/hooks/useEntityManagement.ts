import { useState, useEffect } from "react";
import { userService, type User } from "@/services/userService";
import { postService, type Post } from "@/services/postService";

type EntityType = "user" | "post";
type Entity = User | Post;

type UseEntityManagementReturn = {
  data: Entity[];
  formData: any;
  selectedItem: Entity | null;
  isLoading: boolean;
  loadData: () => Promise<void>;
  handleCreate: (data: any) => Promise<void>;
  handleUpdate: (data: any) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  handleStatusAction: (
    id: number,
    action: "publish" | "archive" | "restore"
  ) => Promise<void>;
  setFormDataForEdit: (item: Entity) => void;
  setFormData: (data: any) => void;
  resetForm: () => void;
  withFormReset: <T extends (...args: any) => any>(
    callback: T
  ) => (...args: Parameters<T>) => void;
  setSelectedItem: (item: Entity | null) => void;
};

export const useEntityManagement = (
  entityType: EntityType,
  onSuccess: (message: string) => void,
  onError: (message: string) => void
): UseEntityManagementReturn => {
  const [data, setData] = useState<Entity[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result =
        entityType === "user"
          ? await userService.getAll()
          : await postService.getAll();
      setData(result);
    } catch (error: any) {
      onError("데이터를 불러오는데 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      if (entityType === "user") {
        await userService.create({
          username: data.username,
          email: data.email,
          role: data.role || "user",
          status: data.status || "active",
        });
      } else {
        await postService.create({
          title: data.title,
          content: data.content || "",
          author: data.author,
          category: data.category,
          status: data.status || "draft",
        });
      }
      await loadData();
      onSuccess(
        `${entityType === "user" ? "사용자" : "게시글"}가 생성되었습니다`
      );
    } catch (error: any) {
      onError(error.message || "생성에 실패했습니다");
      throw error;
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedItem) return;

    try {
      if (entityType === "user") {
        await userService.update(selectedItem.id, data);
      } else {
        await postService.update(selectedItem.id, data);
      }
      await loadData();
      onSuccess(
        `${entityType === "user" ? "사용자" : "게시글"}가 수정되었습니다`
      );
    } catch (error: any) {
      onError(error.message || "수정에 실패했습니다");
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      if (entityType === "user") {
        await userService.delete(id);
      } else {
        await postService.delete(id);
      }
      await loadData();
      onSuccess("삭제되었습니다");
    } catch (error: any) {
      onError(error.message || "삭제에 실패했습니다");
    }
  };

  const handleStatusAction = async (
    id: number,
    action: "publish" | "archive" | "restore"
  ) => {
    if (entityType !== "post") return;

    try {
      if (action === "publish") {
        await postService.publish(id);
      } else if (action === "archive") {
        await postService.archive(id);
      } else if (action === "restore") {
        await postService.restore(id);
      }

      await loadData();
      const message =
        action === "publish" ? "게시" : action === "archive" ? "보관" : "복원";
      onSuccess(`${message}되었습니다`);
    } catch (error: any) {
      onError(error.message || "작업에 실패했습니다");
    }
  };

  const setFormDataForEdit = (item: Entity) => {
    if (entityType === "user") {
      const user = item as User;
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      const post = item as Post;
      setFormData({
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category,
        status: post.status,
      });
    }
  };

  const resetForm = () => {
    setFormData({});
    setSelectedItem(null);
  };

  const withFormReset = <T extends (...args: any) => any>(callback: T) => {
    return (...args: Parameters<T>) => {
      setData([]);
      queueMicrotask(() => {
        callback(...args);
      });
    };
  };

  useEffect(() => {
    loadData();
    resetForm();
  }, [entityType]);

  return {
    data,
    formData,
    selectedItem,
    isLoading,
    loadData,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleStatusAction,
    setFormDataForEdit,
    setFormData,
    resetForm,
    withFormReset,
    setSelectedItem,
  };
};
