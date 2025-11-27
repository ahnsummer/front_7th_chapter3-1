import React from "react";

interface StatCardProps {
  label: string;
  value: number;
  variant?: "info" | "success" | "warning" | "danger" | "default";
}

const variantStyles = {
  info: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-300 dark:border-blue-700",
    text: "text-blue-700 dark:text-blue-300",
  },
  success: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-300 dark:border-green-700",
    text: "text-green-700 dark:text-green-300",
  },
  warning: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-300 dark:border-orange-700",
    text: "text-orange-700 dark:text-orange-300",
  },
  danger: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-300 dark:border-red-700",
    text: "text-red-700 dark:text-red-300",
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
      className={`px-4 py-3 ${styles.bg} border ${styles.border} rounded-sm`}>
      <div className="text-xs text-gray-600 dark:text-gray-600 mb-1">
        {label}
      </div>
      <div className={`text-2xl font-bold ${styles.text}`}>{value}</div>
    </div>
  );
};
