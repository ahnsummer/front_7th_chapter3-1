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
    <div className="mb-4 sm:mb-5">
      <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-1.5 text-foreground dark:text-foreground">
        {title}
      </h1>
      <p className="text-muted-foreground dark:text-muted-foreground text-xs sm:text-sm leading-relaxed">{description}</p>
    </div>
  );
};
