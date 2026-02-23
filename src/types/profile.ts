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

// コンピュートインスタンス
export interface ComputeInstance {
  id: string;
  display_name: string;
  shape: string;
  lifecycle_state: string;
  availability_domain: string;
  time_created?: string;
}

// オブジェクトストレージバケット
export interface ObjectStorageBucket {
  name: string;
  compartment_id: string;
  namespace: string;
  time_created?: string;
}

// VCN
export interface Vcn {
  id: string;
  display_name: string;
  cidr_block?: string;
  lifecycle_state: string;
  time_created?: string;
}

// DB システム
export interface DbSystem {
  id: string;
  display_name: string;
  db_version?: string;
  lifecycle_state: string;
  shape?: string;
  time_created?: string;
}

// IAM ユーザー
export interface IamUser {
  id: string;
  name: string;
  description?: string;
  lifecycle_state: string;
  time_created?: string;
}

// IAM グループ
export interface IamGroup {
  id: string;
  name: string;
  description?: string;
  lifecycle_state: string;
  time_created?: string;
}
