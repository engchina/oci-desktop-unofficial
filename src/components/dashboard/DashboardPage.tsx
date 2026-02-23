import { useProfiles } from "../../context/ProfileContext";
import "../ResourcePage.css";

interface DashboardPageProps {
    onNavigate: (page: string) => void;
}

const cards = [
    {
        id: "compute",
        icon: "🖥️",
        title: "コンピュート",
        desc: "インスタンスの管理、状態確認、シェイプ情報の表示",
    },
    {
        id: "storage",
        icon: "📦",
        title: "オブジェクトストレージ",
        desc: "バケットの一覧表示と管理",
    },
    {
        id: "network",
        icon: "🌐",
        title: "ネットワーク",
        desc: "VCN（仮想クラウドネットワーク）の管理",
    },
    {
        id: "database",
        icon: "🗄️",
        title: "データベース",
        desc: "DB システムの一覧表示と状態確認",
    },
    {
        id: "iam",
        icon: "🔑",
        title: "IAM",
        desc: "ユーザー・グループの管理",
    },
];

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
    const { currentProfile } = useProfiles();

    if (!currentProfile) {
        return (
            <div className="no-profile">
                <div className="no-profile-icon">⚙️</div>
                <h3>プロファイルが未設定です</h3>
                <p>設定ページでプロファイルを追加してください。</p>
            </div>
        );
    }

    return (
        <div className="resource-page">
            <div className="resource-page-header">
                <h2>
                    <span className="header-icon">📊</span>
                    ダッシュボード
                </h2>
            </div>

            <div className="profile-info-card">
                <h3>現在のプロファイル</h3>
                <div className="profile-info-grid">
                    <div className="profile-info-item">
                        <span className="info-label">プロファイル名</span>
                        <span className="info-value">{currentProfile.name}</span>
                    </div>
                    <div className="profile-info-item">
                        <span className="info-label">リージョン</span>
                        <span className="info-value">{currentProfile.region}</span>
                    </div>
                    <div className="profile-info-item">
                        <span className="info-label">テナンシー OCID</span>
                        <span className="info-value">{currentProfile.tenancy}</span>
                    </div>
                    <div className="profile-info-item">
                        <span className="info-label">ユーザー OCID</span>
                        <span className="info-value">{currentProfile.user}</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className="dashboard-card"
                        onClick={() => onNavigate(card.id)}
                    >
                        <div className="dashboard-card-header">
                            <span className="dashboard-card-icon">{card.icon}</span>
                            <span className="dashboard-card-title">{card.title}</span>
                        </div>
                        <div className="dashboard-card-desc">{card.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
