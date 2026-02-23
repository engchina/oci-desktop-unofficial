use serde::{Deserialize, Serialize};

/// VCN (Virtual Cloud Network) 情報
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Vcn {
    /// VCN OCID
    pub id: String,
    /// 表示名
    #[serde(rename = "displayName", alias = "display_name")]
    pub display_name: String,
    /// CIDR ブロック
    #[serde(rename = "cidrBlock", alias = "cidr_block")]
    pub cidr_block: Option<String>,
    /// ライフサイクル状態
    #[serde(rename = "lifecycleState", alias = "lifecycle_state")]
    pub lifecycle_state: String,
    /// 作成日時
    #[serde(rename = "timeCreated", alias = "time_created")]
    pub time_created: Option<String>,
}
