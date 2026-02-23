use base64::Engine;
use base64::engine::general_purpose::STANDARD as BASE64;
use chrono::Utc;
use reqwest::Method;
use rsa::pkcs8::DecodePrivateKey;
use rsa::signature::{SignatureEncoding, Signer};
use rsa::RsaPrivateKey;
use sha2::{Digest, Sha256};
use std::fs;
use std::path::Path;

use crate::models::profile::OciProfile;

/// HTTP リクエスト署名に必要な情報
pub struct SigningRequest {
    pub method: Method,
    pub path: String,
    pub host: String,
    pub body: Option<String>,
}

/// 署名付きヘッダーを生成
pub fn sign_request(
    profile: &OciProfile,
    request: &SigningRequest,
) -> Result<Vec<(String, String)>, String> {
    // 秘密鍵を読み込み
    let private_key = load_private_key(&profile.key_file)?;

    // 日時ヘッダー生成（RFC 7231 形式）
    let date = Utc::now().format("%a, %d %b %Y %H:%M:%S GMT").to_string();

    // 署名対象ヘッダーとリストを構築
    let method_lower = request.method.as_str().to_lowercase();
    let request_target = format!("{} {}", method_lower, request.path);

    let mut headers = vec![
        ("date".to_string(), date.clone()),
        ("(request-target)".to_string(), request_target),
        ("host".to_string(), request.host.clone()),
    ];

    let mut header_names = vec!["date", "(request-target)", "host"];

    // POST/PUT の場合は追加ヘッダーが必要
    if request.method == Method::POST || request.method == Method::PUT {
        let body = request.body.as_deref().unwrap_or("");
        let content_length = body.len().to_string();
        let content_sha256 = {
            let mut hasher = Sha256::new();
            hasher.update(body.as_bytes());
            BASE64.encode(hasher.finalize())
        };

        headers.push(("content-length".to_string(), content_length.clone()));
        headers.push(("content-type".to_string(), "application/json".to_string()));
        headers.push(("x-content-sha256".to_string(), content_sha256.clone()));

        header_names.extend_from_slice(&["content-length", "content-type", "x-content-sha256"]);
    }

    // 署名文字列を構築
    let signing_string: String = headers
        .iter()
        .map(|(name, value)| format!("{}: {}", name, value))
        .collect::<Vec<_>>()
        .join("\n");

    // RSA-SHA256 で署名
    let signing_key =
        rsa::pkcs1v15::SigningKey::<Sha256>::new(private_key);
    let signature = signing_key
        .try_sign(signing_string.as_bytes())
        .map_err(|e| format!("署名の生成に失敗しました: {}", e))?;
    let signature_b64 = BASE64.encode(signature.to_bytes());

    // keyId を構築
    let key_id = format!("{}/{}/{}", profile.tenancy, profile.user, profile.fingerprint);

    // Authorization ヘッダー生成
    let auth_header = format!(
        "Signature version=\"1\",headers=\"{}\",keyId=\"{}\",algorithm=\"rsa-sha256\",signature=\"{}\"",
        header_names.join(" "),
        key_id,
        signature_b64
    );

    // レスポンスヘッダー構築
    let mut result_headers = vec![
        ("date".to_string(), date),
        ("host".to_string(), request.host.clone()),
        ("Authorization".to_string(), auth_header),
    ];

    // POST/PUT 時の追加ヘッダー
    if request.method == Method::POST || request.method == Method::PUT {
        let body = request.body.as_deref().unwrap_or("");
        let content_sha256 = {
            let mut hasher = Sha256::new();
            hasher.update(body.as_bytes());
            BASE64.encode(hasher.finalize())
        };
        result_headers.push(("content-type".to_string(), "application/json".to_string()));
        result_headers.push(("content-length".to_string(), body.len().to_string()));
        result_headers.push(("x-content-sha256".to_string(), content_sha256));
    }

    Ok(result_headers)
}

/// PEM 形式の秘密鍵ファイルを読み込み
fn load_private_key(path: &str) -> Result<RsaPrivateKey, String> {
    let pem_content =
        fs::read_to_string(Path::new(path))
            .map_err(|e| format!("秘密鍵ファイルの読み込みに失敗しました: {}", e))?;

    // PKCS#8 形式で試行
    if let Ok(key) = RsaPrivateKey::from_pkcs8_pem(&pem_content) {
        return Ok(key);
    }

    // PKCS#1 形式で試行
    use rsa::pkcs1::DecodeRsaPrivateKey;
    if let Ok(key) = RsaPrivateKey::from_pkcs1_pem(&pem_content) {
        return Ok(key);
    }

    Err("秘密鍵の解析に失敗しました。PKCS#1 または PKCS#8 形式の PEM ファイルを指定してください。".to_string())
}
