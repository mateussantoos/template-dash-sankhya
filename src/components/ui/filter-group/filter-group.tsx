import React from "react";
import { InfoTooltip } from "@/components/ui/info-tooltip/info-tooltip";
import { cn } from "@/utils/use-cn";

// Defines the properties for the FilterGroup component
interface FilterGroupProps {
  label: string;
  tooltipText?: string;
  children: React.ReactNode;
  width?: string;
}

/**
 * A reusable wrapper for filter inputs to ensure consistent labeling and spacing.
 */
export const FilterGroup: React.FC<FilterGroupProps> = ({
  label,
  tooltipText,
  children,
  width = "w-full md:w-auto",
}) => {
  return (
    <div className={cn("flex flex-col gap-1 min-w-[300px]", width)}>
      <label className="text-sm font-semibold text-gray-700 flex gap-2">
        {label}
        {tooltipText && <InfoTooltip text={tooltipText} />}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  );
};
