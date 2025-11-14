declare module "react-grid-layout" {
  import * as React from "react";

  export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
  }

  export type Layouts = Record<string, Layout[]>;

  export interface ResponsiveProps
    extends React.HTMLAttributes<HTMLDivElement> {
    layouts: Layouts;
    cols: Record<string, number>;
    breakpoints: Record<string, number>;
    rowHeight?: number;
    margin?: [number, number];
    containerPadding?: [number, number];
    isDraggable?: boolean;
    isResizable?: boolean;
    compactType?: "vertical" | "horizontal" | null;
    preventCollision?: boolean;
    onLayoutChange?: (layout: Layout[], layouts: Layouts) => void;
    children?: React.ReactNode;
    measureBeforeMount?: boolean;
    useCSSTransforms?: boolean;
    autoSize?: boolean;
  }

  export class Responsive extends React.Component<ResponsiveProps> {}

  export function WidthProvider<T>(
    Component: React.ComponentType<T>
  ): React.ComponentType<T>;
}
