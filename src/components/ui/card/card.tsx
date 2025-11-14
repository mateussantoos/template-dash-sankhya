import React from "react";
import { cn } from "@/utils/use-cn";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  skeletonLines?: number;
  contentClassName?: string;
  loadingVariant?: "lines" | "block";
  skeletonClassName?: string;
}

/**
 * A generic visual container used to group blocks of content.
 * Provides standard card styles with border, shadow, and rounded corners.
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  isLoading = false,
  skeletonLines = 3,
  contentClassName,
  loadingVariant = "lines",
  skeletonClassName,
}) => {
  const baseClasses =
    "bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5";

  const skeletonContent =
    loadingVariant === "block" ? (
      <Skeleton
        variant="block"
        className={cn("h-full min-h-[160px]", skeletonClassName)}
      />
    ) : (
      <div className="space-y-3">
        {Array.from({ length: Math.max(1, skeletonLines) }).map((_, index) => (
          <Skeleton
            key={index}
            variant="line"
            className={cn("last:w-3/5", skeletonClassName)}
          />
        ))}
      </div>
    );

  return (
    <div className={cn(baseClasses, className)}>
      <div
        className={cn(
          "p-4",
          contentClassName,
          isLoading && loadingVariant === "block" && "flex items-center"
        )}
      >
        {isLoading ? skeletonContent : children}
      </div>
    </div>
  );
};
