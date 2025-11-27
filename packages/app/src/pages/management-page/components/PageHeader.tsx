import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-900">
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-600 text-sm">{description}</p>
    </div>
  );
};
