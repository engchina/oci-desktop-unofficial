import { useState, useEffect } from "react";
import type { OciProfile } from "../../types/profile";
import RegionSelector from "./RegionSelector";
import FilePickerButton from "../common/FilePickerButton";
import Notification from "../common/Notification";
import { validateProfile } from "../../services/auth.service";
import { testConnection } from "../../services/auth.service";
import {
  createProfile,
  updateProfile,
  deleteProfile,
} from "../../services/profile.service";
import "./ProfileEditor.css";

interface ProfileEditorProps {
  profile: OciProfile | null;
  isNew: boolean;
  onSaved: () => void;
  onDeleted: () => void;
  onCancel: () => void;
}

const emptyProfile: OciProfile = {
  name: "",
  user: "",
  tenancy: "",
  region: "",
  fingerprint: "",
  key_file: "",
};

export default function ProfileEditor({
  profile,
  isNew,
  onSaved,
  onDeleted,
  onCancel,
}: ProfileEditorProps) {
  const [form, setForm] = useState<OciProfile>(emptyProfile);
  const [originalName, setOriginalName] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({ ...profile });
      setOriginalName(profile.name);
    } else {
      setForm({ ...emptyProfile });
      setOriginalName("");
    }
    setNotification(null);
  }, [profile]);

  const updateField = (field: keyof OciProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setNotification(null);
    try {
      // バリデーション
      const validation = await validateProfile(form);
      if (!validation.valid) {
        setNotification({
          type: "error",
          message: validation.errors.join("\n"),
        });
        setSaving(false);
        return;
      }

      if (isNew) {
        await createProfile(form);
      } else {
        await updateProfile(originalName, form);
      }
      setNotification({
        type: "success",
        message: "プロファイルを保存しました。",
      });
      onSaved();
    } catch (e) {
      setNotification({ type: "error", message: String(e) });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`プロファイル「${form.name}」を削除しますか？`)) return;
    try {
      await deleteProfile(originalName);
      setNotification({
        type: "success",
        message: "プロファイルを削除しました。",
      });
      onDeleted();
    } catch (e) {
      setNotification({ type: "error", message: String(e) });
    }
  };

  const handleTest = async () => {
    if (isNew) {
      setNotification({
        type: "info",
        message: "接続テストを実行するには、まずプロファイルを保存してください。",
      });
      return;
    }
    setTesting(true);
    setNotification(null);
    try {
      const result = await testConnection(originalName);
      setNotification({
        type: result.success ? "success" : "error",
        message: result.message,
      });
    } catch (e) {
      setNotification({ type: "error", message: String(e) });
    } finally {
      setTesting(false);
    }
  };

  if (!profile && !isNew) {
    return (
      <div className="profile-editor-empty">
        左のリストからプロファイルを選択するか、
        <br />
        「新規作成」で新しいプロファイルを追加してください。
      </div>
    );
  }

  return (
    <div className="profile-editor">
      <div className="profile-editor-header">
        <h3>{isNew ? "新規プロファイル" : `プロファイル編集: ${originalName}`}</h3>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="form-group">
        <label className="form-label">プロファイル名</label>
        <input
          type="text"
          className="form-input"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="例: DEFAULT"
        />
      </div>

      <div className="form-group">
        <label className="form-label">ユーザー OCID</label>
        <input
          type="text"
          className="form-input"
          value={form.user}
          onChange={(e) => updateField("user", e.target.value)}
          placeholder="ocid1.user.oc1..xxxx"
        />
      </div>

      <div className="form-group">
        <label className="form-label">テナンシー OCID</label>
        <input
          type="text"
          className="form-input"
          value={form.tenancy}
          onChange={(e) => updateField("tenancy", e.target.value)}
          placeholder="ocid1.tenancy.oc1..xxxx"
        />
      </div>

      <div className="form-group">
        <label className="form-label">リージョン</label>
        <RegionSelector
          value={form.region}
          onChange={(v) => updateField("region", v)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">フィンガープリント</label>
        <input
          type="text"
          className="form-input"
          value={form.fingerprint}
          onChange={(e) => updateField("fingerprint", e.target.value)}
          placeholder="aa:bb:cc:dd:ee:ff:..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">秘密鍵ファイル</label>
        <FilePickerButton
          value={form.key_file}
          onChange={(v) => updateField("key_file", v)}
        />
      </div>

      <div className="form-actions">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "保存中..." : "保存"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleTest}
          disabled={testing}
        >
          {testing ? "テスト中..." : "接続テスト"}
        </button>
        {!isNew && (
          <button className="btn btn-danger" onClick={handleDelete}>
            削除
          </button>
        )}
        {isNew && (
          <button className="btn btn-secondary" onClick={onCancel}>
            キャンセル
          </button>
        )}
      </div>
    </div>
  );
}
