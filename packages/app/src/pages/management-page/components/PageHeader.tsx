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
      <h1 className="text-2xl font-bold mb-1 text-foreground dark:text-foreground">
        {title}
      </h1>
      <p className="text-muted-foreground dark:text-muted-foreground text-sm">{description}</p>
    </div>
  );
};
