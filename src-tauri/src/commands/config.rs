use crate::models::profile::OciProfile;
use crate::oci::config_parser;

/// OCI 設定ファイルのデフォルトパスを取得
#[tauri::command]
pub fn get_default_config_path() -> String {
    config_parser::default_config_path()
        .to_string_lossy()
        .to_string()
}

/// OCI 設定ファイルからプロファイル一覧を読み込む
#[tauri::command]
pub fn load_oci_config(path: Option<String>) -> Result<Vec<OciProfile>, String> {
    let config_path = match path {
        Some(p) => std::path::PathBuf::from(p),
        None => config_parser::default_config_path(),
    };

    if !config_path.exists() {
        return Ok(Vec::new());
    }

    config_parser::parse_config(&config_path)
}

/// OCI CLI 設定ファイルをインポート
#[tauri::command]
pub fn import_oci_cli_config(path: String) -> Result<Vec<OciProfile>, String> {
    let config_path = std::path::PathBuf::from(path);
    if !config_path.exists() {
        return Err("指定されたファイルが見つかりません。".to_string());
    }
    config_parser::parse_config(&config_path)
}
