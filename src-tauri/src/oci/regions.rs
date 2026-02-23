use serde::{Deserialize, Serialize};

/// OCI リージョン情報
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OciRegion {
    /// リージョンコード（例: "ap-tokyo-1"）
    pub code: String,
    /// 表示名（日本語）
    pub display_name: String,
}

/// 利用可能な OCI リージョン一覧を取得
pub fn get_available_regions() -> Vec<OciRegion> {
    vec![
        // アジア太平洋
        OciRegion { code: "ap-tokyo-1".into(), display_name: "東京".into() },
        OciRegion { code: "ap-osaka-1".into(), display_name: "大阪".into() },
        OciRegion { code: "ap-seoul-1".into(), display_name: "ソウル".into() },
        OciRegion { code: "ap-singapore-1".into(), display_name: "シンガポール".into() },
        OciRegion { code: "ap-mumbai-1".into(), display_name: "ムンバイ".into() },
        OciRegion { code: "ap-sydney-1".into(), display_name: "シドニー".into() },
        OciRegion { code: "ap-melbourne-1".into(), display_name: "メルボルン".into() },
        OciRegion { code: "ap-hyderabad-1".into(), display_name: "ハイデラバード".into() },
        OciRegion { code: "ap-chuncheon-1".into(), display_name: "春川".into() },
        // 北米
        OciRegion { code: "us-ashburn-1".into(), display_name: "アッシュバーン".into() },
        OciRegion { code: "us-phoenix-1".into(), display_name: "フェニックス".into() },
        OciRegion { code: "us-sanjose-1".into(), display_name: "サンノゼ".into() },
        OciRegion { code: "us-chicago-1".into(), display_name: "シカゴ".into() },
        OciRegion { code: "ca-toronto-1".into(), display_name: "トロント".into() },
        OciRegion { code: "ca-montreal-1".into(), display_name: "モントリオール".into() },
        // ヨーロッパ
        OciRegion { code: "eu-frankfurt-1".into(), display_name: "フランクフルト".into() },
        OciRegion { code: "eu-amsterdam-1".into(), display_name: "アムステルダム".into() },
        OciRegion { code: "eu-zurich-1".into(), display_name: "チューリッヒ".into() },
        OciRegion { code: "eu-stockholm-1".into(), display_name: "ストックホルム".into() },
        OciRegion { code: "eu-madrid-1".into(), display_name: "マドリード".into() },
        OciRegion { code: "eu-marseille-1".into(), display_name: "マルセイユ".into() },
        OciRegion { code: "eu-milan-1".into(), display_name: "ミラノ".into() },
        OciRegion { code: "eu-paris-1".into(), display_name: "パリ".into() },
        OciRegion { code: "uk-london-1".into(), display_name: "ロンドン".into() },
        OciRegion { code: "uk-cardiff-1".into(), display_name: "カーディフ".into() },
        // 中東・アフリカ
        OciRegion { code: "me-jeddah-1".into(), display_name: "ジェッダ".into() },
        OciRegion { code: "me-dubai-1".into(), display_name: "ドバイ".into() },
        OciRegion { code: "af-johannesburg-1".into(), display_name: "ヨハネスブルグ".into() },
        // 南米
        OciRegion { code: "sa-saopaulo-1".into(), display_name: "サンパウロ".into() },
        OciRegion { code: "sa-vinhedo-1".into(), display_name: "ヴィニェード".into() },
    ]
}

/// リージョンコードから API エンドポイントのホスト名を生成
pub fn region_to_endpoint(region: &str, service: &str) -> String {
    format!("{}.{}.oraclecloud.com", service, region)
}
