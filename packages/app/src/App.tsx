import React from "react";
import { Header } from "@repo/after";
import { ManagementPage } from "./pages/management-page/ManagementPage";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { useDarkMode } from "./hooks/useDarkMode";
import "./index.css";

export const App: React.FC = () => {
  useDarkMode(); // 다크모드 초기화

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background">
      <div className="relative">
        <Header />
        <div className="fixed top-4 right-4 z-[60]">
          <DarkModeToggle />
        </div>
      </div>
      <main>
        <ManagementPage />
      </main>
    </div>
  );
};
