use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

use crate::models::profile::OciProfile;

/// OCI 設定ファイルのデフォルトパスを取得
pub fn default_config_path() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("~"))
        .join(".oci")
        .join("config")
}

/// チルダ(~)をホームディレクトリに展開
fn expand_tilde(path: &str) -> String {
    if path.starts_with('~') {
        if let Some(home) = dirs::home_dir() {
            return path.replacen('~', &home.to_string_lossy(), 1);
        }
    }
    path.to_string()
}

/// パスを絶対パスに変換（相対パスは設定ファイルディレクトリ基準）
fn resolve_key_file_path(key_file: &str, config_dir: &Path) -> String {
    // チルダ展開
    let expanded = expand_tilde(key_file);
    let path = Path::new(&expanded);
    
    // 既に絶対パスの場合はそのまま返す
    if path.is_absolute() {
        return expanded;
    }
    
    // 相対パスの場合は設定ファイルディレクトリからの絶対パスに変換
    config_dir.join(path).to_string_lossy().to_string()
}

/// OCI 設定ファイル（INI 形式）を解析してプロファイル一覧を返す
pub fn parse_config(path: &Path) -> Result<Vec<OciProfile>, String> {
    let content = fs::read_to_string(path)
        .map_err(|e| format!("設定ファイルの読み込みに失敗しました: {}", e))?;

    // 設定ファイルのディレクトリを取得（相対パス解決用）
    let config_dir = path.parent().unwrap_or(Path::new("/"));

    let mut profiles: Vec<OciProfile> = Vec::new();
    let mut current_section: Option<String> = None;
    let mut current_fields: HashMap<String, String> = HashMap::new();

    for line in content.lines() {
        let trimmed = line.trim();

        // 空行・コメント行をスキップ
        if trimmed.is_empty() || trimmed.starts_with('#') {
            continue;
        }

        // セクションヘッダー [PROFILE_NAME]
        if trimmed.starts_with('[') && trimmed.ends_with(']') {
            // 前のセクションを保存
            if let Some(section_name) = current_section.take() {
                if let Some(profile) = build_profile(&section_name, &current_fields, config_dir) {
                    profiles.push(profile);
                }
            }
            current_section = Some(trimmed[1..trimmed.len() - 1].trim().to_string());
            current_fields.clear();
            continue;
        }

        // key=value 解析
        if let Some(eq_pos) = trimmed.find('=') {
            let key = trimmed[..eq_pos].trim().to_string();
            let value = trimmed[eq_pos + 1..].trim().to_string();
            current_fields.insert(key, value);
        }
    }

    // 最後のセクションを保存
    if let Some(section_name) = current_section {
        if let Some(profile) = build_profile(&section_name, &current_fields, config_dir) {
            profiles.push(profile);
        }
    }

    Ok(profiles)
}

/// フィールドマップからプロファイルを構築
fn build_profile(name: &str, fields: &HashMap<String, String>, config_dir: &Path) -> Option<OciProfile> {
    Some(OciProfile {
        name: name.to_string(),
        user: fields.get("user")?.clone(),
        tenancy: fields.get("tenancy")?.clone(),
        region: fields.get("region")?.clone(),
        fingerprint: fields.get("fingerprint")?.clone(),
        key_file: resolve_key_file_path(fields.get("key_file")?, config_dir),
    })
}

/// プロファイル一覧を OCI 設定ファイル形式で書き出す
pub fn write_config(path: &Path, profiles: &[OciProfile]) -> Result<(), String> {
    // 親ディレクトリを作成
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("ディレクトリの作成に失敗しました: {}", e))?;
    }

    let mut content = String::new();
    for (i, profile) in profiles.iter().enumerate() {
        if i > 0 {
            content.push('\n');
        }
        content.push_str(&format!("[{}]\n", profile.name));
        content.push_str(&format!("user={}\n", profile.user));
        content.push_str(&format!("fingerprint={}\n", profile.fingerprint));
        content.push_str(&format!("tenancy={}\n", profile.tenancy));
        content.push_str(&format!("region={}\n", profile.region));
        content.push_str(&format!("key_file={}\n", profile.key_file));
    }

    fs::write(path, content)
        .map_err(|e| format!("設定ファイルの書き込みに失敗しました: {}", e))?;

    // パーミッションを 600 に設定（Unix系のみ）
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let permissions = fs::Permissions::from_mode(0o600);
        fs::set_permissions(path, permissions)
            .map_err(|e| format!("パーミッションの設定に失敗しました: {}", e))?;
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    use tempfile::NamedTempFile;

    #[test]
    fn test_parse_config() {
        let mut file = NamedTempFile::new().unwrap();
        writeln!(
            file,
            r#"[DEFAULT]
user=ocid1.user.oc1..aaaatest
fingerprint=aa:bb:cc:dd:ee:ff
tenancy=ocid1.tenancy.oc1..aaaatest
region=ap-tokyo-1
key_file=/home/test/.oci/key.pem

[PRODUCTION]
user=ocid1.user.oc1..bbbbtest
fingerprint=11:22:33:44:55:66
tenancy=ocid1.tenancy.oc1..bbbbtest
region=us-ashburn-1
key_file=/home/test/.oci/prod_key.pem
"#
        )
        .unwrap();

        let profiles = parse_config(file.path()).unwrap();
        assert_eq!(profiles.len(), 2);
        assert_eq!(profiles[0].name, "DEFAULT");
        assert_eq!(profiles[0].region, "ap-tokyo-1");
        assert_eq!(profiles[1].name, "PRODUCTION");
        assert_eq!(profiles[1].region, "us-ashburn-1");
    }

    #[test]
    fn test_write_and_read_config() {
        let file = NamedTempFile::new().unwrap();
        let profiles = vec![OciProfile {
            name: "DEFAULT".to_string(),
            user: "ocid1.user.oc1..test".to_string(),
            tenancy: "ocid1.tenancy.oc1..test".to_string(),
            region: "ap-tokyo-1".to_string(),
            fingerprint: "aa:bb:cc:dd".to_string(),
            key_file: "/home/test/.oci/key.pem".to_string(),
        }];

        write_config(file.path(), &profiles).unwrap();
        let parsed = parse_config(file.path()).unwrap();
        assert_eq!(parsed.len(), 1);
        assert_eq!(parsed[0].name, "DEFAULT");
        assert_eq!(parsed[0].user, "ocid1.user.oc1..test");
    }
}
