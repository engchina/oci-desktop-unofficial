import { invoke } from "@tauri-apps/api/core";
import type {
  ConnectionResult,
  OciProfile,
  ValidationResult,
} from "../types/profile";

// プロファイルの入力値を検証
export async function validateProfile(
  profile: OciProfile
): Promise<ValidationResult> {
  return invoke<ValidationResult>("validate_profile", { profile });
}

// 接続テスト
export async function testConnection(
  profileName: string,
  configPath?: string
): Promise<ConnectionResult> {
  return invoke<ConnectionResult>("test_connection", {
    profileName,
    configPath: configPath ?? null,
  });
}
