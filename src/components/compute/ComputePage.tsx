import { useState } from "react";
import { useProfiles } from "../../context/ProfileContext";
import { listInstances } from "../../services/compute.service";
import type { ComputeInstance } from "../../types/profile";
import "../ResourcePage.css";

function stateClass(state: string): string {
    const s = state.toLowerCase();
    if (s === "running") return "running";
    if (s === "stopped") return "stopped";
    if (s === "terminated") return "terminated";
    if (["provisioning", "starting", "stopping", "creating"].includes(s))
        return "provisioning";
    return "default";
}

export default function ComputePage() {
    const { currentProfile } = useProfiles();
    const [compartmentId, setCompartmentId] = useState("");
    const [instances, setInstances] = useState<ComputeInstance[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetched, setFetched] = useState(false);

    if (!currentProfile) {
        return (
            <div className="no-profile">
                <div className="no-profile-icon">🖥️</div>
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
            const data = await listInstances(currentProfile.name, compartmentId);
            setInstances(data);
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
                    <span className="header-icon">🖥️</span>
                    コンピュートインスタンス
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

            {!loading && fetched && instances.length === 0 && (
                <div className="resource-empty">
                    <div className="empty-icon">🖥️</div>
                    <h3>インスタンスが見つかりません</h3>
                    <p>このコンパートメントにはインスタンスがありません。</p>
                </div>
            )}

            {!loading && instances.length > 0 && (
                <div className="resource-table-wrapper">
                    <table className="resource-table">
                        <thead>
                            <tr>
                                <th>表示名</th>
                                <th>状態</th>
                                <th>シェイプ</th>
                                <th>可用性ドメイン</th>
                                <th>作成日時</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instances.map((inst) => (
                                <tr key={inst.id}>
                                    <td title={inst.display_name}>{inst.display_name}</td>
                                    <td>
                                        <span
                                            className={`state-badge ${stateClass(inst.lifecycle_state)}`}
                                        >
                                            {inst.lifecycle_state}
                                        </span>
                                    </td>
                                    <td>{inst.shape}</td>
                                    <td>{inst.availability_domain}</td>
                                    <td>{inst.time_created ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
