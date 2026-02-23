import type { OciProfile } from "../../types/profile";
import "./ProfileList.css";

interface ProfileListProps {
  profiles: OciProfile[];
  selectedName: string | null;
  onSelect: (name: string) => void;
  onAdd: () => void;
}

export default function ProfileList({
  profiles,
  selectedName,
  onSelect,
  onAdd,
}: ProfileListProps) {
  return (
    <div className="profile-list">
      <div className="profile-list-header">
        <h3 className="profile-list-title">プロファイル</h3>
        <button className="profile-add-btn" onClick={onAdd}>
          + 新規作成
        </button>
      </div>
      <div className="profile-list-items">
        {profiles.length === 0 ? (
          <div className="profile-list-empty">
            プロファイルが設定されていません。
            <br />
            「新規作成」で追加してください。
          </div>
        ) : (
          profiles.map((p) => (
            <div
              key={p.name}
              className={`profile-card ${selectedName === p.name ? "selected" : ""}`}
              onClick={() => onSelect(p.name)}
            >
              <div className="profile-card-name">{p.name}</div>
              <div className="profile-card-region">{p.region}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
