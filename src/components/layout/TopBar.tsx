import { useProfiles } from "../../context/ProfileContext";
import "./TopBar.css";

export default function TopBar() {
  const { profiles, currentProfile, selectProfile } = useProfiles();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-breadcrumb">OCI リソース管理</span>
      </div>
      <div className="topbar-right">
        <label className="topbar-profile-label">プロファイル:</label>
        <select
          className="topbar-profile-select"
          value={currentProfile?.name ?? ""}
          onChange={(e) => selectProfile(e.target.value)}
          disabled={profiles.length === 0}
        >
          {profiles.length === 0 && (
            <option value="">未設定</option>
          )}
          {profiles.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
