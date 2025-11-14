import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/utils/use-cn";

interface InfoTooltipProps {
  text?: string;
  position?: "top" | "bottom" | "left" | "right";
}

/**
 * A reusable info icon component that shows a descriptive tooltip on hover.
 */
export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  position = "top",
}) => {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>();
  const [currentPlacement, setCurrentPlacement] =
    useState<InfoTooltipProps["position"]>(position);
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>();
  const tooltipId = useId();

  const getPlacementOrder = useCallback(
    (preferred: InfoTooltipProps["position"]) => {
      const placements: Array<NonNullable<InfoTooltipProps["position"]>> = [
        "top",
        "right",
        "bottom",
        "left",
      ];
      const ordered = new Set<NonNullable<InfoTooltipProps["position"]>>();
      ordered.add(preferred ?? "top");
      placements.forEach((placement) => ordered.add(placement));
      return Array.from(ordered);
    },
    []
  );

  const updateTooltipPosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) {
      window.requestAnimationFrame(updateTooltipPosition);
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY ?? 0;
    const scrollX = window.scrollX ?? 0;
    const offset = 12;
    const margin = 8;
    const arrowSize = 12;

    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;

    type Placement = NonNullable<InfoTooltipProps["position"]>;
    const placements = getPlacementOrder(position);

    let bestPlacement: Placement | null = null;
    let bestPosition: { top: number; left: number } | null = null;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    placements.forEach((placement) => {
      if (bestPlacement) {
        return;
      }

      let top = 0;
      let left = 0;

      if (placement === "top") {
        top = rect.top + scrollY - offset - tooltipHeight;
        left = rect.left + rect.width / 2 + scrollX - tooltipWidth / 2;
      } else if (placement === "bottom") {
        top = rect.bottom + scrollY + offset;
        left = rect.left + rect.width / 2 + scrollX - tooltipWidth / 2;
      } else if (placement === "left") {
        top = rect.top + rect.height / 2 + scrollY - tooltipHeight / 2;
        left = rect.left + scrollX - offset - tooltipWidth;
      } else if (placement === "right") {
        top = rect.top + rect.height / 2 + scrollY - tooltipHeight / 2;
        left = rect.right + scrollX + offset;
      }

      const fitsVertically =
        top >= margin && top + tooltipHeight <= viewportHeight - margin;
      const fitsHorizontally =
        left >= margin && left + tooltipWidth <= viewportWidth - margin;

      if (fitsVertically && fitsHorizontally) {
        bestPlacement = placement;
        bestPosition = { top, left };
      }
    });

    if (!bestPlacement || !bestPosition) {
      bestPlacement = placements[0] ?? "top";
      let top = rect.top + rect.height / 2 + scrollY - tooltipHeight / 2;
      let left = rect.left + rect.width / 2 + scrollX - tooltipWidth / 2;
      if (bestPlacement === "top") {
        top = rect.top + scrollY - offset - tooltipHeight;
      } else if (bestPlacement === "bottom") {
        top = rect.bottom + scrollY + offset;
      } else if (bestPlacement === "left") {
        left = rect.left + scrollX - offset - tooltipWidth;
      } else if (bestPlacement === "right") {
        left = rect.right + scrollX + offset;
      }
      bestPosition = { top, left };
    }

    const maxTop = viewportHeight - margin - tooltipHeight;
    const maxLeft = viewportWidth - margin - tooltipWidth;

    const finalTop = clamp(bestPosition.top, margin, Math.max(maxTop, margin));
    const finalLeft = clamp(
      bestPosition.left,
      margin,
      Math.max(maxLeft, margin)
    );

    if (bestPlacement === "top" || bestPlacement === "bottom") {
      const triggerCenter = rect.left + rect.width / 2 + scrollX;
      let arrowLeft = triggerCenter - finalLeft - arrowSize / 2;
      arrowLeft = clamp(
        arrowLeft,
        margin / 2,
        tooltipWidth - arrowSize - margin / 2
      );
      setArrowStyle({ left: arrowLeft });
    } else {
      const triggerCenter = rect.top + rect.height / 2 + scrollY;
      let arrowTop = triggerCenter - finalTop - arrowSize / 2;
      arrowTop = clamp(
        arrowTop,
        margin / 2,
        tooltipHeight - arrowSize - margin / 2
      );
      setArrowStyle({ top: arrowTop });
    }

    setCurrentPlacement(bestPlacement);
    setTooltipStyle({
      top: finalTop,
      left: finalLeft,
    });
  }, [getPlacementOrder, position]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updateTooltipPosition();
    window.addEventListener("scroll", updateTooltipPosition, true);
    window.addEventListener("resize", updateTooltipPosition);

    return () => {
      window.removeEventListener("scroll", updateTooltipPosition, true);
      window.removeEventListener("resize", updateTooltipPosition);
    };
  }, [isOpen, updateTooltipPosition]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = window.requestAnimationFrame(() => {
      updateTooltipPosition();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, updateTooltipPosition]);

  useEffect(() => {
    if (!text) {
      setIsOpen(false);
    }
  }, [text]);

  const handleOpen = () => {
    if (!text) return;
    setIsOpen(true);
    updateTooltipPosition();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={cn(
        "pointer-events-none fixed z-50 w-64 max-w-xs rounded-lg bg-gray-800 p-3 text-xs text-white shadow-lg",
        "transform-gpu transition-all duration-200 ease-out"
      )}
      style={tooltipStyle}
      role="tooltip"
      id={tooltipId}
    >
      <span
        className={cn(
          "absolute h-3 w-3 rotate-45 bg-gray-800",
          currentPlacement === "top" && "bottom-[-6px]",
          currentPlacement === "bottom" && "top-[-6px]",
          currentPlacement === "left" && "right-[-6px]",
          currentPlacement === "right" && "left-[-6px]"
        )}
        style={arrowStyle}
        aria-hidden
      />
      {text}
    </div>
  );

  return (
    <>
      {/* The 'i' icon */}
      <span
        ref={triggerRef}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onFocus={handleOpen}
        onBlur={handleClose}
        aria-describedby={text ? tooltipId : undefined}
        className={cn(
          "inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-300"
        )}
      >
        i
      </span>
      {isOpen && text && typeof document !== "undefined"
        ? createPortal(tooltipContent, document.body)
        : null}
    </>
  );
};
