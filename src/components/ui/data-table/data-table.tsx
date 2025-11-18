/*
 * file: data-table.tsx
 * description: A reusable and responsive data table component.
 */

import React, { useEffect, useId, useMemo, useState } from "react";
import { cn } from "@/utils/use-cn";
import { Button } from "../button/button";
import { Select } from "../select/select";
import {
  FaFileExcel,
  FaMagnifyingGlass,
  FaChevronUp,
  FaChevronDown,
  FaArrowsUpDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { exportToExcel } from "@/utils/use-export-to-excel";

/**
 * Defines the structure for a column in the data table.
 * 'key' is the accessor in the data object.
 * 'header' is the text for the <th>.
 * 'render' is an optional custom render function for the cell.
 */
export interface ColumnDefinition<T> {
  key: keyof T | (string & {});
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  sortAccessor?: (
    item: T
  ) => string | number | Date | boolean | null | undefined;
  searchAccessor?: (
    item: T
  ) => string | number | Date | boolean | null | undefined;
}

interface DataTableProps<T> {
  title: string;
  columns: ColumnDefinition<T>[];
  data: T[];
  filterSlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
  onRowClick?: (item: T) => void;
  searchableColumns?: Array<keyof T | (string & {})>;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  pageSize?: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  pageSizeOptions?: number[];
  manualPagination?: boolean;
  totalItems?: number;
  externalPage?: number;
  loading?: boolean;
}

/**
 * A generic data table component with a header, filters, and actions.
 * Replaces the .table-container and .data-table logic.
 */
export const DataTable = <T extends { id: string | number }>({
  title,
  columns,
  data,
  filterSlot,
  actionSlot,
  onRowClick,
  searchableColumns,
  searchPlaceholder = "Buscar por termo...",
  onSearchChange,
  pageSize = 10,
  initialPage = 0,
  onPageChange,
  pageSizeOptions = [5, 10, 20, 50],
  manualPagination = false,
  totalItems: totalItemsProp,
  externalPage,
}: DataTableProps<T>) => {
  type SortDirection = "asc" | "desc";

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
    accessor?: (item: T) => string | number | Date | boolean | null | undefined;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSizeState, setPageSizeState] = useState(Math.max(1, pageSize));
  const [currentPage, setCurrentPage] = useState(initialPage);
  const effectivePageSize = pageSizeState;
  const searchInputId = useId();

  useEffect(() => {
    setPageSizeState(Math.max(1, pageSize));
  }, [pageSize]);

  const handleSort = (column: ColumnDefinition<T>) => {
    if (column.sortable === false) {
      return;
    }

    setSortConfig((prev) => {
      const key = String(column.key);
      if (prev && prev.key === key) {
        const nextDirection: SortDirection =
          prev.direction === "asc" ? "desc" : "asc";
        return { key, direction: nextDirection, accessor: column.sortAccessor };
      }

      return { key, direction: "asc", accessor: column.sortAccessor };
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearchChange?.(value);
  };

  useEffect(() => {
    setCurrentPage((prev) => {
      if (prev === 0) {
        return prev;
      }
      onPageChange?.(0);
      return 0;
    });
  }, [searchTerm, data.length, onPageChange]);

  useEffect(() => {
    setCurrentPage(initialPage);
    onPageChange?.(initialPage);
  }, [initialPage, onPageChange]);

  useEffect(() => {
    if (externalPage !== undefined) {
      setCurrentPage(externalPage);
    }
  }, [externalPage]);

  const columnsToSearch = useMemo(() => {
    if (searchableColumns && searchableColumns.length > 0) {
      return searchableColumns.map((col) => String(col));
    }
    return columns
      .filter((column) => column.searchable !== false)
      .map((col) => String(col.key));
  }, [columns, searchableColumns]);

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return data;
    }

    return data.filter((item) =>
      columns.some((column) => {
        const columnKey = String(column.key);
        if (!columnsToSearch.includes(columnKey)) {
          return false;
        }

        const value = column.searchAccessor
          ? column.searchAccessor(item)
          : (item as Record<string, unknown>)[columnKey];

        if (value == null) {
          return false;
        }

        if (value instanceof Date) {
          return value.toISOString().toLowerCase().includes(term);
        }

        return String(value).toLowerCase().includes(term);
      })
    );
  }, [columns, columnsToSearch, data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig) {
      return filteredData;
    }

    const { key, direction, accessor } = sortConfig;

    const getValue = (item: T) => {
      const rawValue = accessor
        ? accessor(item)
        : (item as Record<string, unknown>)[key];
      if (rawValue instanceof Date) {
        return rawValue.getTime();
      }
      if (typeof rawValue === "boolean") {
        return rawValue ? 1 : 0;
      }
      return rawValue ?? "";
    };

    const compare = (a: T, b: T) => {
      const valueA = getValue(a);
      const valueB = getValue(b);

      if (typeof valueA === "number" && typeof valueB === "number") {
        return direction === "asc" ? valueA - valueB : valueB - valueA;
      }

      const valueAStr = String(valueA).toLocaleLowerCase();
      const valueBStr = String(valueB).toLocaleLowerCase();

      return direction === "asc"
        ? valueAStr.localeCompare(valueBStr, undefined, { numeric: true })
        : valueBStr.localeCompare(valueAStr, undefined, { numeric: true });
    };

    return [...filteredData].sort(compare);
  }, [filteredData, sortConfig]);

  const totalItems = manualPagination
    ? totalItemsProp ?? sortedData.length
    : sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));

  useEffect(() => {
    setCurrentPage((prev) => {
      const clamped = Math.min(prev, totalPages - 1);
      if (clamped !== prev) {
        onPageChange?.(clamped);
      }
      return clamped;
    });
  }, [totalPages, onPageChange]);

  const paginatedData = useMemo(() => {
    if (manualPagination) {
      return sortedData;
    }
    const start = currentPage * effectivePageSize;
    return sortedData.slice(start, start + effectivePageSize);
  }, [sortedData, currentPage, effectivePageSize, manualPagination]);

  const startItem = totalItems === 0 ? 0 : currentPage * effectivePageSize + 1;
  const endItem = Math.min((currentPage + 1) * effectivePageSize, totalItems);

  const handleChangePage = (nextPage: number) => {
    const clamped = Math.max(0, Math.min(nextPage, totalPages - 1));
    setCurrentPage(clamped);
    onPageChange?.(clamped);
  };

  const pageSizeSelectOptions = useMemo(
    () =>
      pageSizeOptions
        .filter((size) => size > 0)
        .map((size) => ({
          value: String(size),
          label: `${size} por página`,
        })),
    [pageSizeOptions]
  );

  const handlePageSizeChange = (value: string) => {
    const newSize = Math.max(1, Number(value));
    setPageSizeState(newSize);
    setCurrentPage(0);
    onPageChange?.(0);
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      )}
    >
      {/* Table Header */}
      <div
        className={cn(
          "p-5 border-b border-gray-200 bg-gray-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        )}
      >
        <h3 className={cn("text-lg font-semibold text-gray-900")}>{title}</h3>
        <div className={cn("flex flex-wrap items-center gap-3 md:justify-end")}>
          {columnsToSearch.length > 0 && (
            <div className="relative max-w-sm">
              <label htmlFor={searchInputId} className="sr-only">
                {searchPlaceholder}
              </label>
              <FaMagnifyingGlass
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <input
                id={searchInputId}
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-700  transition focus:border-gray-400 focus:outline-none "
              />
            </div>
          )}
          {filterSlot && <div>{filterSlot}</div>}
          {actionSlot && <div>{actionSlot}</div>}
          <Button
            icon={<FaFileExcel className="h-4 w-4 text-green-700" />}
            text="Exportar Excel"
            variant="outline"
            className="text-gray-600"
            onClick={() => exportToExcel(sortedData, title)}
          />
        </div>
      </div>

      {/* Table Wrapper (for overflow) */}
      <div className={cn("overflow-x-auto")}>
        <table className={cn("w-full border-collapse")}>
          {/* Table Head */}
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "bg-gray-50 p-0 text-left text-xs font-semibold text-gray-700 border-b border-gray-200 uppercase tracking-wider"
                  )}
                  aria-sort={
                    sortConfig && sortConfig.key === String(col.key)
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    type="button"
                    onClick={() => handleSort(col)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors",
                      col.sortable === false
                        ? "cursor-default"
                        : "hover:bg-gray-100"
                    )}
                    disabled={col.sortable === false}
                  >
                    <span>{col.header}</span>
                    {col.sortable === false ? null : (
                      <>
                        {sortConfig && sortConfig.key === String(col.key) ? (
                          sortConfig.direction === "asc" ? (
                            <FaChevronUp
                              className="h-4 w-4 text-gray-500"
                              aria-hidden
                            />
                          ) : (
                            <FaChevronDown
                              className="h-4 w-4 text-gray-500"
                              aria-hidden
                            />
                          )
                        ) : (
                          <FaArrowsUpDown
                            className="h-4 w-4 text-gray-400"
                            aria-hidden
                          />
                        )}
                      </>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={cn("divide-y divide-gray-100")}>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick && onRowClick(item)}
                className={cn(
                  "transition-colors",
                  onRowClick && "hover:bg-gray-50 cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={`${item.id}-${String(col.key)}`}
                    className={cn(
                      "p-4 text-sm text-gray-700 whitespace-nowrap"
                    )}
                  >
                    {col.render
                      ? col.render(item)
                      : (item[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className={cn("p-10 text-center text-gray-500")}>
            <i
              className={cn("fas fa-box-open text-4xl mb-4 text-gray-300")}
            ></i>
            <p>Nenhum dado encontrado.</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-200 bg-white px-5 py-4 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
        <span>
          Mostrando {startItem} – {endItem} de {totalItems}
        </span>
        {pageSizeSelectOptions.length > 0 && (
          <Select
            options={pageSizeSelectOptions}
            value={String(effectivePageSize)}
            onValueChange={handlePageSizeChange}
            clearable={false}
            disabled={pageSizeSelectOptions.length <= 1}
            className="w-38"
            aria-label="Itens por página"
          />
        )}
        <div className="flex items-center gap-2">
          <Button
            text="Anterior"
            variant="outline"
            icon={<FaChevronLeft className="h-3 w-3" />}
            onClick={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 0}
            className="text-gray-600"
          />
          <span className="font-medium">
            Página {totalItems === 0 ? 0 : currentPage + 1} de {totalPages}
          </span>
          <Button
            text="Próxima"
            variant="outline"
            icon={<FaChevronRight className="h-3 w-3" />}
            onClick={() => handleChangePage(currentPage + 1)}
            disabled={currentPage >= totalPages - 1 || totalItems === 0}
            className="text-gray-600"
          />
        </div>
      </div>
    </div>
  );
};
