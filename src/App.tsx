import { useState } from "react";
import { ProfileProvider } from "./context/ProfileContext";
import { ZoomProvider } from "./context/ZoomContext";
import AppShell from "./components/layout/AppShell";
import SettingsPage from "./components/settings/SettingsPage";
import DashboardPage from "./components/dashboard/DashboardPage";
import ComputePage from "./components/compute/ComputePage";
import StoragePage from "./components/storage/StoragePage";
import NetworkPage from "./components/network/NetworkPage";
import DatabasePage from "./components/database/DatabasePage";
import IamPage from "./components/iam/IamPage";
import "./App.css";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onNavigate={setCurrentPage} />;
      case "compute":
        return <ComputePage />;
      case "storage":
        return <StoragePage />;
      case "network":
        return <NetworkPage />;
      case "database":
        return <DatabasePage />;
      case "iam":
        return <IamPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </AppShell>
  );
}

export default function App() {
  return (
    <ZoomProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </ZoomProvider>
  );
}
