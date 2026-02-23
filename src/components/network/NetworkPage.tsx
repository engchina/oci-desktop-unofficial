import { useState } from "react";
import { useProfiles } from "../../context/ProfileContext";
import { listVcns } from "../../services/network.service";
import type { Vcn } from "../../types/profile";
import "../ResourcePage.css";

function stateClass(state: string): string {
    const s = state.toLowerCase();
    if (s === "available") return "available";
    if (s === "terminated" || s === "terminating") return "terminated";
    if (s === "provisioning") return "provisioning";
    return "default";
}

export default function NetworkPage() {
    const { currentProfile } = useProfiles();
    const [compartmentId, setCompartmentId] = useState("");
    const [vcns, setVcns] = useState<Vcn[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetched, setFetched] = useState(false);

    if (!currentProfile) {
        return (
            <div className="no-profile">
                <div className="no-profile-icon">🌐</div>
                <h3>プロファイルが未設定です</h3>
                <p>設定ページでプロファイルを追加してください。</p>
            </div>
        );
    }

    const handleFetch = async () => {
        if (!compartmentId.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const data = await listVcns(currentProfile.name, compartmentId);
            setVcns(data);
            setFetched(true);
        } catch (e) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resource-page">
            <div className="resource-page-header">
                <h2>
                    <span className="header-icon">🌐</span>
                    ネットワーク (VCN)
                </h2>
            </div>

            <div className="compartment-bar">
                <div className="field-group">
                    <span className="field-label">コンパートメント OCID</span>
                    <input
                        className="field-input"
                        type="text"
                        value={compartmentId}
                        onChange={(e) => setCompartmentId(e.target.value)}
                        placeholder="ocid1.compartment.oc1..xxxx"
                    />
                </div>
                <button
                    className="btn-fetch"
                    onClick={handleFetch}
                    disabled={loading || !compartmentId.trim()}
                >
                    {loading ? "取得中..." : "取得"}
                </button>
            </div>

            {error && <div className="resource-error">{error}</div>}

            {loading && (
                <div className="resource-loading">
                    <div className="spinner" />
                    データを取得中...
                </div>
            )}

            {!loading && fetched && vcns.length === 0 && (
                <div className="resource-empty">
                    <div className="empty-icon">🌐</div>
                    <h3>VCN が見つかりません</h3>
                    <p>このコンパートメントには VCN がありません。</p>
                </div>
            )}

            {!loading && vcns.length > 0 && (
                <div className="resource-table-wrapper">
                    <table className="resource-table">
                        <thead>
                            <tr>
                                <th>表示名</th>
                                <th>状態</th>
                                <th>CIDR ブロック</th>
                                <th>作成日時</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vcns.map((vcn) => (
                                <tr key={vcn.id}>
                                    <td title={vcn.display_name}>{vcn.display_name}</td>
                                    <td>
                                        <span
                                            className={`state-badge ${stateClass(vcn.lifecycle_state)}`}
                                        >
                                            {vcn.lifecycle_state}
                                        </span>
                                    </td>
                                    <td>{vcn.cidr_block ?? "—"}</td>
                                    <td>{vcn.time_created ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
