import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { ChartCard } from "@/components/ui/chart-card/chart-card";

interface LineChartProps {
  title: string;
  data: Array<Record<string, any>>;
  dataKey: string;
  categoryKey: string;
  color?: string;
  actionsSlot?: React.ReactNode;
  height?: string;
  showDots?: boolean;
}

export const LineChartCard: React.FC<LineChartProps> = ({
  title,
  data,
  dataKey,
  categoryKey,
  color = "#2563eb",
  actionsSlot,
  height = "400px",
  showDots = true,
}) => (
  <ChartCard title={title} actionsSlot={actionsSlot} chartHeight={height}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={categoryKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          dot={showDots}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </ChartCard>
);
