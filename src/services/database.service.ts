import { invoke } from "@tauri-apps/api/core";
import type { DbSystem } from "../types/profile";

// DB システム一覧を取得
export async function listDbSystems(
    profileName: string,
    compartmentId: string
): Promise<DbSystem[]> {
    return invoke<DbSystem[]>("list_db_systems", { profileName, compartmentId });
}
