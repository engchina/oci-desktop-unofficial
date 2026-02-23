import { useState } from "react";
import { ProfileProvider } from "./context/ProfileContext";
import AppShell from "./components/layout/AppShell";
import SettingsPage from "./components/settings/SettingsPage";
import "./App.css";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("settings");

  const renderPage = () => {
    switch (currentPage) {
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <div className="placeholder-page">
            <h2>準備中</h2>
            <p>この機能は今後のアップデートで追加されます。</p>
          </div>
        );
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
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  );
}
