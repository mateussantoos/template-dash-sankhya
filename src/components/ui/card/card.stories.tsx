import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./card";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    children: (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Título do cartão
        </h3>
        <p className="text-sm text-gray-600">
          Este é um cartão genérico utilizado para agrupar conteúdo relacionado.
        </p>
      </div>
    ),
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Container genérico com borda e sombra utilizado para agrupar informações relacionadas. Suporta estado de carregamento via skeletons.",
      },
    },
  },
  argTypes: {
    isLoading: {
      control: "boolean",
      description: "Exibe placeholders de skeleton no corpo do cartão.",
      table: { category: "Estado" },
    },
    skeletonLines: {
      control: { type: "number", min: 1, max: 8, step: 1 },
      description: "Quantidade de linhas exibidas durante o estado de loading.",
      table: { category: "Estado" },
    },
    contentClassName: {
      control: "text",
      description: "Permite sobrescrever o espaçamento interno padrão.",
      table: { category: "Layout" },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Highlighted: Story = {
  args: {
    className: "border-slate-500",
    contentClassName: "p-6",
    children: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">
          Cartão com Destaque
        </h3>
        <p className="text-sm text-slate-600">
          Utilize a prop <code>className</code> para personalizar o estilo do
          cartão conforme necessário.
        </p>
      </div>
    ),
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    skeletonLines: 4,
  },
};
