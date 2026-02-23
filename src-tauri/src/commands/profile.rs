use crate::models::profile::OciProfile;
use crate::oci::config_parser;
use crate::oci::regions::{get_available_regions, OciRegion};

/// プロファイル名の一覧を取得
#[tauri::command]
pub fn list_profiles(path: Option<String>) -> Result<Vec<String>, String> {
    let config_path = match path {
        Some(p) => std::path::PathBuf::from(p),
        None => config_parser::default_config_path(),
    };

    if !config_path.exists() {
        return Ok(Vec::new());
    }

    let profiles = config_parser::parse_config(&config_path)?;
    Ok(profiles.into_iter().map(|p| p.name).collect())
}

/// 指定名のプロファイルを取得
#[tauri::command]
pub fn get_profile(name: String, path: Option<String>) -> Result<OciProfile, String> {
    let config_path = match path {
        Some(p) => std::path::PathBuf::from(p),
        None => config_parser::default_config_path(),
    };

    let profiles = config_parser::parse_config(&config_path)?;
    profiles
        .into_iter()
        .find(|p| p.name == name)
        .ok_or_else(|| format!("プロファイル '{}' が見つかりません。", name))
}

/// プロファイルを作成・追加
#[tauri::command]
pub fn create_profile(profile: OciProfile, path: Option<String>) -> Result<(), String> {
    let config_path = match path {
        Some(p) => std::path::PathBuf::from(p),
        None => config_parser::default_config_path(),
    };

    let mut profiles = if config_path.exists() {
        config_parser::parse_config(&config_path)?
    } else {
        Vec::new()
    };

    // 同名プロファイルが存在する場合はエラー
    if profiles.iter().any(|p| p.name == profile.name) {
        return Err(format!(
            "プロファイル '{}' は既に存在します。",
            profile.name
        ));
    }

    profiles.push(profile);
    config_parser::write_config(&config_path, &profiles)
}

/// プロファイルを更新
#[tauri::command]
pub fn update_profile(
    name: String,
    profile: OciProfile,
    path: Option<String>,
) -> Result<(), String> {
    let config_path = match path {
        Some(p) => std::path::PathBuf::from(p),
        None => config_parser::default_config_path(),
    };

    let mut profiles = config_parser::parse_config(&config_path)?;

    let idx = profiles
        .iter()
        .position(|p| p.name == name)
        .ok_or_else(|| format!("プロファイル '{}' が見つかりません。", name))?;

    profiles[idx] = profile;
    config_parser::write_config(&config_path, &profiles)
}

/// プロファイルを削除
#[tauri::command]
pub fn delete_profile(name: String, path: Option<String>) -> Result<(), String> {
    let config_path = match path {
        Some(p) => std::path::PathBuf::from(p),
        None => config_parser::default_config_path(),
    };

    let mut profiles = config_parser::parse_config(&config_path)?;
    let original_len = profiles.len();
    profiles.retain(|p| p.name != name);

    if profiles.len() == original_len {
        return Err(format!("プロファイル '{}' が見つかりません。", name));
    }

    config_parser::write_config(&config_path, &profiles)
}

/// 利用可能なリージョン一覧を取得
#[tauri::command]
pub fn get_regions() -> Vec<OciRegion> {
    get_available_regions()
}
