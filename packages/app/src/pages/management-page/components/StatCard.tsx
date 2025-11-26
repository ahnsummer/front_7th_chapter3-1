import React from "react";

interface StatCardProps {
  label: string;
  value: number;
  variant?: "info" | "success" | "warning" | "danger" | "default";
}

const variantStyles = {
  info: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-700",
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-700",
  },
  warning: {
    bg: "bg-orange-50",
    border: "border-orange-300",
    text: "text-orange-700",
  },
  danger: {
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-700",
  },
  default: {
    bg: "bg-gray-50",
    border: "border-gray-300",
    text: "text-gray-700",
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
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${styles.text}`}>{value}</div>
    </div>
  );
};
