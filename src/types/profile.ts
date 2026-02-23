// OCI プロファイル型定義

export interface OciProfile {
  name: string;
  user: string;
  tenancy: string;
  region: string;
  fingerprint: string;
  key_file: string;
}

export interface OciRegion {
  code: string;
  display_name: string;
}

export interface ConnectionResult {
  success: boolean;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
