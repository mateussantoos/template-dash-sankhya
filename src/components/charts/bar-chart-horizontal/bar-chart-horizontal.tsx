import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { ChartCard } from "@/components/ui/chart-card/chart-card";

interface HorizontalBarChartProps {
  title: string;
  data: Array<Record<string, any>>;
  dataKey: string;
  categoryKey: string;
  color?: string;
  actionsSlot?: React.ReactNode;
  height?: string;
  className?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  title,
  data,
  dataKey,
  categoryKey,
  color = "#f59e0b",
  actionsSlot,
  height = "400px",
  className,
}) => (
  <ChartCard
    title={title}
    actionsSlot={actionsSlot}
    chartHeight={height}
    className={className}
  >
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey={categoryKey} type="category" width={120} />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);
