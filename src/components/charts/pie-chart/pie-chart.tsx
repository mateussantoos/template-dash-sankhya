import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { ChartCard } from "@/components/ui/chart-card/chart-card";

interface PieChartProps {
  title: string;
  data: Array<Record<string, any>>;
  dataKey: string; // valor
  nameKey: string; // label
  colors?: string[];
  actionsSlot?: React.ReactNode;
  height?: string;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
}

const defaultColors = ["#2563eb", "#f97316", "#10b981", "#e11d48", "#a855f7"];

export const PieChartCard: React.FC<PieChartProps> = ({
  title,
  data,
  dataKey,
  nameKey,
  colors = defaultColors,
  actionsSlot,
  height = "400px",
  innerRadius = 60,
  outerRadius = 90,
  className,
}) => (
  <ChartCard
    title={title}
    actionsSlot={actionsSlot}
    chartHeight={height}
    className={className}
  >
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip />
        <Legend />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={4}
          label
        >
          {data.map((_, idx) => (
            <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </ChartCard>
);
