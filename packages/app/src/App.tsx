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
        <div className="fixed top-2 right-2 sm:top-3 sm:right-3 md:top-3 md:right-3 lg:top-4 lg:right-4 z-[60]">
          <DarkModeToggle />
        </div>
      </div>
      <main className="pt-14 sm:pt-0">
        <ManagementPage />
      </main>
    </div>
  );
};
