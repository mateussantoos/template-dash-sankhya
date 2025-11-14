import type { Meta, StoryObj } from "@storybook/react";
import { InfoTooltip } from "./info-tooltip";

const meta = {
  title: "Components/InfoTooltip",
  component: InfoTooltip,
  tags: ["autodocs"],
  args: {
    text: "Informação adicional exibida ao passar o mouse sobre o ícone.",
    position: "top",
  },
  argTypes: {
    text: {
      control: "text",
      description: "Conteúdo textual exibido dentro do balão.",
    },
    position: {
      control: "radio",
      options: ["top", "right", "bottom", "left"],
      description: "Direção preferencial do tooltip em relação ao ícone.",
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "`InfoTooltip` utiliza portais para renderizar o balão fora da hierarquia atual, evitando cortes e respeitando a direção configurada.",
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      Passe o mouse {<InfoTooltip {...args} />} para ver o tooltip.
    </div>
  ),
} satisfies Meta<typeof InfoTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {};

export const Right: Story = {
  args: {
    position: "right",
  },
};

export const Bottom: Story = {
  args: {
    position: "bottom",
  },
};

export const Left: Story = {
  args: {
    position: "left",
  },
};
