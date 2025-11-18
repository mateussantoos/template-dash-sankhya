import type { Meta, StoryObj } from "@storybook/react";
import { ColumnChart } from "./column-chart";

const meta: Meta<typeof ColumnChart> = {
  title: "Charts/ColumnChart",
  component: ColumnChart,
  args: {
    title: "Sessões por dia",
    categoryKey: "dia",
    dataKey: "total",
    data: [
      { dia: "Seg", total: 12 },
      { dia: "Ter", total: 18 },
      { dia: "Qua", total: 9 },
      { dia: "Qui", total: 22 },
      { dia: "Sex", total: 15 },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof ColumnChart>;

export const Default: Story = {};

export const CustomColor: Story = {
  args: {
    color: "#a855f7",
  },
};

export const ManyCategories: Story = {
  args: {
    data: Array.from({ length: 12 }).map((_, idx) => ({
      dia: `Mês ${idx + 1}`,
      total: Math.round(Math.random() * 100 + 10),
    })),
    height: "450px",
  },
};
