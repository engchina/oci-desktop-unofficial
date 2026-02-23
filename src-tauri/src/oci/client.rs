use reqwest::Method;

use crate::models::profile::OciProfile;
use crate::oci::config_parser;
use crate::oci::regions::region_to_endpoint;
use crate::oci::signature::{sign_request, SigningRequest};

/// プロファイル名からプロファイルを読み込む
pub fn load_profile(profile_name: &str) -> Result<OciProfile, String> {
    let cfg_path = config_parser::default_config_path();
    let profiles = config_parser::parse_config(&cfg_path)?;
    profiles
        .into_iter()
        .find(|p| p.name == profile_name)
        .ok_or_else(|| format!("プロファイル '{}' が見つかりません。", profile_name))
}

/// OCI REST API に対して GET リクエストを送信し、レスポンスボディを返す
pub async fn oci_get_request(
    profile: &OciProfile,
    service: &str,
    path: &str,
    query: Option<&str>,
) -> Result<String, String> {
    let host = region_to_endpoint(&profile.region, service);
    let full_path = match query {
        Some(q) => format!("{}?{}", path, q),
        None => path.to_string(),
    };

    let signing_request = SigningRequest {
        method: Method::GET,
        path: full_path.clone(),
        host: host.clone(),
        body: None,
    };

    let signed_headers = sign_request(profile, &signing_request)?;

    let url = format!("https://{}{}", host, full_path);
    let client = reqwest::Client::new();
    let mut request_builder = client.get(&url);

    for (name, value) in &signed_headers {
        request_builder = request_builder.header(name, value);
    }

    let response = request_builder
        .timeout(std::time::Duration::from_secs(30))
        .send()
        .await
        .map_err(|e| format!("API リクエストに失敗しました: {}", e))?;

    let status = response.status();
    let body = response
        .text()
        .await
        .unwrap_or_else(|_| "レスポンスの読み取りに失敗しました".to_string());

    if status.is_success() {
        Ok(body)
    } else {
        Err(format!(
            "API エラー（ステータス: {}）: {}",
            status.as_u16(),
            body
        ))
    }
}
