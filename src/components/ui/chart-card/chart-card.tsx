import React from "react";
import { Card } from "@/components/ui/card/card";
import { cn } from "@/utils/use-cn";
import { Button } from "@/components/ui/button/button";
import { FaDownload } from "react-icons/fa";
import { exportChartAsImage } from "@/utils/use-export-chart-image";

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
  const chartRef = React.useRef<HTMLDivElement>(null);

  const handleExport = React.useCallback(() => {
    void exportChartAsImage(chartRef.current, {
      fileName: title,
    });
  }, [title]);

  return (
    <Card className={className}>
      {/* Card Header */}
      <div className={cn("flex justify-between items-center mb-4 px-2")}>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {actionsSlot && (
          <div className={cn("flex items-center gap-2")}>{actionsSlot}</div>
        )}
        <Button
          icon={<FaDownload />}
          onClick={handleExport}
          variant="outline"
          className="px-3 py-2"
          ariaLabel="Baixar imagem do gráfico"
        />
      </div>

      {/* Chart Container */}
      <div
        className={cn("relative bg-gray-50 rounded-md p-2")}
        style={{ height: chartHeight }}
        ref={chartRef}
      >
        {children}
      </div>
    </Card>
  );
};
