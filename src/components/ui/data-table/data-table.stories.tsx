import type { Meta, StoryObj } from "@storybook/react";
import {
  DataTable,
  type ColumnDefinition,
} from "@/components/ui/data-table/data-table";

type OrderRow = {
  id: number;
  customer: string;
  status: "Pendente" | "Processando" | "Concluído";
  total: string;
  createdAt: string;
};

const columns: ColumnDefinition<OrderRow>[] = [
  {
    key: "customer",
    header: "Cliente",
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
          row.status === "Concluído"
            ? "bg-green-100 text-green-700"
            : row.status === "Processando"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: "total",
    header: "Total",
  },
  {
    key: "createdAt",
    header: "Criado em",
  },
];

const data: OrderRow[] = [
  {
    id: 1,
    customer: "Maria da Silva",
    status: "Concluído",
    total: "R$ 1.250,00",
    createdAt: "12/03/2024",
  },
  {
    id: 2,
    customer: "João Souza",
    status: "Processando",
    total: "R$ 890,50",
    createdAt: "14/03/2024",
  },
  {
    id: 3,
    customer: "Ana Paula",
    status: "Pendente",
    total: "R$ 430,00",
    createdAt: "15/03/2024",
  },
  {
    id: 4,
    customer: "Carlos Alberto",
    status: "Concluído",
    total: "R$ 2.310,90",
    createdAt: "18/03/2024",
  },
  {
    id: 5,
    customer: "Fernanda Lima",
    status: "Processando",
    total: "R$ 765,40",
    createdAt: "19/03/2024",
  },
  {
    id: 6,
    customer: "Paulo Henrique",
    status: "Pendente",
    total: "R$ 510,30",
    createdAt: "21/03/2024",
  },
  {
    id: 7,
    customer: "Juliana Souza",
    status: "Concluído",
    total: "R$ 3.980,00",
    createdAt: "25/03/2024",
  },
  {
    id: 8,
    customer: "Roberto Dias",
    status: "Processando",
    total: "R$ 1.120,90",
    createdAt: "26/03/2024",
  },
  {
    id: 9,
    customer: "Patrícia Gomes",
    status: "Pendente",
    total: "R$ 345,60",
    createdAt: "27/03/2024",
  },
  {
    id: 10,
    customer: "Marcelo Vieira",
    status: "Concluído",
    total: "R$ 2.760,20",
    createdAt: "28/03/2024",
  },
  {
    id: 11,
    customer: "Larissa Nunes",
    status: "Processando",
    total: "R$ 980,00",
    createdAt: "29/03/2024",
  },
  {
    id: 12,
    customer: "Eduardo Ramos",
    status: "Pendente",
    total: "R$ 620,15",
    createdAt: "30/03/2024",
  },
];

const DataTableExample = (
  props: React.ComponentProps<typeof DataTable<OrderRow>>
) => <DataTable<OrderRow> {...props} />;

const meta = {
  title: "Components/DataTable",
  component: DataTableExample,
  tags: ["autodocs"],
  args: {
    title: "Pedidos Recentes",
    columns,
    data,
    searchableColumns: ["customer", "status", "total", "createdAt"],
    searchPlaceholder: "Buscar pedidos...",
    pageSize: 5,
    pageSizeOptions: [5, 10, 20, 50],
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tabela reutilizável com cabeçalho, filtros, ações e corpo responsivo. Configure as colunas via `ColumnDefinition` e personalize células com `render`.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Título exibido no cabeçalho da tabela.",
    },
    actionSlot: {
      control: false,
      description: "Área para botões ou menus de ações complementares.",
    },
    pageSize: {
      control: { type: "number", min: 1, step: 1 },
      description: "Quantidade inicial de registros exibidos por página.",
    },
    pageSizeOptions: {
      control: false,
      description: "Lista de opções disponíveis para ajuste da paginação.",
    },
    initialPage: {
      control: { type: "number", min: 0, step: 1 },
      description: "Página inicial (começa em 0).",
    },
    onPageChange: {
      control: false,
      description: "Callback disparado ao mudar de página.",
    },
    searchableColumns: {
      control: false,
      description: "Lista de colunas consideradas pelo campo de busca interno.",
    },
    searchPlaceholder: {
      control: "text",
      description: "Texto exibido como placeholder no campo de busca.",
    },
    onRowClick: {
      control: false,
      description: "Callback disparado ao clicar em uma linha da tabela.",
    },
  },
} satisfies Meta<typeof DataTableExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyState: Story = {
  args: {
    data: [],
  },
};
