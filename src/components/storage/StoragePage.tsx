import { useState } from "react";
import { useProfiles } from "../../context/ProfileContext";
import { getNamespace, listBuckets } from "../../services/storage.service";
import type { ObjectStorageBucket } from "../../types/profile";
import "../ResourcePage.css";

export default function StoragePage() {
    const { currentProfile } = useProfiles();
    const [compartmentId, setCompartmentId] = useState("");
    const [buckets, setBuckets] = useState<ObjectStorageBucket[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetched, setFetched] = useState(false);

    if (!currentProfile) {
        return (
            <div className="no-profile">
                <div className="no-profile-icon">📦</div>
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
            const ns = await getNamespace(currentProfile.name);
            const data = await listBuckets(currentProfile.name, compartmentId, ns);
            setBuckets(data);
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
                    <span className="header-icon">📦</span>
                    オブジェクトストレージ
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

            {!loading && fetched && buckets.length === 0 && (
                <div className="resource-empty">
                    <div className="empty-icon">📦</div>
                    <h3>バケットが見つかりません</h3>
                    <p>このコンパートメントにはバケットがありません。</p>
                </div>
            )}

            {!loading && buckets.length > 0 && (
                <div className="resource-table-wrapper">
                    <table className="resource-table">
                        <thead>
                            <tr>
                                <th>バケット名</th>
                                <th>ネームスペース</th>
                                <th>コンパートメント ID</th>
                                <th>作成日時</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buckets.map((b) => (
                                <tr key={b.name}>
                                    <td title={b.name}>{b.name}</td>
                                    <td>{b.namespace}</td>
                                    <td title={b.compartment_id}>{b.compartment_id}</td>
                                    <td>{b.time_created ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
