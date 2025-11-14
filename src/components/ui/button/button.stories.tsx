import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    text: "Clique aqui",
    onClick: () => {},
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "primary",
        "info",
        "warning",
        "danger",
        "brand",
        "outline",
        "dark",
      ],
      description: "Define a paleta visual utilizada no botão.",
      table: {
        category: "Aparência",
      },
    },
    isLoading: {
      control: "boolean",
      description: "Exibe um spinner e impede interações durante carregamento.",
      table: {
        category: "Estado",
      },
    },
    iconName: {
      control: "text",
      description: "Classe CSS do ícone Font Awesome exibido ao lado do texto.",
      table: {
        category: "Conteúdo",
      },
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Botão inspirado em paletas clássicas para ações principais e secundárias do dashboard. Utilize as variantes para comunicar a importância de cada ação.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
  },
};

export const Brand: Story = {
  args: {
    variant: "brand",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Dark: Story = {
  args: {
    variant: "dark",
  },
};

export const LoadingPrimary: Story = {
  args: {
    variant: "primary",
    isLoading: true,
  },
};
