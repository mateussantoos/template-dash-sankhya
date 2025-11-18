import type { Meta, StoryObj } from "@storybook/react";
import { HorizontalBarChart } from "./bar-chart-horizontal";

const meta: Meta<typeof HorizontalBarChart> = {
  title: "Charts/HorizontalBarChart",
  component: HorizontalBarChart,
  args: {
    title: "Tempo médio por atendente",
    dataKey: "tempo",
    categoryKey: "nome",
    data: [
      { nome: "Ana", tempo: 32 },
      { nome: "Bruno", tempo: 27 },
      { nome: "Carla", tempo: 45 },
      { nome: "Diego", tempo: 21 },
      { nome: "Eduarda", tempo: 39 },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof HorizontalBarChart>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    height: "320px",
    data: [
      { nome: "Equipe A", tempo: 80 },
      { nome: "Equipe B", tempo: 95 },
      { nome: "Equipe C", tempo: 70 },
    ],
  },
};

export const CustomColor: Story = {
  args: {
    color: "#2563eb",
  },
};

