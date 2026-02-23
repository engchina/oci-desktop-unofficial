use serde::{Deserialize, Serialize};

/// コンピュートインスタンス情報
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComputeInstance {
    /// インスタンス OCID
    pub id: String,
    /// 表示名
    #[serde(rename = "displayName", alias = "display_name")]
    pub display_name: String,
    /// シェイプ（例: VM.Standard.E4.Flex）
    pub shape: String,
    /// ライフサイクル状態
    #[serde(rename = "lifecycleState", alias = "lifecycle_state")]
    pub lifecycle_state: String,
    /// 可用性ドメイン
    #[serde(rename = "availabilityDomain", alias = "availability_domain")]
    pub availability_domain: String,
    /// 作成日時
    #[serde(rename = "timeCreated", alias = "time_created")]
    pub time_created: Option<String>,
}
