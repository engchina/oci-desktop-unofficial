import { invoke } from "@tauri-apps/api/core";
import type { ObjectStorageBucket } from "../types/profile";

// オブジェクトストレージのネームスペースを取得
export async function getNamespace(profileName: string): Promise<string> {
    return invoke<string>("get_namespace", { profileName });
}

// バケット一覧を取得
export async function listBuckets(
    profileName: string,
    compartmentId: string,
    namespace: string
): Promise<ObjectStorageBucket[]> {
    return invoke<ObjectStorageBucket[]>("list_buckets", {
        profileName,
        compartmentId,
        namespace,
    });
}
