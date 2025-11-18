import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header, type HeaderProps } from "@/components/layout/header/header";
import {
  SideBar,
  type SideBarItem,
} from "@/components/layout/side-bar/side-bar";
import { FaChartLine, FaGear, FaHouse } from "react-icons/fa6";
import { cn } from "@/utils/use-cn";
import {
  DashboardLayoutProvider,
  type DashboardLayoutContextValue,
} from "@/contexts/dashboard-layout-context";

interface DashboardLayoutProps {
  className?: string;
  headerProps?: Partial<HeaderProps>;
  sideBarItems?: SideBarItem[];
  sideBarIcon?: React.ReactNode;
  sideBarTitle?: string;
  filtersSlot?: React.ReactNode;
}

const defaultSideBarItems: SideBarItem[] = [
  {
    label: "Home",
    icon: <FaHouse className="h-4 w-4" />,
    active: true,
    to: "/",
  },
  {
    label: "Configurações",
    icon: <FaGear className="h-4 w-4" />,
    to: "/settings",
  },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  className,
  headerProps: initialHeaderProps,
  filtersSlot: initialFiltersSlot,
  sideBarItems = defaultSideBarItems,
  sideBarIcon = <FaChartLine className="h-4 w-4" />,
  sideBarTitle = "Dashboard",
}) => {
  const [currentHeaderProps, setCurrentHeaderProps] = useState<HeaderProps>({
    title: "Home",
    ...initialHeaderProps,
  });
  const [currentFiltersSlot, setCurrentFiltersSlot] =
    useState<React.ReactNode>(initialFiltersSlot);

  useEffect(() => {
    if (initialHeaderProps) {
      setCurrentHeaderProps((prev) => ({ ...prev, ...initialHeaderProps }));
    }
  }, [initialHeaderProps]);

  useEffect(() => {
    if (initialFiltersSlot !== undefined) {
      setCurrentFiltersSlot(initialFiltersSlot);
    }
  }, [initialFiltersSlot]);

  const contextValue = useMemo<DashboardLayoutContextValue>(
    () => ({
      setHeaderProps: (props) =>
        setCurrentHeaderProps((prev) => ({ ...prev, ...props })),
      setFiltersSlot: (slot) => setCurrentFiltersSlot(slot),
    }),
    []
  );

  return (
    <main className="flex min-h-screen h-screen bg-gray-100">
      <SideBar
        listItems={sideBarItems}
        iconScreen={sideBarIcon}
        titleScreen={sideBarTitle}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header {...currentHeaderProps} filtersSlot={currentFiltersSlot} />
        <div className={cn("flex-1 overflow-y-auto p-4", className)}>
          <DashboardLayoutProvider value={contextValue}>
            <Outlet />
          </DashboardLayoutProvider>
        </div>
      </div>
    </main>
  );
};
