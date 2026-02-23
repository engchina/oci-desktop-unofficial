import { open } from "@tauri-apps/plugin-dialog";
import "./FilePickerButton.css";

interface FilePickerButtonProps {
  value: string;
  onChange: (path: string) => void;
}

export default function FilePickerButton({ value, onChange }: FilePickerButtonProps) {
  const handleSelect = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: "PEM キーファイル", extensions: ["pem"] }],
    });
    if (selected) {
      onChange(selected as string);
    }
  };

  return (
    <div className="file-picker">
      <input
        type="text"
        className="file-picker-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="秘密鍵ファイルのパスを入力..."
      />
      <button type="button" className="file-picker-btn" onClick={handleSelect}>
        参照...
      </button>
    </div>
  );
}
