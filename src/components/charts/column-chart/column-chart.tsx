import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { ChartCard } from "@/components/ui/chart-card/chart-card";

interface ColumnChartProps {
  title: string;
  data: Array<Record<string, any>>;
  dataKey: string;
  categoryKey: string;
  color?: string;
  actionsSlot?: React.ReactNode;
  height?: string;
  className?: string;
}

export const ColumnChart: React.FC<ColumnChartProps> = ({
  title,
  data,
  dataKey,
  categoryKey,
  color = "#0ea5e9",
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
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={categoryKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);
