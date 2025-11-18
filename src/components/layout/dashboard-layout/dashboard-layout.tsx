import React from "react";
import { Outlet } from "react-router-dom";
import { Header, type HeaderProps } from "@/components/layout/header/header";
import {
  SideBar,
  type SideBarItem,
} from "@/components/layout/side-bar/side-bar";
import { FaChartLine, FaGear, FaHouse } from "react-icons/fa6";
import { cn } from "@/utils/use-cn";

interface DashboardLayoutProps {
  className?: string;
  headerProps?: Partial<HeaderProps>;
  sideBarItems?: SideBarItem[];
  sideBarIcon?: React.ReactNode;
  sideBarTitle?: string;
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
  headerProps,
  sideBarItems = defaultSideBarItems,
  sideBarIcon = <FaChartLine className="h-4 w-4" />,
  sideBarTitle = "Dashboard",
}) => {
  const mergedHeaderProps: HeaderProps = {
    title: "Home",
    ...headerProps,
  };

  return (
    <main className="flex min-h-screen h-screen bg-gray-100">
      <SideBar
        listItems={sideBarItems}
        iconScreen={sideBarIcon}
        titleScreen={sideBarTitle}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header {...mergedHeaderProps} />
        <div className={cn("flex-1 overflow-y-auto p-4", className)}>
          <Outlet />
        </div>
      </div>
    </main>
  );
};
