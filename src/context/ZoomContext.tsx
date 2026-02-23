import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getCurrentWebview } from "@tauri-apps/api/webview";

interface ZoomContextType {
  zoom: number;
  zoomIndex: number;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

// Windows 浏览器标准缩放级别
const ZOOM_LEVELS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0];
const DEFAULT_ZOOM_INDEX = 3; // 1.0 (100%)
const STORAGE_KEY = "oci-desktop-zoom";

export function ZoomProvider({ children }: { children: ReactNode }) {
  const [zoomIndex, setZoomIndexState] = useState<number>(() => {
    // 从 localStorage 读取保存的缩放值
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseFloat(saved);
      const index = ZOOM_LEVELS.findIndex((z) => z === parsed);
      if (index !== -1) {
        return index;
      }
    }
    return DEFAULT_ZOOM_INDEX;
  });

  const zoom = ZOOM_LEVELS[zoomIndex];

  // 应用缩放到 webview
  const applyZoom = useCallback(async (zoomValue: number) => {
    try {
      const webview = getCurrentWebview();
      await webview.setZoom(zoomValue);
    } catch (error) {
      console.error("Failed to set zoom:", error);
    }
  }, []);

  // 初始化时应用缩放
  useEffect(() => {
    applyZoom(zoom);
  }, [zoom, applyZoom]);

  const setZoomIndex = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(ZOOM_LEVELS.length - 1, index));
    setZoomIndexState(clampedIndex);
    localStorage.setItem(STORAGE_KEY, ZOOM_LEVELS[clampedIndex].toString());
  }, []);

  const setZoom = useCallback((newZoom: number) => {
    const index = ZOOM_LEVELS.findIndex((z) => z === newZoom);
    if (index !== -1) {
      setZoomIndex(index);
    }
  }, [setZoomIndex]);

  const zoomIn = useCallback(() => {
    if (zoomIndex < ZOOM_LEVELS.length - 1) {
      setZoomIndex(zoomIndex + 1);
    }
  }, [zoomIndex, setZoomIndex]);

  const zoomOut = useCallback(() => {
    if (zoomIndex > 0) {
      setZoomIndex(zoomIndex - 1);
    }
  }, [zoomIndex, setZoomIndex]);

  const resetZoom = useCallback(() => {
    setZoomIndex(DEFAULT_ZOOM_INDEX);
  }, [setZoomIndex]);

  return (
    <ZoomContext.Provider value={{ zoom, zoomIndex, setZoom, zoomIn, zoomOut, resetZoom }}>
      {children}
    </ZoomContext.Provider>
  );
}

export function useZoom() {
  const context = useContext(ZoomContext);
  if (context === undefined) {
    throw new Error("useZoom must be used within a ZoomProvider");
  }
  return context;
}
