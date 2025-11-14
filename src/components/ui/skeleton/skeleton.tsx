import React from "react";

import { cn } from "@/utils/use-cn";

type SkeletonVariant = "line" | "block";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, style, variant = "line", ...rest }, ref) => {
    const variantClasses =
      variant === "block"
        ? "w-full h-full rounded-lg"
        : "h-4 rounded-md w-full";

    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-gray-50/90 dark:bg-gray-700/40",
          variantClasses,
          className
        )}
        style={style}
        {...rest}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
