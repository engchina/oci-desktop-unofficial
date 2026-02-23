use serde::{Deserialize, Serialize};

/// DB システム情報
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DbSystem {
    /// DB システム OCID
    pub id: String,
    /// 表示名
    #[serde(rename = "displayName", alias = "display_name")]
    pub display_name: String,
    /// DB バージョン
    #[serde(rename = "dbVersion", alias = "db_version")]
    pub db_version: Option<String>,
    /// ライフサイクル状態
    #[serde(rename = "lifecycleState", alias = "lifecycle_state")]
    pub lifecycle_state: String,
    /// シェイプ
    pub shape: Option<String>,
    /// 作成日時
    #[serde(rename = "timeCreated", alias = "time_created")]
    pub time_created: Option<String>,
}
