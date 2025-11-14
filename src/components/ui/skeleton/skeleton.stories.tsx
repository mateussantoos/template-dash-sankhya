import type { Meta, StoryObj } from "@storybook/react";

import { Skeleton } from "./skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  args: {
    className: "h-4 w-48",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Placeholder animado utilizado para indicar carregamento de conteúdo em cartões, listas e tabelas.",
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "Permite ajustar dimensões e formato do placeholder.",
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {};

export const TextBlock: Story = {
  render: (args) => (
    <div className="w-64 space-y-3">
      <Skeleton {...args} className="h-4 w-full" />
      <Skeleton {...args} className="h-4 w-5/6" />
      <Skeleton {...args} className="h-4 w-2/3" />
    </div>
  ),
};

export const AvatarWithDetails: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  ),
};
