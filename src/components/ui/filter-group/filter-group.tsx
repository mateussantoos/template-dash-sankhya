import React from "react";
import { InfoTooltip } from "@/components/ui/info-tooltip/info-tooltip";
import { useFilter as useFilterHook } from "@/hooks/use-filter";

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
    <div className={`flex flex-col gap-1 ${width}`}>
      <label className="text-sm font-semibold text-gray-700 flex gap-2">
        {label}
        {tooltipText && <InfoTooltip text={tooltipText} />}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export const useFilter = useFilterHook;
export type {
  FilterRecord,
  FilterValue,
  UseFilterOptions,
  UseFilterReturn,
} from "@/hooks/use-filter";
