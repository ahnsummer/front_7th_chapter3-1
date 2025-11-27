import React, { useState, useEffect } from "react";
import { Button, Table, Badge } from "@repo/after";
import type { Column } from "@repo/after";
import { userService, type User } from "@/services/userService";
import { postService, type Post } from "@/services/postService";
import { PageHeader } from "@/pages/management-page/components/PageHeader";
import { EntityTabs } from "@/pages/management-page/components/EntityTabs";
import { StatsSection } from "@/pages/management-page/components/StatsSection";
import { AlertSection } from "@/pages/management-page/components/AlertSection";
import { CreateModal } from "@/pages/management-page/components/CreateModal";
import { EditModal } from "@/pages/management-page/components/EditModal";

type EntityType = "user" | "post";
type Entity = User | Post;

export const ManagementPage: React.FC = () => {
  const [entityType, setEntityType] = useState<EntityType>("post");
  const [data, setData] = useState<Entity[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
    setFormData({});
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedItem(null);
  }, [entityType]);

  const loadData = async () => {
    try {
      let result: Entity[];

      if (entityType === "user") {
        result = await userService.getAll();
      } else {
        result = await postService.getAll();
      }

      setData(result);
    } catch (error: any) {
      setErrorMessage("데이터를 불러오는데 실패했습니다");
      setShowErrorAlert(true);
    }
  };

  const handleCreate = async () => {
    try {
      if (entityType === "user") {
        await userService.create({
          username: formData.username,
          email: formData.email,
          role: formData.role || "user",
          status: formData.status || "active",
        });
      } else {
        await postService.create({
          title: formData.title,
          content: formData.content || "",
          author: formData.author,
          category: formData.category,
          status: formData.status || "draft",
        });
      }

      await loadData();
      setIsCreateModalOpen(false);
      setFormData({});
      setAlertMessage(
        `${entityType === "user" ? "사용자" : "게시글"}가 생성되었습니다`
      );
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || "생성에 실패했습니다");
      setShowErrorAlert(true);
    }
  };

  const handleEdit = (item: Entity) => {
    setSelectedItem(item);

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

    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;

    try {
      if (entityType === "user") {
        await userService.update(selectedItem.id, formData);
      } else {
        await postService.update(selectedItem.id, formData);
      }

      await loadData();
      setIsEditModalOpen(false);
      setFormData({});
      setSelectedItem(null);
      setAlertMessage(
        `${entityType === "user" ? "사용자" : "게시글"}가 수정되었습니다`
      );
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || "수정에 실패했습니다");
      setShowErrorAlert(true);
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
      setAlertMessage("삭제되었습니다");
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || "삭제에 실패했습니다");
      setShowErrorAlert(true);
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
      setAlertMessage(`${message}되었습니다`);
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || "작업에 실패했습니다");
      setShowErrorAlert(true);
    }
  };

  const getStats = () => {
    if (entityType === "user") {
      const users = data as User[];
      return {
        total: users.length,
        stat1: {
          label: "활성",
          value: users.filter((u) => u.status === "active").length,
          color: "#2e7d32",
        },
        stat2: {
          label: "비활성",
          value: users.filter((u) => u.status === "inactive").length,
          color: "#ed6c02",
        },
        stat3: {
          label: "정지",
          value: users.filter((u) => u.status === "suspended").length,
          color: "#d32f2f",
        },
        stat4: {
          label: "관리자",
          value: users.filter((u) => u.role === "admin").length,
          color: "#1976d2",
        },
      };
    } else {
      const posts = data as Post[];
      return {
        total: posts.length,
        stat1: {
          label: "게시됨",
          value: posts.filter((p) => p.status === "published").length,
          color: "#2e7d32",
        },
        stat2: {
          label: "임시저장",
          value: posts.filter((p) => p.status === "draft").length,
          color: "#ed6c02",
        },
        stat3: {
          label: "보관됨",
          value: posts.filter((p) => p.status === "archived").length,
          color: "rgba(0, 0, 0, 0.6)",
        },
        stat4: {
          label: "총 조회수",
          value: posts.reduce((sum, p) => sum + p.views, 0),
          color: "#1976d2",
        },
      };
    }
  };

  const getUserColumns = () => {
    const columns: Column<User>[] = [
      { key: "id", header: "ID", width: "60px" },
      { key: "username", header: "사용자명", width: "150px" },
      { key: "email", header: "이메일" },
      {
        key: "role",
        header: "역할",
        width: "120px",
        render: (user: User) => {
          const roleConfig: Record<
            "admin" | "moderator" | "user" | "guest",
            {
              variant: "danger" | "warning" | "primary" | "secondary";
              text: string;
            }
          > = {
            admin: { variant: "danger", text: "관리자" },
            moderator: { variant: "warning", text: "운영자" },
            user: { variant: "primary", text: "사용자" },
            guest: { variant: "secondary", text: "게스트" },
          };

          const config = roleConfig[user.role];
          return (
            <Badge variant={config.variant} showIcon>
              {config.text}
            </Badge>
          );
        },
      },
      {
        key: "status",
        header: "상태",
        width: "120px",
        render: (user: User) => {
          const statusConfig: Record<
            User["status"],
            { variant: "success" | "warning" | "danger"; text: string }
          > = {
            active: { variant: "success", text: "활성" },
            inactive: { variant: "warning", text: "비활성" },
            suspended: { variant: "danger", text: "정지" },
          };

          const config = statusConfig[user.status];
          return (
            <Badge variant={config.variant} showIcon>
              {config.text}
            </Badge>
          );
        },
      },
      { key: "createdAt", header: "생성일", width: "120px" },
      {
        key: "lastLogin",
        header: "마지막 로그인",
        width: "140px",
        render: (user: User) => user.lastLogin || "-",
      },
      {
        key: "actions",
        header: "관리",
        width: "200px",
        render: (user: User) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleEdit(user)}>
              수정
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(user.id)}>
              삭제
            </Button>
          </div>
        ),
      },
    ];
    return columns;
  };

  const getPostColumns = () => {
    const columns: Column<Post>[] = [
      { key: "id", header: "ID", width: "60px" },
      { key: "title", header: "제목" },
      { key: "author", header: "작성자", width: "120px" },
      {
        key: "category",
        header: "카테고리",
        width: "140px",
        render: (post: Post) => {
          const categoryConfig: Record<
            Post["category"],
            "primary" | "info" | "danger" | "secondary"
          > = {
            development: "primary",
            design: "info",
            accessibility: "danger",
            news: "secondary",
          };
          return (
            <Badge variant={categoryConfig[post.category]} pill>
              {post.category}
            </Badge>
          );
        },
      },
      {
        key: "status",
        header: "상태",
        width: "120px",
        render: (post: Post) => {
          const statusConfig: Record<
            "published" | "draft" | "archived" | "pending" | "rejected",
            {
              variant: "success" | "warning" | "secondary" | "info" | "danger";
              text: string;
            }
          > = {
            published: { variant: "success", text: "게시됨" },
            draft: { variant: "warning", text: "임시저장" },
            archived: { variant: "secondary", text: "보관됨" },
            pending: { variant: "info", text: "대기중" },
            rejected: { variant: "danger", text: "거부됨" },
          };
          const config = statusConfig[post.status];
          return (
            <Badge variant={config.variant} showIcon>
              {config.text}
            </Badge>
          );
        },
      },
      {
        key: "views",
        header: "조회수",
        width: "100px",
        render: (post: Post) => post.views.toLocaleString(),
      },
      { key: "createdAt", header: "작성일", width: "120px" },
      {
        key: "actions",
        header: "관리",
        width: "250px",
        render: (post: Post) => (
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleEdit(post)}>
              수정
            </Button>
            {post.status === "draft" && (
              <Button
                size="sm"
                variant="success"
                onClick={() => handleStatusAction(post.id, "publish")}>
                게시
              </Button>
            )}
            {post.status === "published" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleStatusAction(post.id, "archive")}>
                보관
              </Button>
            )}
            {post.status === "archived" && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleStatusAction(post.id, "restore")}>
                복원
              </Button>
            )}
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(post.id)}>
              삭제
            </Button>
          </div>
        ),
      },
    ];
    return columns;
  };

  const stats = getStats();

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData({});
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setFormData({});
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1200px] mx-auto p-5">
        <PageHeader
          title="관리 시스템"
          description="사용자와 게시글을 관리하세요"
        />

        <div className="bg-white border border-gray-300 p-2.5">
          <EntityTabs
            entityType={entityType}
            onEntityTypeChange={(type) => {
              setData([]);
              queueMicrotask(() => {
                setEntityType(type);
              });
            }}
          />

          <div>
            <div className="mb-4 text-right">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsCreateModalOpen(true)}>
                새로 만들기
              </Button>
            </div>

            <AlertSection
              showSuccess={showSuccessAlert}
              showError={showErrorAlert}
              successMessage={alertMessage}
              errorMessage={errorMessage}
              onCloseSuccess={() => setShowSuccessAlert(false)}
              onCloseError={() => setShowErrorAlert(false)}
            />

            <StatsSection {...stats} />

            <div className="border border-gray-300 bg-white overflow-auto">
              {entityType === "user" ? (
                <Table
                  columns={getUserColumns()}
                  data={data as User[]}
                  striped
                  hover
                />
              ) : (
                <Table
                  columns={getPostColumns()}
                  data={data as Post[]}
                  striped
                  hover
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateModal
        isOpen={isCreateModalOpen}
        entityType={entityType}
        formData={formData}
        onFormDataChange={setFormData}
        onClose={handleCloseCreateModal}
        onCreate={handleCreate}
      />

      <EditModal
        isOpen={isEditModalOpen}
        entityType={entityType}
        selectedItem={selectedItem}
        formData={formData}
        onFormDataChange={setFormData}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdate}
      />
    </div>
  );
};
