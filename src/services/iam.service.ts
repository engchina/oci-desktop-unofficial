import { invoke } from "@tauri-apps/api/core";
import type { IamUser, IamGroup } from "../types/profile";

// IAM ユーザー一覧を取得
export async function listUsers(profileName: string): Promise<IamUser[]> {
    return invoke<IamUser[]>("list_users", { profileName });
}

// IAM グループ一覧を取得
export async function listGroups(profileName: string): Promise<IamGroup[]> {
    return invoke<IamGroup[]>("list_groups", { profileName });
}
