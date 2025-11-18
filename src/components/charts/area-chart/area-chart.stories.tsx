import type { Meta, StoryObj } from "@storybook/react";
import { AreaChartCard } from "./area-chart";

const meta: Meta<typeof AreaChartCard> = {
  title: "Charts/AreaChart",
  component: AreaChartCard,
  args: {
    title: "Mensagens acumuladas",
    categoryKey: "dia",
    dataKey: "mensagens",
    data: [
      { dia: "Seg", mensagens: 120 },
      { dia: "Ter", mensagens: 180 },
      { dia: "Qua", mensagens: 150 },
      { dia: "Qui", mensagens: 220 },
      { dia: "Sex", mensagens: 260 },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof AreaChartCard>;

export const Default: Story = {};

export const CustomGradient: Story = {
  args: {
    color: "#f97316",
    gradientId: "customAreaGradient",
    height: "420px",
  },
};

export const DenseData: Story = {
  args: {
    data: Array.from({ length: 15 }).map((_, idx) => ({
      dia: `Dia ${idx + 1}`,
      mensagens: Math.round(Math.random() * 100 + 50),
    })),
    height: "360px",
  },
};

