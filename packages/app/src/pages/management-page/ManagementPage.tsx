import React, { useState } from "react";
import { Button, Table } from "@repo/after";
import type { User } from "@/services/userService";
import type { Post } from "@/services/postService";
import { PageHeader } from "@/pages/management-page/components/PageHeader";
import { EntityTabs } from "@/pages/management-page/components/EntityTabs";
import { StatsSection } from "@/pages/management-page/components/StatsSection";
import { AlertSection } from "@/pages/management-page/components/AlertSection";
import { CreateModal } from "@/pages/management-page/components/CreateModal";
import { EditModal } from "@/pages/management-page/components/EditModal";
import { useEntityManagement } from "@/pages/management-page/hooks/useEntityManagement";
import {
  getUserColumns,
  getPostColumns,
} from "@/pages/management-page/utils/table-columns";
import {
  calculateUserStats,
  calculatePostStats,
} from "@/pages/management-page/utils/stats-helpers";

type EntityType = "user" | "post";

export const ManagementPage: React.FC = () => {
  const [entityType, setEntityType] = useState<EntityType>("post");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSuccess = (message: string) => {
    setAlertMessage(message);
    setShowSuccessAlert(true);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowErrorAlert(true);
  };

  const entityManager = useEntityManagement(
    entityType,
    handleSuccess,
    handleError
  );

  const handleEdit = (item: User | Post) => {
    entityManager.setSelectedItem(item);
    entityManager.setFormDataForEdit(item);
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async () => {
    try {
      await entityManager.handleCreate(entityManager.formData);
      setIsCreateModalOpen(false);
      entityManager.resetForm();
    } catch {
      // Error already handled in hook
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      await entityManager.handleUpdate(entityManager.formData);
      setIsEditModalOpen(false);
      entityManager.resetForm();
    } catch {
      // Error already handled in hook
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    entityManager.resetForm();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    entityManager.resetForm();
  };

  const stats =
    entityType === "user"
      ? calculateUserStats(entityManager.data as User[])
      : calculatePostStats(entityManager.data as Post[]);

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
            onEntityTypeChange={entityManager.withFormReset(setEntityType)}
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
                  columns={getUserColumns({
                    onEdit: handleEdit,
                    onDelete: entityManager.handleDelete,
                  })}
                  data={entityManager.data as User[]}
                  striped
                  hover
                />
              ) : (
                <Table
                  columns={getPostColumns({
                    onEdit: handleEdit,
                    onDelete: entityManager.handleDelete,
                    onStatusAction: entityManager.handleStatusAction,
                  })}
                  data={entityManager.data as Post[]}
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
        formData={entityManager.formData}
        onFormDataChange={entityManager.setFormData}
        onClose={handleCloseCreateModal}
        onCreate={handleCreateSubmit}
      />

      <EditModal
        isOpen={isEditModalOpen}
        entityType={entityType}
        selectedItem={entityManager.selectedItem}
        formData={entityManager.formData}
        onFormDataChange={entityManager.setFormData}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateSubmit}
      />
    </div>
  );
};
