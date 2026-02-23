import { invoke } from "@tauri-apps/api/core";
import type { OciProfile } from "../types/profile";

// OCI 設定ファイルのデフォルトパスを取得
export async function getDefaultConfigPath(): Promise<string> {
  return invoke<string>("get_default_config_path");
}

// OCI 設定ファイルからプロファイル一覧を読み込む
export async function loadOciConfig(path?: string): Promise<OciProfile[]> {
  return invoke<OciProfile[]>("load_oci_config", { path: path ?? null });
}

// OCI CLI 設定ファイルをインポート
export async function importOciCliConfig(path: string): Promise<OciProfile[]> {
  return invoke<OciProfile[]>("import_oci_cli_config", { path });
}
