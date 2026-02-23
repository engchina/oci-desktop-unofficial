// リリースビルド時にコンソールウィンドウを非表示にする（Windows用）
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    oci_desktop_unofficial_lib::run()
}
