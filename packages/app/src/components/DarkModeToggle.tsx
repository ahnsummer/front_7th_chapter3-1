import React from "react";
import { useDarkMode } from "../hooks/useDarkMode";

export const DarkModeToggle: React.FC = () => {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-200 hover:bg-gray-200 dark:hover:bg-gray-300 transition-colors"
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}>
      {isDark ? "☀️" : "🌙"}
    </button>
  );
};

