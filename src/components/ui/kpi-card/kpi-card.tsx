import React from "react";
import { Card } from "@/components/ui/card/card";
import { InfoTooltip } from "@/components/ui/info-tooltip/info-tooltip";
import { cn } from "@/utils/use-cn";

// Defines the visual variant of the card (the top border color)
type CardVariant = "default" | "success" | "warning" | "danger";

// Defines the type for the KPI change indicator
type ChangeType = "positive" | "negative" | "neutral";

// Defines the properties for the KpiCard component
interface KpiCardProps {
  title: string;
  value: string;
  iconName?: string;
  tooltipText?: string;
  changeText?: string;
  changeType?: ChangeType;
  variant?: CardVariant;
}

/**
 * Renders the change indicator icon based on the change type.
 */
const ChangeIcon: React.FC<{ type: ChangeType }> = ({ type }) => {
  switch (type) {
    case "positive":
      return <i className="fas fa-arrow-up"></i>;
    case "negative":
      return <i className="fas fa-arrow-down"></i>;
    case "neutral":
      return <i className="fas fa-minus"></i>;
    default:
      return null;
  }
};

/**
 * A card component to display a single KPI, replacing the .kpi-card from style.css.
 */
export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  iconName,
  tooltipText,
  changeText,
  changeType = "neutral",
  variant = "default",
}) => {
  // Map variants to Tailwind classes for the top border
  const variantBorderStyles = {
    default: "bg-slate-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  };

  // Map changeType to Tailwind text color classes
  const changeTextStyles = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-500",
  };

  return (
    <Card className="relative overflow-hidden" contentClassName="p-6">
      {/* Top border accent */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1",
          variantBorderStyles[variant]
        )}
      ></div>

      {/* Card Header */}
      <div className={cn("flex justify-between items-start mb-4")}>
        <h3
          className={cn(
            "flex items-center text-sm font-semibold text-gray-600 gap-2"
          )}
        >
          {title}
          {tooltipText && <InfoTooltip text={tooltipText} />}
        </h3>
        {iconName && <i className={cn(iconName, "text-lg text-gray-400")}></i>}
      </div>

      {/* Card Value */}
      <p className={cn("text-4xl font-bold text-gray-900 mb-2 truncate")}>
        {value}
      </p>

      {/* Card Change Indicator */}
      {changeText && (
        <div
          className={cn(
            "flex items-center gap-1 text-sm",
            changeTextStyles[changeType]
          )}
        >
          <ChangeIcon type={changeType} />
          <span>{changeText}</span>
        </div>
      )}
    </Card>
  );
};
