mod commands;
mod models;
mod oci;

use commands::auth::{test_connection, validate_profile};
use commands::compute::list_instances;
use commands::config::{get_default_config_path, import_oci_cli_config, load_oci_config};
use commands::database::list_db_systems;
use commands::iam::{list_groups, list_users};
use commands::network::list_vcns;
use commands::profile::{
    create_profile, delete_profile, get_profile, get_regions, list_profiles, update_profile,
};
use commands::storage::{get_namespace, list_buckets};
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(all(target_os = "linux", debug_assertions))]
    {
        let display = std::env::var("DISPLAY").unwrap_or_else(|_| "<unset>".to_string());
        let wayland_display =
            std::env::var("WAYLAND_DISPLAY").unwrap_or_else(|_| "<unset>".to_string());
        let xdg_runtime_dir =
            std::env::var("XDG_RUNTIME_DIR").unwrap_or_else(|_| "<unset>".to_string());
        eprintln!(
            "[oci-desktop] DISPLAY={display}, WAYLAND_DISPLAY={wayland_display}, XDG_RUNTIME_DIR={xdg_runtime_dir}"
        );
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
            Ok(())
        })
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
            // コンピュートコマンド
            list_instances,
            // ストレージコマンド
            get_namespace,
            list_buckets,
            // ネットワークコマンド
            list_vcns,
            // データベースコマンド
            list_db_systems,
            // IAM コマンド
            list_users,
            list_groups,
        ])
        .run(tauri::generate_context!())
        .expect("アプリケーションの起動に失敗しました");
}
