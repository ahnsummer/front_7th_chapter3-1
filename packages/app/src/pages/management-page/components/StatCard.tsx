import React from "react";

interface StatCardProps {
  label: string;
  value: number;
  variant?: "info" | "success" | "warning" | "danger" | "default";
}

const variantStyles = {
  info: {
    bg: "bg-info-50 dark:bg-info-900/20",
    border: "border-info-300 dark:border-info-700",
    text: "text-info-700 dark:text-info-300",
  },
  success: {
    bg: "bg-success-50 dark:bg-success-900/20",
    border: "border-success-300 dark:border-success-700",
    text: "text-success-700 dark:text-success-300",
  },
  warning: {
    bg: "bg-warning-50 dark:bg-warning-900/20",
    border: "border-warning-300 dark:border-warning-700",
    text: "text-warning-700 dark:text-warning-300",
  },
  danger: {
    bg: "bg-danger-50 dark:bg-danger-900/20",
    border: "border-danger-300 dark:border-danger-700",
    text: "text-danger-700 dark:text-danger-300",
  },
  default: {
    bg: "bg-gray-50 dark:bg-gray-100",
    border: "border-gray-300 dark:border-gray-200",
    text: "text-gray-700 dark:text-gray-700",
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  variant = "default",
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={`px-3 py-2.5 sm:px-4 sm:py-3 ${styles.bg} border ${styles.border} rounded-sm`}>
      <div className="text-xs text-gray-600 dark:text-gray-600 mb-1">
        {label}
      </div>
      <div className={`text-xl sm:text-2xl font-bold ${styles.text}`}>{value}</div>
    </div>
  );
};
