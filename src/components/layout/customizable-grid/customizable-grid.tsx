import React from "react";
import { cn } from "@/utils/use-cn";
import { useDashboardCustomization } from "@/contexts/dashboard-customization-context";
import type { Layout, Layouts } from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

type Breakpoints = Record<string, number>;
type Columns = Record<string, number>;

const DEFAULT_BREAKPOINTS: Breakpoints = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
};

const DEFAULT_COLUMNS: Columns = {
  lg: 12,
  md: 10,
  sm: 8,
  xs: 6,
  xxs: 4,
};

const DEFAULT_ROW_HEIGHT = 60;
const DEFAULT_ITEM_HEIGHT = 4;

export interface DashboardGridItem {
  id: string;
  element: React.ReactNode;
  layout?: Partial<Layout>;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
}

export interface CustomizableGridProps {
  gridId: string;
  items: DashboardGridItem[];
  className?: string;
  style?: React.CSSProperties;
  rowHeight?: number;
  breakpoints?: Breakpoints;
  columns?: Columns;
  margin?: [number, number];
  containerPadding?: [number, number];
  compactType?: "vertical" | "horizontal" | null;
  storageKey?: string;
  autoHeight?: boolean;
}

const clampToCols = (value: number, cols: number) => {
  if (value > cols) return Math.max(cols, 1);
  return Math.max(value, 1);
};

const buildLayouts = (
  items: DashboardGridItem[],
  breakpoints: Breakpoints,
  columns: Columns
): Layouts => {
  const layoutByBreakpoint: Layouts = {};

  Object.keys(breakpoints).forEach((breakpoint) => {
    const cols = columns[breakpoint] ?? DEFAULT_COLUMNS.lg;

    layoutByBreakpoint[breakpoint] = items.map((item, index) => {
      const base: Layout = {
        i: item.id,
        x: item.layout?.x ?? (index * 4) % cols,
        y:
          item.layout?.y ??
          Math.floor((index * 4) / cols) * DEFAULT_ITEM_HEIGHT,
        w: clampToCols(item.layout?.w ?? 4, cols),
        h: item.layout?.h ?? DEFAULT_ITEM_HEIGHT,
        minW: item.minW,
        maxW: item.maxW,
        minH: item.minH,
        maxH: item.maxH,
        static: item.static ?? false,
        isDraggable: item.layout?.isDraggable,
        isResizable: item.layout?.isResizable,
      };

      if (item.layout) {
        if (typeof item.layout.minW === "number") {
          base.minW = clampToCols(item.layout.minW, cols);
        }
        if (typeof item.layout.maxW === "number") {
          base.maxW = clampToCols(item.layout.maxW, cols);
        }
        if (typeof item.layout.w === "number") {
          base.w = clampToCols(item.layout.w, cols);
        }
      }

      base.x = Math.min(base.x, Math.max(cols - base.w, 0));

      return base;
    });
  });

  return layoutByBreakpoint;
};

export const CustomizableGrid: React.FC<CustomizableGridProps> = ({
  gridId,
  items,
  className,
  style,
  rowHeight = DEFAULT_ROW_HEIGHT,
  breakpoints = DEFAULT_BREAKPOINTS,
  columns = DEFAULT_COLUMNS,
  margin = [16, 16],
  containerPadding = [16, 16],
  compactType = "vertical",
  storageKey,
  autoHeight = true,
}) => {
  const { isCustomizing, registerGrid, layouts, updateGridLayouts } =
    useDashboardCustomization();

  const defaultLayouts = React.useMemo(
    () => buildLayouts(items, breakpoints, columns),
    [items, breakpoints, columns]
  );

  React.useEffect(() => {
    registerGrid(gridId, defaultLayouts, { storageKey });
  }, [gridId, defaultLayouts, registerGrid, storageKey]);

  const activeLayouts = layouts[gridId] ?? defaultLayouts;
  const activeLayoutsRef = React.useRef(activeLayouts);
  React.useEffect(() => {
    activeLayoutsRef.current = activeLayouts;
  }, [activeLayouts]);

  const handleLayoutChange = React.useCallback(
    (_current: Layout[], allLayouts: Layouts) => {
      updateGridLayouts(gridId, allLayouts);
    },
    [gridId, updateGridLayouts]
  );

  const contentRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  React.useEffect(() => {
    Object.keys(contentRefs.current).forEach((key) => {
      if (!items.some((item) => item.id === key)) {
        delete contentRefs.current[key];
      }
    });
  }, [items]);

  const adjustItemHeight = React.useCallback(
    (itemId: string, height: number) => {
      const verticalMargin = margin?.[1] ?? 0;
      const rowUnit = rowHeight + verticalMargin || 1;

      let hasChanges = false;
      const nextLayouts: Layouts = {};

      Object.entries(activeLayoutsRef.current).forEach(
        ([breakpoint, layout]) => {
          const currentItem = layout.find((config) => config.i === itemId);
          if (!currentItem) {
            return;
          }

          const minH = currentItem.minH ?? 1;
          const maxH = currentItem.maxH ?? Number.POSITIVE_INFINITY;
          const calculatedH = Math.max(
            minH,
            Math.ceil((height + verticalMargin) / rowUnit)
          );
          const nextH = Math.min(calculatedH, maxH);

          if (nextH !== currentItem.h) {
            hasChanges = true;
            nextLayouts[breakpoint] = layout.map((config) =>
              config.i === itemId ? { ...config, h: nextH } : config
            );
          }
        }
      );

      if (hasChanges) {
        updateGridLayouts(gridId, {
          ...activeLayoutsRef.current,
          ...nextLayouts,
        });
      }
    },
    [gridId, margin, rowHeight, updateGridLayouts]
  );

  React.useEffect(() => {
    if (!autoHeight) {
      return;
    }

    const observers: ResizeObserver[] = [];

    Object.entries(contentRefs.current).forEach(([itemId, node]) => {
      if (!node) {
        return;
      }

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        adjustItemHeight(itemId, entry.contentRect.height);
      });

      observer.observe(node);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [adjustItemHeight, autoHeight]);

  React.useEffect(() => {
    if (!autoHeight) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      Object.entries(contentRefs.current).forEach(([itemId, node]) => {
        if (!node) {
          return;
        }
        adjustItemHeight(itemId, node.offsetHeight);
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [adjustItemHeight, autoHeight, items.length]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative transition-all duration-200",
        isCustomizing &&
          "[&_div.react-grid-item]:ring-2 [&_div.react-grid-item]:ring-blue-300/40",
        className
      )}
      style={style}
      data-customizing={isCustomizing}
    >
      <ResponsiveGridLayout
        className="customizable-grid"
        layouts={activeLayouts}
        rowHeight={rowHeight}
        breakpoints={breakpoints}
        cols={columns}
        margin={margin}
        containerPadding={containerPadding}
        isDraggable={isCustomizing}
        isResizable={isCustomizing}
        compactType={compactType}
        preventCollision={false}
        onLayoutChange={handleLayoutChange}
        measureBeforeMount={false}
        useCSSTransforms
        autoSize
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "rounded-lg",
              isCustomizing &&
                "border-2 border-dashed border-blue-300/70 bg-white/80 backdrop-blur-sm p-1"
            )}
          >
            <div
              ref={(node) => {
                contentRefs.current[item.id] = node;
              }}
              className="w-full"
            >
              {item.element}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};
