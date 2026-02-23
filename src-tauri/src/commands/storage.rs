use crate::models::storage::ObjectStorageBucket;
use crate::oci::client;

/// オブジェクトストレージのネームスペースを取得
#[tauri::command]
pub async fn get_namespace(profile_name: String) -> Result<String, String> {
    let profile = client::load_profile(&profile_name)?;
    let body =
        client::oci_get_request(&profile, "objectstorage", "/n/", None).await?;
    // レスポンスはクォートされた文字列
    let ns: String = serde_json::from_str(&body)
        .map_err(|e| format!("レスポンスの解析に失敗しました: {}", e))?;
    Ok(ns)
}

/// バケット一覧を取得
#[tauri::command]
pub async fn list_buckets(
    profile_name: String,
    compartment_id: String,
    namespace: String,
) -> Result<Vec<ObjectStorageBucket>, String> {
    let profile = client::load_profile(&profile_name)?;
    let path = format!("/n/{}/b/", namespace);
    let query = format!("compartmentId={}", compartment_id);
    let body =
        client::oci_get_request(&profile, "objectstorage", &path, Some(&query)).await?;
    let buckets: Vec<ObjectStorageBucket> =
        serde_json::from_str(&body).map_err(|e| format!("レスポンスの解析に失敗しました: {}", e))?;
    Ok(buckets)
}
