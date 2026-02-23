use crate::models::compute::ComputeInstance;
use crate::oci::client;

/// コンピュートインスタンス一覧を取得
#[tauri::command]
pub async fn list_instances(
    profile_name: String,
    compartment_id: String,
) -> Result<Vec<ComputeInstance>, String> {
    let profile = client::load_profile(&profile_name)?;
    let query = format!("compartmentId={}", compartment_id);
    let body = client::oci_get_request(&profile, "iaas", "/20160918/instances", Some(&query)).await?;
    let instances: Vec<ComputeInstance> =
        serde_json::from_str(&body).map_err(|e| format!("レスポンスの解析に失敗しました: {}", e))?;
    Ok(instances)
}
