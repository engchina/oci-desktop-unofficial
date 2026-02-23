import { invoke } from "@tauri-apps/api/core";
import type { OciProfile, OciRegion } from "../types/profile";

// プロファイル名一覧を取得
export async function listProfiles(path?: string): Promise<string[]> {
  return invoke<string[]>("list_profiles", { path: path ?? null });
}

// 指定名のプロファイルを取得
export async function getProfile(
  name: string,
  path?: string
): Promise<OciProfile> {
  return invoke<OciProfile>("get_profile", { name, path: path ?? null });
}

// プロファイルを作成
export async function createProfile(
  profile: OciProfile,
  path?: string
): Promise<void> {
  return invoke("create_profile", { profile, path: path ?? null });
}

// プロファイルを更新
export async function updateProfile(
  name: string,
  profile: OciProfile,
  path?: string
): Promise<void> {
  return invoke("update_profile", { name, profile, path: path ?? null });
}

// プロファイルを削除
export async function deleteProfile(
  name: string,
  path?: string
): Promise<void> {
  return invoke("delete_profile", { name, path: path ?? null });
}

// 利用可能なリージョン一覧を取得
export async function getRegions(): Promise<OciRegion[]> {
  return invoke<OciRegion[]>("get_regions");
}
