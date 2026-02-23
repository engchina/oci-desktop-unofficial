use std::path::Path;

use reqwest::Method;

use crate::models::profile::{ConnectionResult, OciProfile, ValidationResult};
use crate::oci::config_parser;
use crate::oci::regions::region_to_endpoint;
use crate::oci::signature::{sign_request, SigningRequest};

/// プロファイルの入力値を検証
#[tauri::command]
pub fn validate_profile(profile: OciProfile) -> ValidationResult {
    let mut errors = Vec::new();
    let ocid_pattern = regex_lite::Regex::new(r"^ocid1\.[a-z]+\.oc[0-9]+\.").unwrap();

    // プロファイル名チェック
    if profile.name.trim().is_empty() {
        errors.push("プロファイル名を入力してください。".to_string());
    }

    // ユーザー OCID チェック
    if !ocid_pattern.is_match(&profile.user) {
        errors.push("ユーザー OCID の形式が無効です。（例: ocid1.user.oc1..xxx）".to_string());
    }

    // テナンシー OCID チェック
    if !ocid_pattern.is_match(&profile.tenancy) {
        errors.push(
            "テナンシー OCID の形式が無効です。（例: ocid1.tenancy.oc1..xxx）".to_string(),
        );
    }

    // リージョンチェック
    if profile.region.trim().is_empty() {
        errors.push("リージョンを選択してください。".to_string());
    }

    // フィンガープリントチェック
    let fp_pattern =
        regex_lite::Regex::new(r"^([0-9a-fA-F]{2}:){15}[0-9a-fA-F]{2}$").unwrap();
    if !fp_pattern.is_match(&profile.fingerprint) {
        errors.push(
            "フィンガープリントの形式が無効です。（例: aa:bb:cc:dd:...）".to_string(),
        );
    }

    // 秘密鍵ファイルチェック
    if profile.key_file.trim().is_empty() {
        errors.push("秘密鍵ファイルのパスを指定してください。".to_string());
    } else if !Path::new(&profile.key_file).exists() {
        errors.push("指定された秘密鍵ファイルが見つかりません。".to_string());
    }

    ValidationResult {
        valid: errors.is_empty(),
        errors,
    }
}

/// 接続テスト: OCI Identity API を呼び出して認証を検証
#[tauri::command]
pub async fn test_connection(
    profile_name: String,
    config_path: Option<String>,
) -> Result<ConnectionResult, String> {
    // プロファイルを読み込み
    let cfg_path = match config_path {
        Some(p) => std::path::PathBuf::from(p),
        None => config_parser::default_config_path(),
    };

    let profiles = config_parser::parse_config(&cfg_path)?;
    let profile = profiles
        .into_iter()
        .find(|p| p.name == profile_name)
        .ok_or_else(|| format!("プロファイル '{}' が見つかりません。", profile_name))?;

    // Identity API エンドポイント
    let host = region_to_endpoint(&profile.region, "identity");
    let api_path = format!("/20160918/tenancies/{}", profile.tenancy);

    // 署名付きヘッダー生成
    let signing_request = SigningRequest {
        method: Method::GET,
        path: api_path.clone(),
        host: host.clone(),
        body: None,
    };

    let signed_headers = sign_request(&profile, &signing_request)?;

    // HTTP リクエスト送信
    let url = format!("https://{}{}", host, api_path);
    let client = reqwest::Client::new();
    let mut request_builder = client.get(&url);

    for (name, value) in &signed_headers {
        request_builder = request_builder.header(name, value);
    }

    match request_builder
        .timeout(std::time::Duration::from_secs(30))
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            if status.is_success() {
                Ok(ConnectionResult {
                    success: true,
                    message: "接続テスト成功。認証が正常に確認されました。".to_string(),
                })
            } else if status.as_u16() == 401 {
                Ok(ConnectionResult {
                    success: false,
                    message: "認証エラー。OCID、フィンガープリント、秘密鍵を確認してください。"
                        .to_string(),
                })
            } else {
                let body = response.text().await.unwrap_or_default();
                Ok(ConnectionResult {
                    success: false,
                    message: format!(
                        "API エラー（ステータス: {}）: {}",
                        status.as_u16(),
                        body
                    ),
                })
            }
        }
        Err(e) => Ok(ConnectionResult {
            success: false,
            message: format!("接続に失敗しました: {}", e),
        }),
    }
}
