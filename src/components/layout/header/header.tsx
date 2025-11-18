import React from "react";
import { InfoTooltip } from "@/components/ui/info-tooltip/info-tooltip";

// Defines the properties for the Header component
export interface HeaderProps {
  title: string;
  infoTooltipText?: string;
  actionsSlot?: React.ReactNode;
  filtersSlot?: React.ReactNode;
  className?: string;
}

/**
 * A reusable header component for dashboard pages.
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  infoTooltipText,
  actionsSlot,
  filtersSlot,
  className = "",
}) => {
  return (
    <header
      className={`bg-white border-b border-gray-200 p-6 shadow-sm z-[100px] relative ${className}`}
    >
      {/* Top Section: Title and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Title Area */}
        <h1 className="text-xl font-bold text-gray-900 m-0 flex items-center gap-2">
          {title}
          {infoTooltipText && <InfoTooltip text={infoTooltipText} />}
        </h1>

        {/* Actions Area (Buttons) */}
        {actionsSlot && (
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end ">
            {actionsSlot}
          </div>
        )}
      </div>

      {/* Filters Section */}
      {filtersSlot && (
        <div className="flex flex-wrap items-end gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          {filtersSlot}
        </div>
      )}
    </header>
  );
};
