import * as React from "react";

const STORAGE_KEY = "dashboard-zoom-level";
const DEFAULT_ZOOM = 100;
const MIN_ZOOM = 50;
const MAX_ZOOM = 200;
const ZOOM_STEP = 10;

interface UseZoomReturn {
  zoomLevel: number;
  increaseZoom: () => void;
  decreaseZoom: () => void;
  resetZoom: () => void;
}

/**
 * Hook para gerenciar o zoom da tela (ajustar tamanho de fonte).
 * Salva as preferências no localStorage do navegador.
 */
export function useZoom(): UseZoomReturn {
  const [zoomLevel, setZoomLevel] = React.useState<number>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_ZOOM;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= MIN_ZOOM && parsed <= MAX_ZOOM) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn("Erro ao ler zoom do localStorage:", error);
    }

    return DEFAULT_ZOOM;
  });

  // Aplica o zoom ao elemento root (html)
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${zoomLevel}%`;

    return () => {
      // Cleanup: restaura o zoom padrão ao desmontar (opcional)
      // root.style.fontSize = "";
    };
  }, [zoomLevel]);

  const saveZoom = React.useCallback((level: number) => {
    try {
      localStorage.setItem(STORAGE_KEY, level.toString());
    } catch (error) {
      console.warn("Erro ao salvar zoom no localStorage:", error);
    }
  }, []);

  const increaseZoom = React.useCallback(() => {
    setZoomLevel((prev) => {
      const newLevel = Math.min(prev + ZOOM_STEP, MAX_ZOOM);
      saveZoom(newLevel);
      return newLevel;
    });
  }, [saveZoom]);

  const decreaseZoom = React.useCallback(() => {
    setZoomLevel((prev) => {
      const newLevel = Math.max(prev - ZOOM_STEP, MIN_ZOOM);
      saveZoom(newLevel);
      return newLevel;
    });
  }, [saveZoom]);

  const resetZoom = React.useCallback(() => {
    setZoomLevel(DEFAULT_ZOOM);
    saveZoom(DEFAULT_ZOOM);
  }, [saveZoom]);

  return {
    zoomLevel,
    increaseZoom,
    decreaseZoom,
    resetZoom,
  };
}
