import type { Meta, StoryObj } from "@storybook/react";

import { KpiCard } from "./kpi-card";

const meta = {
  title: "Components/KpiCard",
  component: KpiCard,
  tags: ["autodocs"],
  args: {
    title: "Receita Mensal",
    value: "R$ 85.340,00",
    changeText: "+12% em relação ao mês anterior",
    changeType: "positive",
    tooltipText: "Valor acumulado no mês vigente.",
    iconName: "fas fa-chart-line",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Card de KPI com destaque visual, suporte a tooltip e indicador de tendência (positiva, negativa ou neutra).",
      },
    },
  },
  argTypes: {
    changeType: {
      control: "radio",
      options: ["positive", "negative", "neutral"],
      description: "Define o ícone e a cor do indicador de variação.",
    },
    variant: {
      control: "radio",
      options: ["default", "success", "warning", "danger"],
      description: "Controla a cor do detalhe superior do card.",
    },
    tooltipText: {
      control: "text",
      description:
        "Texto opcional exibido quando o usuário passa o mouse no título.",
    },
  },
} satisfies Meta<typeof KpiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Positive: Story = {};

export const Negative: Story = {
  args: {
    changeText: "-7% comparado ao mês passado",
    changeType: "negative",
    variant: "danger",
  },
};

export const Neutral: Story = {
  args: {
    changeText: "Sem variação",
    changeType: "neutral",
    variant: "warning",
  },
};
