use crate::models::network::Vcn;
use crate::oci::client;

/// VCN 一覧を取得
#[tauri::command]
pub async fn list_vcns(
    profile_name: String,
    compartment_id: String,
) -> Result<Vec<Vcn>, String> {
    let profile = client::load_profile(&profile_name)?;
    let query = format!("compartmentId={}", compartment_id);
    let body = client::oci_get_request(&profile, "iaas", "/20160918/vcns", Some(&query)).await?;
    let vcns: Vec<Vcn> =
        serde_json::from_str(&body).map_err(|e| format!("レスポンスの解析に失敗しました: {}", e))?;
    Ok(vcns)
}
