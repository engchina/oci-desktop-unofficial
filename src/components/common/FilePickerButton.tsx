import { open } from "@tauri-apps/plugin-dialog";
import "./FilePickerButton.css";

// 检查是否在 Tauri 环境中运行
const isTauriEnv = () => {
  return typeof window !== "undefined" && "__TAURI__" in window;
};

interface FilePickerButtonProps {
  value: string;
  onChange: (path: string) => void;
}

export default function FilePickerButton({ value, onChange }: FilePickerButtonProps) {
  const handleSelect = async () => {
    // 非Tauri环境（浏览器）中使用原生文件选择器作为回退
    if (!isTauriEnv()) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pem";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          // 浏览器环境只能获取文件名，无法获取完整路径
          // 显示提示让用户手动输入完整路径
          const fileName = file.name;
          // 尝试使用 webkitRelativePath 或手动构建提示
          console.log("浏览器环境无法获取完整文件路径，请手动输入");
          onChange(fileName);
        }
      };
      input.click();
      return;
    }

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
