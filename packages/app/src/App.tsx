import React from "react";
import { Header } from "@repo/after";
import { ManagementPage } from "./pages/management-page/ManagementPage";
import "./index.css";
import "./styles/components.css";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        <ManagementPage />
      </main>
    </div>
  );
};
