import { useState, useEffect, useCallback } from "react";
import type { OciProfile } from "../../types/profile";
import { loadOciConfig } from "../../services/config.service";
import ProfileList from "./ProfileList";
import ProfileEditor from "./ProfileEditor";
import { useProfiles } from "../../context/ProfileContext";
import "./SettingsPage.css";

export default function SettingsPage() {
  const { reloadProfiles } = useProfiles();
  const [profiles, setProfiles] = useState<OciProfile[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);

  const loadProfiles = useCallback(async () => {
    try {
      const data = await loadOciConfig();
      setProfiles(data);
    } catch {
      setProfiles([]);
    }
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const selectedProfile = profiles.find((p) => p.name === selectedName) ?? null;

  const handleAdd = () => {
    setSelectedName(null);
    setIsNew(true);
  };

  const handleSelect = (name: string) => {
    setSelectedName(name);
    setIsNew(false);
  };

  const handleSaved = async () => {
    await loadProfiles();
    await reloadProfiles();
    setIsNew(false);
  };

  const handleDeleted = async () => {
    setSelectedName(null);
    setIsNew(false);
    await loadProfiles();
    await reloadProfiles();
  };

  const handleCancel = () => {
    setIsNew(false);
  };

  return (
    <div className="settings-page">
      <ProfileList
        profiles={profiles}
        selectedName={isNew ? null : selectedName}
        onSelect={handleSelect}
        onAdd={handleAdd}
      />
      <ProfileEditor
        profile={isNew ? null : selectedProfile}
        isNew={isNew}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
        onCancel={handleCancel}
      />
    </div>
  );
}
