import { useState, useEffect } from "react";
import type { OciRegion } from "../../types/profile";
import { getRegions } from "../../services/profile.service";
import "./RegionSelector.css";

interface RegionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RegionSelector({ value, onChange }: RegionSelectorProps) {
  const [regions, setRegions] = useState<OciRegion[]>([]);

  useEffect(() => {
    getRegions()
      .then(setRegions)
      .catch(() => setRegions([]));
  }, []);

  return (
    <select
      className="region-selector"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">-- リージョンを選択 --</option>
      {regions.map((r) => (
        <option key={r.code} value={r.code}>
          {r.code} ({r.display_name})
        </option>
      ))}
    </select>
  );
}
