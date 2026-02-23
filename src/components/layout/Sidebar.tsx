import "./Sidebar.css";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "ダッシュボード", icon: "📊", enabled: true },
  { id: "compute", label: "コンピュート", icon: "🖥️", enabled: true },
  { id: "storage", label: "オブジェクトストレージ", icon: "📦", enabled: true },
  { id: "network", label: "ネットワーク", icon: "🌐", enabled: true },
  { id: "database", label: "データベース", icon: "🗄️", enabled: true },
  { id: "iam", label: "IAM", icon: "🔑", enabled: true },
  { id: "settings", label: "設定", icon: "⚙️", enabled: true },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">OCI Desktop</h1>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`sidebar-item ${currentPage === item.id ? "active" : ""} ${!item.enabled ? "disabled" : ""}`}
            onClick={() => item.enabled && onNavigate(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
            {!item.enabled && <span className="sidebar-badge">準備中</span>}
          </li>
        ))}
      </ul>
    </nav>
  );
}
