import { useProfiles } from "../../context/ProfileContext";
import { useZoom } from "../../context/ZoomContext";
import "./TopBar.css";

export default function TopBar() {
  const { profiles, currentProfile, selectProfile } = useProfiles();
  const { zoom, zoomIn, zoomOut, resetZoom } = useZoom();

  const zoomPercentage = Math.round(zoom * 100);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-breadcrumb">OCI リソース管理</span>
      </div>
      <div className="topbar-right">
        <div className="topbar-zoom-controls">
          <button
            className="zoom-btn"
            onClick={zoomOut}
            title="縮小"
          >
            −
          </button>
          <button
            className="zoom-percentage"
            onClick={resetZoom}
            title="リセット (100%)"
          >
            {zoomPercentage}%
          </button>
          <button
            className="zoom-btn"
            onClick={zoomIn}
            title="拡大"
          >
            +
          </button>
        </div>
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
