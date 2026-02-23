use serde::{Deserialize, Serialize};

/// IAM ユーザー情報
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IamUser {
    /// ユーザー OCID
    pub id: String,
    /// ユーザー名
    pub name: String,
    /// 説明
    pub description: Option<String>,
    /// ライフサイクル状態
    #[serde(rename = "lifecycleState", alias = "lifecycle_state")]
    pub lifecycle_state: String,
    /// 作成日時
    #[serde(rename = "timeCreated", alias = "time_created")]
    pub time_created: Option<String>,
}

/// IAM グループ情報
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IamGroup {
    /// グループ OCID
    pub id: String,
    /// グループ名
    pub name: String,
    /// 説明
    pub description: Option<String>,
    /// ライフサイクル状態
    #[serde(rename = "lifecycleState", alias = "lifecycle_state")]
    pub lifecycle_state: String,
    /// 作成日時
    #[serde(rename = "timeCreated", alias = "time_created")]
    pub time_created: Option<String>,
}
