import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { OciProfile } from "../types/profile";
import { loadOciConfig } from "../services/config.service";

interface ProfileContextType {
  profiles: OciProfile[];
  currentProfile: OciProfile | null;
  loading: boolean;
  error: string | null;
  reloadProfiles: () => Promise<void>;
  selectProfile: (name: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<OciProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<OciProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loaded = await loadOciConfig();
      setProfiles(loaded);
      // 現在のプロファイルが削除されている場合は先頭を選択
      if (loaded.length > 0) {
        const current = currentProfile
          ? loaded.find((p) => p.name === currentProfile.name)
          : null;
        if (!current) {
          setCurrentProfile(loaded[0]);
        } else {
          setCurrentProfile(current);
        }
      } else {
        setCurrentProfile(null);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [currentProfile]);

  const selectProfile = useCallback(
    (name: string) => {
      const profile = profiles.find((p) => p.name === name);
      if (profile) {
        setCurrentProfile(profile);
      }
    },
    [profiles]
  );

  useEffect(() => {
    reloadProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        currentProfile,
        loading,
        error,
        reloadProfiles,
        selectProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfiles(): ProfileContextType {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfiles は ProfileProvider 内で使用してください。");
  }
  return context;
}
