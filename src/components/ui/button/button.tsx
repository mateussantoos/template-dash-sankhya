/*
 * file: button.tsx
 * description: A reusable action button component with multiple variants.
 */

import React from "react";
import { cn } from "@/utils/use-cn";
import type { IconType } from "react-icons";

/**
 * Visual variants available for the `Button` component.
 */
export type ButtonVariant =
  | "default"
  | "primary"
  | "info"
  | "warning"
  | "danger"
  | "brand"
  | "secondary"
  | "success"
  | "outline"
  | "dark";

/**
 * Accepted properties for the `Button` component.
 */
interface ActionButtonProps {
  text?: string;
  variant?: ButtonVariant;
  iconName?: string;
  icon?: React.ReactNode | IconType;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  onClick: () => void;
  ariaLabel?: string;
}

/**
 * A generic, reusable button component for dashboard actions.
 * It replaces the .btn, .btn-primary, etc. classes from style.css.
 */
export const Button: React.FC<ActionButtonProps> = ({
  text = "",
  variant = "default",
  iconName,
  icon,
  disabled = false,
  isLoading = false,
  className = "",
  onClick,
  ariaLabel,
}) => {
  // Base styles shared by all buttons
  const baseStyles =
    "inline-flex items-center justify-center px-4 py-1 rounded-sm border border-transparent text-sm font-semibold transition-colors transition-all duration-200 focus:outline-none cursor-pointer hover:translate-y-[-2px] font-bold";

  // Variant-specific styles inspired by classic UI palettes
  const variantStyles: Record<
    Exclude<ButtonVariant, "secondary" | "success">,
    string
  > = {
    default:
      "bg-white text-gray-800 border-gray-300 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300 disabled:bg-gray-100 disabled:text-gray-400",
    primary:
      "bg-blue-500 text-white border-blue-600 hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-400 disabled:bg-blue-300",
    info: "bg-sky-400 text-white border-sky-500 hover:bg-sky-500 active:bg-sky-600 focus:ring-sky-300 disabled:bg-sky-300",
    warning:
      "bg-amber-400 text-white border-amber-500 hover:bg-amber-500 active:bg-amber-600 focus:ring-amber-300 disabled:bg-amber-300",
    danger:
      "bg-red-500 text-white border-red-600 hover:bg-red-600 active:bg-red-700 focus:ring-red-400 disabled:bg-red-300",
    brand:
      "bg-green-600 text-white border-green-700 hover:bg-green-700 active:bg-green-800 focus:ring-green-400 disabled:bg-green-300",
    outline:
      "bg-transparent text-gray-800 border border-transparent hover:border-gray-300 hover:bg-gray-100 active:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400",
    dark: "bg-gray-800 text-white border-gray-800 hover:bg-gray-800/80 active:bg-gray-800/80 focus:ring-gray-800/80 disabled:bg-gray-800/80 disabled:text-gray-400 ",
  };

  const normalizedVariant =
    variant === "secondary"
      ? "default"
      : variant === "success"
      ? "brand"
      : variant;

  const iconContent = React.useMemo(() => {
    if (isLoading) {
      return <i className="fas fa-spinner fa-spin" />;
    }
    if (icon) {
      if (typeof icon === "function") {
        const IconComponent = icon as IconType;
        return <IconComponent className="h-4 w-4" aria-hidden />;
      }
      return icon;
    }
    if (iconName) {
      return <i className={iconName} />;
    }
    return null;
  }, [icon, iconName, isLoading]);

  const showIcon = Boolean(iconContent);
  const buttonText = isLoading ? "Carregando..." : text;
  const showText = Boolean(buttonText);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        baseStyles,
        showIcon && showText ? "gap-2" : "gap-0",
        variantStyles[normalizedVariant],
        "disabled:cursor-not-allowed",
        className
      )}
    >
      {showIcon && (
        <span className="inline-flex items-center" aria-hidden={!showText}>
          {iconContent}
        </span>
      )}
      {showText && <span>{buttonText}</span>}
    </button>
  );
};
