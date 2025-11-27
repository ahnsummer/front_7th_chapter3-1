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
    <div className="mb-4 border-b-2 border-gray-300 dark:border-gray-200 pb-2 sm:pb-1">
      <div className="flex gap-2 sm:gap-1">
        <Button
          variant={entityType === "post" ? "primary" : "secondary"}
          size="md"
          onClick={() => onEntityTypeChange("post")}
          className="flex-1 sm:flex-none min-h-[44px] sm:min-h-0">
          게시글
        </Button>
        <Button
          variant={entityType === "user" ? "primary" : "secondary"}
          size="md"
          onClick={() => onEntityTypeChange("user")}
          className="flex-1 sm:flex-none min-h-[44px] sm:min-h-0">
          사용자
        </Button>
      </div>
    </div>
  );
};
