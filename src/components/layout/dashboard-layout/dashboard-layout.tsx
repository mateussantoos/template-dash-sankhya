import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header, type HeaderProps } from "@/components/layout/header/header";
import {
  SideBar,
  type SideBarItem,
} from "@/components/layout/side-bar/side-bar";
import { FaChartLine, FaGear, FaHouse } from "react-icons/fa6";
import {
  FaMagnifyingGlassMinus,
  FaMagnifyingGlassPlus,
  FaRotateRight,
} from "react-icons/fa6";
import { cn } from "@/utils/use-cn";
import {
  DashboardLayoutProvider,
  type DashboardLayoutContextValue,
  type PageHeaderConfig,
} from "@/contexts/dashboard-layout-context";
import { useZoom } from "@/hooks/use-zoom";
import { Button } from "@/components/ui/button/button";

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
  const { decreaseZoom, increaseZoom, resetZoom } = useZoom();
  const [pageHeaderConfig, setPageHeaderConfig] = useState<PageHeaderConfig>(
    {}
  );
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

  // Atualiza o header quando o pageHeaderConfig muda
  useEffect(() => {
    if (
      pageHeaderConfig.title !== undefined ||
      pageHeaderConfig.infoTooltipText !== undefined
    ) {
      setCurrentHeaderProps((prev) => ({
        ...prev,
        ...(pageHeaderConfig.title !== undefined && {
          title: pageHeaderConfig.title,
        }),
        ...(pageHeaderConfig.infoTooltipText !== undefined && {
          infoTooltipText: pageHeaderConfig.infoTooltipText,
        }),
      }));
    }
  }, [pageHeaderConfig]);

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
      setPageHeaderConfig: (config) => setPageHeaderConfig(config),
    }),
    []
  );

  const zoomActionsSlot = useMemo(
    () => (
      <>
        <Button
          icon={<FaMagnifyingGlassMinus />}
          onClick={decreaseZoom}
          variant="outline"
          ariaLabel="Diminuir zoom"
          className="p-2"
        />
        <Button
          icon={<FaMagnifyingGlassPlus />}
          onClick={increaseZoom}
          variant="outline"
          ariaLabel="Aumentar zoom"
          className="p-2"
        />
        <Button
          icon={<FaRotateRight />}
          onClick={resetZoom}
          variant="outline"
          ariaLabel="Resetar zoom"
          className="p-2"
        />
        {initialHeaderProps?.actionsSlot}
      </>
    ),
    [decreaseZoom, increaseZoom, resetZoom, initialHeaderProps?.actionsSlot]
  );

  return (
    <main className="flex min-h-screen h-screen bg-gray-100">
      <SideBar
        listItems={sideBarItems}
        iconScreen={sideBarIcon}
        titleScreen={sideBarTitle}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          {...currentHeaderProps}
          actionsSlot={zoomActionsSlot}
          filtersSlot={currentFiltersSlot}
        />
        <div className={cn("flex-1 overflow-y-auto p-4", className)}>
          <DashboardLayoutProvider value={contextValue}>
            <Outlet />
          </DashboardLayoutProvider>
        </div>
      </div>
    </main>
  );
};
