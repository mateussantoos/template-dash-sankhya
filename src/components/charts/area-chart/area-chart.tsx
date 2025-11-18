import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChartCard } from "@/components/ui/chart-card/chart-card";

interface AreaChartProps {
  title: string;
  data: Array<Record<string, any>>;
  dataKey: string;
  categoryKey: string;
  color?: string;
  gradientId?: string;
  actionsSlot?: React.ReactNode;
  height?: string;
}

export const AreaChartCard: React.FC<AreaChartProps> = ({
  title,
  data,
  dataKey,
  categoryKey,
  color = "#10b981",
  gradientId = "areaGradient",
  actionsSlot,
  height = "400px",
}) => (
  <ChartCard title={title} actionsSlot={actionsSlot} chartHeight={height}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={categoryKey} />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  </ChartCard>
);
