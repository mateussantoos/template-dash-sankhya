import React from "react";
import { cn } from "@/utils/use-cn";
import { FaBars } from "react-icons/fa6";

export interface SideBarItem {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}

interface SideBarProps {
  listItems?: SideBarItem[];
  initialExpanded?: boolean;
  className?: string;
  iconScreen?: React.ReactNode;
  titleScreen?: string;
}

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 256;

export const SideBar: React.FC<SideBarProps> = ({
  listItems,
  initialExpanded = true,
  className,
  iconScreen,
  titleScreen,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(initialExpanded);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.08)]",
        className
      )}
      style={{
        width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        minWidth: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
      }}
    >
      <div className="flex items-center justify-between gap-3 border-b bg-gray-50 border-slate-200 px-3 py-4">
        {isExpanded && (
          <div className="select-none flex items-center gap-2 text-sm font-semibold text-slate-800">
            <span className="flex items-center justify-center rounded-md text-slate-600 transition group-hover:border-gray-200 group-hover:bg-gray-50 group-hover:text-gray-600 w-8 h-8 bg-gray-100 border border-gray-200">
              {iconScreen}
            </span>
            <span className="text-sm font-semibold text-slate-800 whitespace-nowrap text-ellipsis overflow-hidden">
              {titleScreen}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={toggleExpanded}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full  bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none cursor-pointer ${
            isExpanded ? "" : "ml-1"
          }`}
          aria-expanded={isExpanded}
          aria-label={
            isExpanded ? "Recolher menu lateral" : "Expandir menu lateral"
          }
        >
          <FaBars className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {listItems?.map((item) => {
          const handleClick = () => item.onClick?.();

          return (
            <button
              key={item.label}
              type="button"
              onClick={handleClick}
              className={cn(
                "group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition focus:outline-nonefocus:ring-offset-2",
                item.active
                  ? "bg-gray-100 text-gray-700 font-bold"
                  : "text-slate-600 hover:bg-gray-100 hover:text-slate-900",
                !isExpanded && "justify-center px-0"
              )}
              title={!isExpanded ? item.label : undefined}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-md text-slate-600 transition group-hover:border-gray-200 group-hover:bg-gray-50 group-hover:text-gray-600",
                  item.active && "border-gray-200  text-gray-600 "
                )}
              >
                {item.icon}
              </span>
              {isExpanded && (
                <span className="flex-1 truncate text-left">{item.label}</span>
              )}
            </button>
          );
        })}

        {!listItems?.length && (
          <div className="rounded-md border border-dashed border-slate-200 px-3 py-4 text-xs text-slate-500">
            Nenhum item disponível.
          </div>
        )}
      </nav>
    </aside>
  );
};
