use serde::{Deserialize, Serialize};

/// オブジェクトストレージバケット情報
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ObjectStorageBucket {
    /// バケット名
    pub name: String,
    /// コンパートメント OCID
    #[serde(rename = "compartmentId", alias = "compartment_id")]
    pub compartment_id: String,
    /// ネームスペース
    pub namespace: String,
    /// 作成日時
    #[serde(rename = "timeCreated", alias = "time_created")]
    pub time_created: Option<String>,
}
