use serde::{Deserialize, Serialize};

/// OCI プロファイル設定
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OciProfile {
    /// プロファイル名（例: "DEFAULT", "PRODUCTION"）
    pub name: String,
    /// ユーザー OCID
    pub user: String,
    /// テナンシー OCID
    pub tenancy: String,
    /// リージョン（例: "ap-tokyo-1"）
    pub region: String,
    /// API キーフィンガープリント
    pub fingerprint: String,
    /// 秘密鍵ファイルパス
    pub key_file: String,
}

/// 接続テスト結果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectionResult {
    /// 接続成功かどうか
    pub success: bool,
    /// メッセージ
    pub message: String,
}

/// バリデーション結果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidationResult {
    /// 有効かどうか
    pub valid: bool,
    /// エラーメッセージ一覧
    pub errors: Vec<String>,
}
