import React from "react";
import { Card } from "@/components/ui/card/card";
import { cn } from "@/utils/use-cn";

/**
 * Propriedades para o componente `ChartCard`.
 */
interface ChartCardProps {
  title: string;
  actionsSlot?: React.ReactNode;
  children: React.ReactNode;
  chartHeight?: string;
  className?: string;
}

/**
 * A container component to wrap charts, providing a consistent header and padding.
 */
export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  actionsSlot,
  children,
  chartHeight = "450px",
  className,
}) => {
  return (
    <Card>
      {/* Card Header */}
      <div
        className={cn("flex justify-between items-center mb-4 px-2", className)}
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {actionsSlot && (
          <div className={cn("flex items-center gap-2")}>{actionsSlot}</div>
        )}
      </div>

      {/* Chart Container */}
      <div
        className={cn("relative bg-gray-50 rounded-md p-2")}
        style={{ height: chartHeight }}
      >
        {children}
      </div>
    </Card>
  );
};
