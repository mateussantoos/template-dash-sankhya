import { useEffect, useMemo } from "react";
import { KpiCard } from "@/components/ui/kpi-card/kpi-card";
import { AreaChartCard } from "@/components/charts/area-chart/area-chart";
import { ColumnChart } from "@/components/charts/column-chart/column-chart";
import { DataTable } from "@/components/ui/data-table/data-table";
import { FilterGroup } from "@/components/ui/filter-group/filter-group";
import { useDashboardLayoutContext } from "@/contexts/dashboard-layout-context";
import { useFilter } from "@/hooks/use-filter";
import data from "@/app/data.json";
import { formatDate } from "@/utils/use-format-date";

type HomeFilters = {
  categoria: string;
  vendedor: string;
};

export const Home = () => {
  const { setFiltersSlot, setHeaderProps } = useDashboardLayoutContext();
  const { filters, setFilter } = useFilter<HomeFilters>({
    categoria: "Todos",
    vendedor: "Todos",
  });

  const categories = useMemo(() => {
    const unique = new Set<string>();
    data.forEach((item) => unique.add(item.categoria));
    return ["Todos", ...Array.from(unique)];
  }, []);

  const sellers = useMemo(() => {
    const unique = new Set<string>();
    data.forEach((item) => unique.add(item.vendedor));
    return ["Todos", ...Array.from(unique)];
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const categoryOk =
        filters.categoria === "Todos" || item.categoria === filters.categoria;
      const sellerOk =
        filters.vendedor === "Todos" || item.vendedor === filters.vendedor;
      return categoryOk && sellerOk;
    });
  }, [filters]);

  const filterSlot = useMemo(
    () => (
      <div className="flex flex-wrap gap-4 w-full">
        <FilterGroup label="Categoria">
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none"
            value={filters.categoria}
            onChange={(event) => setFilter("categoria", event.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </FilterGroup>
        <FilterGroup label="Vendedor">
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none"
            value={filters.vendedor}
            onChange={(event) => setFilter("vendedor", event.target.value)}
          >
            {sellers.map((seller) => (
              <option key={seller} value={seller}>
                {seller}
              </option>
            ))}
          </select>
        </FilterGroup>
      </div>
    ),
    [categories, filters, sellers, setFilter]
  );

  useEffect(() => {
    setHeaderProps({ title: "Home" });
  }, [setHeaderProps]);

  useEffect(() => {
    setFiltersSlot(filterSlot);
    return () => setFiltersSlot(null);
  }, [filterSlot, setFiltersSlot]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 lg:grid-cols-4 md:grid-cols-2 gap-4 ">
        <KpiCard
          title="Total de Eletrônicos"
          value={filteredData
            .filter((item) => item.categoria === "Eletrônicos")
            .reduce((acc, item) => acc + item.total, 0)
            .toString()}
          iconName="fa-solid fa-money-bill"
        />
        <KpiCard
          title="Total de Roupas"
          value={filteredData
            .filter((item) => item.categoria === "Roupas")
            .reduce((acc, item) => acc + item.total, 0)
            .toString()}
          iconName="fa-solid fa-money-bill"
        />
        <KpiCard
          title="Total de Livros"
          value={filteredData
            .filter((item) => item.categoria === "Livros")
            .reduce((acc, item) => acc + item.total, 0)
            .toString()}
          iconName="fa-solid fa-money-bill"
        />
        <KpiCard
          title="Total de Todos os Produtos"
          value={filteredData
            .reduce((acc, item) => acc + item.total, 0)
            .toString()}
          iconName="fa-solid fa-money-bill"
        />
      </div>
      <div className="flex flex-row gap-4">
        <AreaChartCard
          title="Vendas por Categoria"
          data={filteredData.filter((item) => item.categoria !== "Todos")}
          dataKey="total"
          categoryKey="categoria"
          className="w-2/3"
        />
        <ColumnChart
          title="Vendas por Vendedor"
          data={filteredData.filter((item) => item.vendedor !== "Todos")}
          dataKey="total"
          categoryKey="vendedor"
          className="w-1/3"
        />
      </div>
      <div className="flex  gap-4">
        <DataTable
          title="Total de vendas"
          data={filteredData.map((item, index) => ({ ...item, id: index }))}
          columns={[
            {
              key: "data",
              header: "Data",
              render: (item: { data: string }) => formatDate(item.data),
            },
            {
              key: "produto",
              header: "Produto",
            },
            {
              key: "vendedor",
              header: "Vendedor",
            },
            {
              key: "categoria",
              header: "Categoria",
            },
            {
              key: "total",
              header: "Total",
            },
          ]}
        />
      </div>
    </div>
  );
};
