mod commands;
mod models;
mod oci;

use commands::auth::{test_connection, validate_profile};
use commands::config::{get_default_config_path, import_oci_cli_config, load_oci_config};
use commands::profile::{
    create_profile, delete_profile, get_profile, get_regions, list_profiles, update_profile,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            // 設定コマンド
            get_default_config_path,
            load_oci_config,
            import_oci_cli_config,
            // プロファイルコマンド
            list_profiles,
            get_profile,
            create_profile,
            update_profile,
            delete_profile,
            get_regions,
            // 認証コマンド
            validate_profile,
            test_connection,
        ])
        .run(tauri::generate_context!())
        .expect("アプリケーションの起動に失敗しました");
}
