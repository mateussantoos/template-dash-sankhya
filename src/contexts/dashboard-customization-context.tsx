import * as React from "react";
import type { Layouts } from "react-grid-layout";

interface RegisterGridOptions {
  storageKey?: string;
}

interface DashboardCustomizationContextValue {
  isCustomizing: boolean;
  startCustomization: () => void;
  stopCustomization: () => void;
  toggleCustomization: () => void;
  layouts: Record<string, Layouts>;
  registerGrid: (
    gridId: string,
    defaultLayouts: Layouts,
    options?: RegisterGridOptions
  ) => void;
  updateGridLayouts: (gridId: string, layouts: Layouts) => void;
  resetGridLayouts: (gridId: string) => void;
}

const DashboardCustomizationContext =
  React.createContext<DashboardCustomizationContextValue | null>(null);

const STORAGE_PREFIX = "dashboard-layout";

type DefaultsRegistry = Record<string, Layouts>;
type StorageRegistry = Record<string, string | undefined>;

const readFromStorage = (key?: string): Layouts | null => {
  if (!key || typeof window === "undefined") {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as Layouts;
  } catch {
    return null;
  }
};

const writeToStorage = (key: string | undefined, layouts: Layouts) => {
  if (!key || typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(
      `${STORAGE_PREFIX}:${key}`,
      JSON.stringify(layouts)
    );
  } catch {
    // noop
  }
};

export interface DashboardCustomizationProviderProps {
  children: React.ReactNode;
}

export const DashboardCustomizationProvider: React.FC<
  DashboardCustomizationProviderProps
> = ({ children }) => {
  const [isCustomizing, setIsCustomizing] = React.useState(false);
  const [layouts, setLayouts] = React.useState<Record<string, Layouts>>({});

  const defaultsRef = React.useRef<DefaultsRegistry>({});
  const storageRef = React.useRef<StorageRegistry>({});

  const registerGrid = React.useCallback(
    (
      gridId: string,
      defaultLayouts: Layouts,
      options?: RegisterGridOptions
    ) => {
      defaultsRef.current[gridId] = defaultLayouts;
      storageRef.current[gridId] = options?.storageKey ?? gridId;

      setLayouts((prev) => {
        // Se já existe layout salvo, mantém ele
        if (prev[gridId]) {
          return prev;
        }

        // Tenta carregar do storage
        const persisted = readFromStorage(storageRef.current[gridId]);
        if (persisted) {
          // Mescla layouts persistidos com novos items (caso novos items sejam adicionados)
          const mergedLayouts: Layouts = {};
          Object.keys(persisted).forEach((breakpoint) => {
            mergedLayouts[breakpoint] = persisted[breakpoint].map((savedItem) => {
              // Mantém item salvo se ainda existe
              return savedItem;
            });
          });
          return { ...prev, [gridId]: mergedLayouts };
        }

        // Usa defaults se não há nada salvo
        return { ...prev, [gridId]: defaultLayouts };
      });
    },
    []
  );

  const updateGridLayouts = React.useCallback(
    (gridId: string, nextLayouts: Layouts) => {
      setLayouts((prev) => {
        const updated = { ...prev, [gridId]: nextLayouts };
        writeToStorage(storageRef.current[gridId], nextLayouts);
        return updated;
      });
    },
    []
  );

  const resetGridLayouts = React.useCallback((gridId: string) => {
    const defaults = defaultsRef.current[gridId];
    if (!defaults) {
      return;
    }
    writeToStorage(storageRef.current[gridId], defaults);
    setLayouts((prev) => ({ ...prev, [gridId]: defaults }));
  }, []);

  const startCustomization = React.useCallback(
    () => setIsCustomizing(true),
    []
  );
  const stopCustomization = React.useCallback(
    () => setIsCustomizing(false),
    []
  );
  const toggleCustomization = React.useCallback(
    () => setIsCustomizing((prev) => !prev),
    []
  );

  const value = React.useMemo<DashboardCustomizationContextValue>(
    () => ({
      isCustomizing,
      startCustomization,
      stopCustomization,
      toggleCustomization,
      layouts,
      registerGrid,
      updateGridLayouts,
      resetGridLayouts,
    }),
    [
      isCustomizing,
      layouts,
      registerGrid,
      updateGridLayouts,
      resetGridLayouts,
      startCustomization,
      stopCustomization,
      toggleCustomization,
    ]
  );

  return (
    <DashboardCustomizationContext.Provider value={value}>
      {children}
    </DashboardCustomizationContext.Provider>
  );
};

export const useDashboardCustomization = () => {
  const context = React.useContext(DashboardCustomizationContext);
  if (!context) {
    throw new Error(
      "useDashboardCustomization deve ser usado dentro de um DashboardCustomizationProvider"
    );
  }
  return context;
};

export const useOptionalDashboardCustomization = () =>
  React.useContext(DashboardCustomizationContext);
