import { invoke } from "@tauri-apps/api/core";
import type { ComputeInstance } from "../types/profile";

// コンピュートインスタンス一覧を取得
export async function listInstances(
    profileName: string,
    compartmentId: string
): Promise<ComputeInstance[]> {
    return invoke<ComputeInstance[]>("list_instances", {
        profileName,
        compartmentId,
    });
}
