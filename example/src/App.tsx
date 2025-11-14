import React from "react";
import dashboardData from "../../example/data.json";

import { DashboardLayout } from "@/components/layout/dashboard-layout/dashboard-layout";
import {
  CustomizableGrid,
  type DashboardGridItem,
} from "@/components/layout/customizable-grid/customizable-grid";
import { KpiCard } from "@/components/ui/kpi-card/kpi-card";
import { Card } from "@/components/ui/card/card";
import {
  DataTable,
  type ColumnDefinition,
} from "@/components/ui/data-table/data-table";
import { FilterGroup } from "@/components/ui/filter-group/filter-group";
import { Select } from "@/components/ui/select/select";
import { Button } from "@/components/ui/button/button";
import { useFilter } from "@/hooks/use-filter";

type RawOperator = (typeof dashboardData)["operadores"][number];

interface OperatorRow {
  id: number;
  nome: string;
  empresa: string;
  totalProduzido: number;
  totalEsperado: number;
  totalHoras: number;
  proficiencia: number;
  eficiencia: number;
}

const formatNumber = (value: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1,
    ...options,
  }).format(value);

const formatPercent = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);

const sanitizeOperator = (
  operator: RawOperator,
  index: number
): OperatorRow => {
  const eficiencia =
    operator.totalEsperado && operator.totalEsperado > 0
      ? (operator.totalProduzido / operator.totalEsperado) * 100
      : 0;

  return {
    id: index + 1,
    nome: operator.nome.trim(),
    empresa: operator.empresa?.trim() ?? "—",
    totalProduzido: operator.totalProduzido ?? 0,
    totalEsperado: operator.totalEsperado ?? 0,
    totalHoras: operator.totalHoras ?? 0,
    proficiencia: operator.proficiencia ?? 0,
    eficiencia,
  };
};

const operatorColumns: ColumnDefinition<OperatorRow>[] = [
  {
    key: "nome",
    header: "Operador",
    render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{row.nome}</span>
        <span className="text-xs text-gray-500">{row.empresa}</span>
      </div>
    ),
  },
  {
    key: "totalProduzido",
    header: "Produzido",
    render: (row) =>
      `${formatNumber(row.totalProduzido, { maximumFractionDigits: 0 })} peças`,
  },
  {
    key: "totalEsperado",
    header: "Esperado",
    render: (row) =>
      `${formatNumber(row.totalEsperado, { maximumFractionDigits: 0 })} peças`,
  },
  {
    key: "totalHoras",
    header: "Horas",
    render: (row) =>
      `${formatNumber(row.totalHoras, { maximumFractionDigits: 1 })} h`,
  },
  {
    key: "proficiencia",
    header: "Proficiência",
    render: (row) => formatPercent(row.proficiencia),
    sortable: true,
    sortAccessor: (row) => row.proficiencia,
  },
  {
    key: "eficiencia",
    header: "Eficiência",
    render: (row) => formatPercent(row.eficiencia),
    sortable: true,
    sortAccessor: (row) => row.eficiencia,
  },
];

const App: React.FC = () => {
  const operators = React.useMemo(
    () => dashboardData.operadores.map(sanitizeOperator),
    []
  );

  const empresas = React.useMemo(() => {
    const unique = new Set<string>();
    operators.forEach((operator) => {
      if (operator.empresa) {
        unique.add(operator.empresa);
      }
    });

    return ["Todas", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [operators]);

  const { filters, setFilter, resetFilters } = useFilter({
    empresa: "Todas",
  });

  const filteredOperators = React.useMemo(() => {
    if (filters.empresa === "Todas") {
      return operators;
    }
    return operators.filter((operator) => operator.empresa === filters.empresa);
  }, [operators, filters]);

  const topOperators = React.useMemo(
    () =>
      [...filteredOperators]
        .sort((a, b) => b.proficiencia - a.proficiencia)
        .slice(0, 5),
    [filteredOperators]
  );

  const gridItems = React.useMemo<DashboardGridItem[]>(() => {
    const highlight = dashboardData.kpis.funcionarioDestaque;
    const highlightDelta = highlight?.proficiencia
      ? highlight.proficiencia - 100
      : 0;
    const avgDelta = dashboardData.kpis.proficienciaMedia - 100;

    return [
      {
        id: "kpi-total",
        element: (
          <KpiCard
            title="Total Inspecionado"
            value={formatNumber(dashboardData.kpis.totalInspecionado, {
              maximumFractionDigits: 0,
            })}
            tooltipText="Quantidade total de peças inspecionadas no período selecionado."
            variant="success"
          />
        ),
        layout: { x: 0, y: 0, w: 4, h: 4 },
      },
      {
        id: "kpi-proficiencia",
        element: (
          <KpiCard
            title="Proficiência Média"
            value={formatPercent(dashboardData.kpis.proficienciaMedia)}
            tooltipText="Proficiência média do time no período."
            changeText={`${avgDelta >= 0 ? "+" : ""}${formatPercent(avgDelta)}`}
            changeType={
              avgDelta > 0 ? "positive" : avgDelta < 0 ? "negative" : "neutral"
            }
            variant="warning"
          />
        ),
        layout: { x: 4, y: 0, w: 4, h: 4 },
      },
      {
        id: "kpi-destaque",
        element: (
          <KpiCard
            title="Funcionário Destaque"
            value={highlight?.nome?.trim() ?? "—"}
            tooltipText="Operador com melhor desempenho em proficiência no período."
            changeText={
              highlight?.proficiencia
                ? `Proficiência atual: ${formatPercent(highlight.proficiencia)}`
                : undefined
            }
            changeType={
              highlightDelta > 0
                ? "positive"
                : highlightDelta < 0
                ? "negative"
                : "neutral"
            }
            variant="success"
          />
        ),
        layout: { x: 8, y: 0, w: 4, h: 4 },
      },
      {
        id: "ranking-proficiencia",
        element: (
          <Card className="h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Top 5 por Proficiência
            </h3>
            <ol className="space-y-3">
              {topOperators.map((operator, index) => (
                <li
                  key={operator.id}
                  className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {index + 1}. {operator.nome}
                    </p>
                    <p className="text-xs text-gray-500">{operator.empresa}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">
                    {formatPercent(operator.proficiencia)}
                  </span>
                </li>
              ))}
              {topOperators.length === 0 && (
                <li className="text-sm text-gray-500">
                  Nenhum operador encontrado para os filtros atuais.
                </li>
              )}
            </ol>
          </Card>
        ),
        layout: { x: 0, y: 4, w: 4, h: 10 },
      },
      {
        id: "tabela-operadores",
        element: (
          <DataTable<OperatorRow>
            title="Operadores"
            columns={operatorColumns}
            data={filteredOperators}
            searchableColumns={["nome", "empresa"]}
            searchPlaceholder="Buscar operadores..."
            pageSize={10}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        ),
        layout: { x: 4, y: 4, w: 8, h: 16 },
      },
    ];
  }, [filteredOperators, topOperators]);

  return (
    <DashboardLayout
      headerProps={{
        title: "Dashboard Geral",
        infoTooltipText: "Exemplo interativo utilizando dados amostrados.",
        enableCustomizationToggle: true,
        filtersSlot: (
          <div className="flex flex-1 flex-wrap items-end gap-3">
            <FilterGroup
              label="Empresa"
              tooltipText="Selecione uma empresa para filtrar os operadores."
              width="w-full md:w-64"
            >
              <Select
                options={empresas.map((empresa) => ({
                  value: empresa,
                  label: empresa === "Todas" ? "Todas as empresas" : empresa,
                }))}
                value={filters.empresa}
                onValueChange={(value) => setFilter("empresa", value)}
                clearable={false}
                compact
                inputSize="sm"
              />
            </FilterGroup>
            <Button
              variant="outline"
              text="Limpar filtros"
              onClick={() => resetFilters()}
              className="self-start"
            />
          </div>
        ),
      }}
    >
      <div className="mx-auto flex w-full flex-col gap-6 p-6">
        <CustomizableGrid
          gridId="dashboard-exemplo"
          storageKey="example-dashboard-layout"
          items={gridItems}
          rowHeight={72}
          margin={[16, 16]}
          containerPadding={[0, 16]}
        />
      </div>
    </DashboardLayout>
  );
};

export default App;
