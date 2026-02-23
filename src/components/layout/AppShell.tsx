import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "./AppShell.css";

interface AppShellProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: ReactNode;
}

export default function AppShell({
  currentPage,
  onNavigate,
  children,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="app-main">
        <TopBar />
        <div className="app-content">{children}</div>
      </div>
    </div>
  );
}
