import { useState } from "react";
import { useProfiles } from "../../context/ProfileContext";
import { listUsers, listGroups } from "../../services/iam.service";
import type { IamUser, IamGroup } from "../../types/profile";
import "../ResourcePage.css";

function stateClass(state: string): string {
    const s = state.toLowerCase();
    if (s === "active") return "active";
    if (s === "inactive" || s === "deleted") return "inactive";
    if (s === "creating") return "creating";
    return "default";
}

export default function IamPage() {
    const { currentProfile } = useProfiles();
    const [tab, setTab] = useState<"users" | "groups">("users");
    const [users, setUsers] = useState<IamUser[]>([]);
    const [groups, setGroups] = useState<IamGroup[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usersFetched, setUsersFetched] = useState(false);
    const [groupsFetched, setGroupsFetched] = useState(false);

    if (!currentProfile) {
        return (
            <div className="no-profile">
                <div className="no-profile-icon">🔑</div>
                <h3>プロファイルが未設定です</h3>
                <p>設定ページでプロファイルを追加してください。</p>
            </div>
        );
    }

    const handleFetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listUsers(currentProfile.name);
            setUsers(data);
            setUsersFetched(true);
        } catch (e) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
    };

    const handleFetchGroups = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listGroups(currentProfile.name);
            setGroups(data);
            setGroupsFetched(true);
        } catch (e) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
    };

    const handleFetch = () => {
        if (tab === "users") handleFetchUsers();
        else handleFetchGroups();
    };

    const fetched = tab === "users" ? usersFetched : groupsFetched;
    const items = tab === "users" ? users : groups;

    return (
        <div className="resource-page">
            <div className="resource-page-header">
                <h2>
                    <span className="header-icon">🔑</span>
                    IAM（ID・アクセス管理）
                </h2>
                <div className="header-actions">
                    <button
                        className="btn-fetch"
                        onClick={handleFetch}
                        disabled={loading}
                        style={{ padding: "8px 18px", fontSize: "13px" }}
                    >
                        {loading ? "取得中..." : "取得"}
                    </button>
                </div>
            </div>

            <div className="iam-tabs">
                <button
                    className={`iam-tab ${tab === "users" ? "active" : ""}`}
                    onClick={() => setTab("users")}
                >
                    ユーザー
                </button>
                <button
                    className={`iam-tab ${tab === "groups" ? "active" : ""}`}
                    onClick={() => setTab("groups")}
                >
                    グループ
                </button>
            </div>

            {error && <div className="resource-error">{error}</div>}

            {loading && (
                <div className="resource-loading">
                    <div className="spinner" />
                    データを取得中...
                </div>
            )}

            {!loading && fetched && items.length === 0 && (
                <div className="resource-empty">
                    <div className="empty-icon">🔑</div>
                    <h3>
                        {tab === "users"
                            ? "ユーザーが見つかりません"
                            : "グループが見つかりません"}
                    </h3>
                    <p>データがありません。</p>
                </div>
            )}

            {!loading && items.length > 0 && (
                <div className="resource-table-wrapper">
                    <table className="resource-table">
                        <thead>
                            <tr>
                                <th>名前</th>
                                <th>状態</th>
                                <th>説明</th>
                                <th>作成日時</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td title={item.name}>{item.name}</td>
                                    <td>
                                        <span
                                            className={`state-badge ${stateClass(item.lifecycle_state)}`}
                                        >
                                            {item.lifecycle_state}
                                        </span>
                                    </td>
                                    <td>{item.description ?? "—"}</td>
                                    <td>{item.time_created ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
