use crate::models::database::DbSystem;
use crate::oci::client;

/// DB システム一覧を取得
#[tauri::command]
pub async fn list_db_systems(
    profile_name: String,
    compartment_id: String,
) -> Result<Vec<DbSystem>, String> {
    let profile = client::load_profile(&profile_name)?;
    let query = format!("compartmentId={}", compartment_id);
    let body =
        client::oci_get_request(&profile, "database", "/20160918/dbSystems", Some(&query)).await?;
    let db_systems: Vec<DbSystem> =
        serde_json::from_str(&body).map_err(|e| format!("レスポンスの解析に失敗しました: {}", e))?;
    Ok(db_systems)
}
