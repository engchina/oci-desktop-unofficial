use crate::models::iam::{IamGroup, IamUser};
use crate::oci::client;

/// IAM ユーザー一覧を取得
#[tauri::command]
pub async fn list_users(profile_name: String) -> Result<Vec<IamUser>, String> {
    let profile = client::load_profile(&profile_name)?;
    let query = format!("compartmentId={}", profile.tenancy);
    let body =
        client::oci_get_request(&profile, "identity", "/20160918/users", Some(&query)).await?;
    let users: Vec<IamUser> =
        serde_json::from_str(&body).map_err(|e| format!("レスポンスの解析に失敗しました: {}", e))?;
    Ok(users)
}

/// IAM グループ一覧を取得
#[tauri::command]
pub async fn list_groups(profile_name: String) -> Result<Vec<IamGroup>, String> {
    let profile = client::load_profile(&profile_name)?;
    let query = format!("compartmentId={}", profile.tenancy);
    let body =
        client::oci_get_request(&profile, "identity", "/20160918/groups", Some(&query)).await?;
    let groups: Vec<IamGroup> =
        serde_json::from_str(&body).map_err(|e| format!("レスポンスの解析に失敗しました: {}", e))?;
    Ok(groups)
}
