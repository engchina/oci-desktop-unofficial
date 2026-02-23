import { invoke } from "@tauri-apps/api/core";
import type { Vcn } from "../types/profile";

// VCN 一覧を取得
export async function listVcns(
    profileName: string,
    compartmentId: string
): Promise<Vcn[]> {
    return invoke<Vcn[]>("list_vcns", { profileName, compartmentId });
}
