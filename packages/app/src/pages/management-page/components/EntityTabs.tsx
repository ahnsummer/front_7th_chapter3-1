import React from "react";
import { Button } from "@repo/after";

interface EntityTabsProps {
  entityType: "user" | "post";
  onEntityTypeChange: (type: "user" | "post") => void;
}

export const EntityTabs: React.FC<EntityTabsProps> = ({
  entityType,
  onEntityTypeChange,
}) => {
  return (
    <div className="mb-4 border-b-2 border-gray-300 pb-1">
      <Button
        variant={entityType === "post" ? "primary" : "secondary"}
        size="md"
        onClick={() => onEntityTypeChange("post")}
        className="mr-1">
        게시글
      </Button>
      <Button
        variant={entityType === "user" ? "primary" : "secondary"}
        size="md"
        onClick={() => onEntityTypeChange("user")}>
        사용자
      </Button>
    </div>
  );
};
