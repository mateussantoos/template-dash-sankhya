import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select, type SelectOption, type SelectProps } from "./select";

const OPTIONS = [
  { value: "", label: "Selecione uma opção", disabled: true },
  { value: "analytics", label: "Relatórios de Analytics" },
  { value: "finance", label: "Painel Financeiro" },
  { value: "inventory", label: "Controle de Estoque" },
  { value: "crm", label: "CRM Comercial" },
];

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    label: "Módulo",
    helperText: "Escolha o módulo que deseja visualizar",
    placeholder: "Selecione uma opção",
    options: OPTIONS,
    defaultValue: "",
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Select estilizado e acessível para formulários, com suporte a estados de erro, textos auxiliares e integração com react-icons.",
      },
    },
  },
  argTypes: {
    onValueChange: {
      action: "value changed",
      table: {
        category: "Eventos",
      },
    },
    options: {
      control: false,
      table: {
        category: "Conteúdo",
      },
    },
    helperText: {
      control: "text",
      table: {
        category: "Aparência",
      },
    },
    error: {
      control: "text",
      table: {
        category: "Estado",
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: "É necessário selecionar um módulo antes de continuar.",
    helperText: undefined,
    defaultValue: "",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

const ControlledSelect = (args: SelectProps) => {
  const options: SelectOption[] = args.options ?? OPTIONS;
  const [value, setValue] = useState<string>(String(options[1]?.value ?? ""));

  return (
    <div className="max-w-sm space-y-2">
      <Select
        {...args}
        options={options}
        value={value}
        onValueChange={setValue}
        helperText={`Selecionado: ${
          options.find((option) => String(option.value) === value)?.label ??
          "Nenhum"
        }`}
      />
    </div>
  );
};

export const Controlled: Story = {
  render: (args) => {
    const selectArgs = args as unknown as SelectProps;
    return <ControlledSelect {...selectArgs} />;
  },
};
