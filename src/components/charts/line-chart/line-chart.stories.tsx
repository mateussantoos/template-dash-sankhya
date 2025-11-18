import type { Meta, StoryObj } from "@storybook/react";
import { LineChartCard } from "./line-chart";

const baseData = [
  { mes: "Jan", total: 40 },
  { mes: "Fev", total: 55 },
  { mes: "Mar", total: 48 },
  { mes: "Abr", total: 62 },
  { mes: "Mai", total: 70 },
  { mes: "Jun", total: 65 },
];

const meta: Meta<typeof LineChartCard> = {
  title: "Charts/LineChart",
  component: LineChartCard,
  args: {
    title: "Crescimento mensal",
    data: baseData,
    categoryKey: "mes",
    dataKey: "total",
  },
};

export default meta;
type Story = StoryObj<typeof LineChartCard>;

export const Default: Story = {};

export const SmoothLine: Story = {
  args: {
    color: "#10b981",
    showDots: false,
  },
};

export const MultiYearComparison: Story = {
  render: (args) => (
    <LineChartCard
      {...args}
      data={baseData.map((item, index) => ({
        ...item,
        total: item.total + index * 5,
      }))}
      actionsSlot={<span className="text-sm text-gray-500">2024</span>}
    />
  ),
};

