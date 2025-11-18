import type { Meta, StoryObj } from "@storybook/react";
import { PieChartCard } from "./pie-chart";

const baseData = [
  { tipo: "Suporte", total: 320 },
  { tipo: "Vendas", total: 210 },
  { tipo: "Financeiro", total: 120 },
  { tipo: "RH", total: 80 },
];

const meta: Meta<typeof PieChartCard> = {
  title: "Charts/PieChart",
  component: PieChartCard,
  args: {
    title: "Distribuição por setor",
    data: baseData,
    dataKey: "total",
    nameKey: "tipo",
  },
};

export default meta;
type Story = StoryObj<typeof PieChartCard>;

export const Default: Story = {};

export const Donut: Story = {
  args: {
    innerRadius: 70,
    outerRadius: 100,
    height: "380px",
  },
};

export const CustomColors: Story = {
  args: {
    colors: ["#0ea5e9", "#ef4444", "#22c55e", "#a855f7"],
  },
};

