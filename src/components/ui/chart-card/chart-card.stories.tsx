import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button/button";
import { FaDownload } from "react-icons/fa6";
import { ChartCard } from "./chart-card";

const meta = {
  title: "Components/ChartCard",
  component: ChartCard,
  tags: ["autodocs"],
  args: {
    title: "Vendas por mês",
    chartHeight: "320px",
    className: "w-[500px]",
    actionsSlot: (
      <Button
        variant="outline"
        className="py-[8px] px-[9px]"
        onClick={() => {}}
        icon={<FaDownload />}
      />
    ),
    children: (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        Área reservada para o gráfico
      </div>
    ),
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Card especializado para gráficos que padroniza cabeçalho, ações e área de plotagem, proporcionando consistência visual em dashboards.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Título exibido no cabeçalho do card.",
    },
    chartHeight: {
      control: "text",
      description: "Altura aplicada ao container do gráfico (ex.: `320px`).",
    },
    actionsSlot: {
      control: false,
      description: "Elemento React opcional exibido ao lado do título.",
    },
  },
} satisfies Meta<typeof ChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomHeight: Story = {
  args: {
    chartHeight: "200px",
  },
};
