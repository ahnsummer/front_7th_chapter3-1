import React from "react";
import { useDarkMode } from "../hooks/useDarkMode";

export const DarkModeToggle: React.FC = () => {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      className="w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-secondary dark:bg-secondary-200 hover:bg-secondary-hover dark:hover:bg-secondary-300 transition-colors touch-manipulation"
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}>
      <span className="text-lg sm:text-base">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
};
