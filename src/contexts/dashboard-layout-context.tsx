import React from "react";
import type { HeaderProps } from "@/components/layout/header/header";

export interface DashboardLayoutContextValue {
  setHeaderProps: (props: Partial<HeaderProps>) => void;
  setFiltersSlot: (slot: React.ReactNode) => void;
}

export const DashboardLayoutContext =
  React.createContext<DashboardLayoutContextValue>({
    setHeaderProps: () => undefined,
    setFiltersSlot: () => undefined,
  });

export const useDashboardLayoutContext = () => {
  const context = React.useContext(DashboardLayoutContext);
  if (!context) {
    throw new Error(
      "useDashboardLayoutContext deve ser usado dentro de DashboardLayout"
    );
  }
  return context;
};

interface DashboardLayoutProviderProps {
  children: React.ReactNode;
  value: DashboardLayoutContextValue;
}

export const DashboardLayoutProvider: React.FC<
  DashboardLayoutProviderProps
> = ({ children, value }) => (
  <DashboardLayoutContext.Provider value={value}>
    {children}
  </DashboardLayoutContext.Provider>
);
