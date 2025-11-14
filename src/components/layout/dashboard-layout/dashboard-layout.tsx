import React from "react";
import { DashboardCustomizationProvider } from "@/contexts/dashboard-customization-context";
import { Header, type HeaderProps } from "@/components/layout/header/header";
import {
  SideBar,
  type SideBarItem,
} from "@/components/layout/side-bar/side-bar";
import { FaChartLine, FaGear } from "react-icons/fa6";
import { cn } from "@/utils/use-cn";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  headerProps?: Partial<HeaderProps>;
}

const sideBarItems: SideBarItem[] = [
  {
    label: "Dashboard",
    icon: <FaChartLine className="h-4 w-4" />,
    active: true,
  },
  {
    label: "Configurações",
    icon: <FaGear className="h-4 w-4" />,
  },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  className,
  headerProps,
}) => {
  const mergedHeaderProps: HeaderProps = {
    title: "Dashboard",
    enableCustomizationToggle: false,
    ...headerProps,
  };

  return (
    <main className="flex min-h-screen h-screen bg-gray-100">
      <DashboardCustomizationProvider>
        <SideBar
          listItems={sideBarItems}
          iconScreen={<FaChartLine className="h-4 w-4" />}
          titleScreen="Dashboard Inspeções"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header {...mergedHeaderProps} />
          <div className={cn("flex-1 overflow-y-auto", className)}>
            {children}
          </div>
        </div>
      </DashboardCustomizationProvider>
    </main>
  );
};
