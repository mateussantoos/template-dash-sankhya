import React from "react";
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
  sideBarItems?: SideBarItem[];
  sideBarIcon?: React.ReactNode;
  sideBarTitle?: string;
}

const defaultSideBarItems: SideBarItem[] = [
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
  sideBarItems = defaultSideBarItems,
  sideBarIcon = <FaChartLine className="h-4 w-4" />,
  sideBarTitle = "Dashboard",
}) => {
  const mergedHeaderProps: HeaderProps = {
    title: "Dashboard",
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
        <div className={cn("flex-1 overflow-y-auto", className)}>
          {children}
        </div>
      </div>
    </main>
  );
};
