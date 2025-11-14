import * as React from "react";

type PrimitiveFilterValue = string | number | boolean | Date | null | undefined;

export type FilterValue = PrimitiveFilterValue | PrimitiveFilterValue[];

export type FilterRecord = Record<string, FilterValue>;

export interface UseFilterOptions<T extends FilterRecord> {
  /**
   * Callback executado sempre que os filtros são atualizados.
   */
  onChange?: (filters: T) => void;
}

export interface UseFilterReturn<T extends FilterRecord> {
  /**
   * Estado atual dos filtros.
   */
  filters: T;
  /**
   * Setter direto para o estado dos filtros.
   */
  setFilters: React.Dispatch<React.SetStateAction<T>>;
  /**
   * Atualiza diversos filtros de uma vez.
   */
  updateFilters: (changes: Partial<T> | ((prev: T) => Partial<T>)) => void;
  /**
   * Atualiza um filtro específico.
   */
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  /**
   * Remove um filtro (retorna ao valor inicial).
   */
  removeFilter: <K extends keyof T>(key: K) => void;
  /**
   * Reseta um filtro específico ou todos os filtros.
   */
  resetFilters: (key?: keyof T) => void;
  /**
   * Limpa todos os filtros retornando ao estado inicial.
   */
  clearFilters: () => void;
  /**
   * Indica se existe algum filtro diferente do estado inicial.
   */
  hasFilters: boolean;
}

function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

function isPrimitiveArray(value: FilterValue): value is PrimitiveFilterValue[] {
  return Array.isArray(value);
}

function isSameValue(current: FilterValue, initial: FilterValue): boolean {
  if (isPrimitiveArray(current) && isPrimitiveArray(initial)) {
    if (current.length !== initial.length) {
      return false;
    }
    return current.every((item, index) => {
      const initialItem = initial[index];
      if (isDate(item) && isDate(initialItem)) {
        return item.getTime() === initialItem.getTime();
      }
      return item === initialItem;
    });
  }

  if (isDate(current) && isDate(initial)) {
    return current.getTime() === initial.getTime();
  }

  return current === initial;
}

function shallowEqualFilters<T extends FilterRecord>(a: T, b: T): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

  for (const key of keys) {
    const typedKey = key as keyof T;
    if (!isSameValue(a[typedKey] as FilterValue, b[typedKey] as FilterValue)) {
      return false;
    }
  }

  return true;
}

export function useFilter<T extends FilterRecord>(
  initialFilters: T,
  options: UseFilterOptions<T> = {}
): UseFilterReturn<T> {
  const initialRef = React.useRef<T>({ ...initialFilters });
  const optionsRef = React.useRef(options);

  optionsRef.current = options;

  const [filters, setFilters] = React.useState<T>(() => ({
    ...initialFilters,
  }));

  React.useEffect(() => {
    if (!shallowEqualFilters(initialFilters, initialRef.current)) {
      initialRef.current = { ...initialFilters };
      setFilters({ ...initialFilters });
    }
  }, [initialFilters]);

  const updateFilters = React.useCallback<UseFilterReturn<T>["updateFilters"]>(
    (changes) => {
      setFilters((prev) => {
        const partial = typeof changes === "function" ? changes(prev) : changes;
        return { ...prev, ...partial };
      });
    },
    []
  );

  const setFilter = React.useCallback<UseFilterReturn<T>["setFilter"]>(
    (key, value) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const removeFilter = React.useCallback<UseFilterReturn<T>["removeFilter"]>(
    (key) => {
      setFilters((prev) => ({
        ...prev,
        [key]: initialRef.current[key],
      }));
    },
    []
  );

  const resetFilters = React.useCallback<UseFilterReturn<T>["resetFilters"]>(
    (key) => {
      if (key) {
        setFilters((prev) => ({
          ...prev,
          [key]: initialRef.current[key],
        }));
        return;
      }
      setFilters({ ...initialRef.current });
    },
    []
  );

  const clearFilters = React.useCallback<
    UseFilterReturn<T>["clearFilters"]
  >(() => {
    setFilters({ ...initialRef.current });
  }, []);

  const hasFilters = React.useMemo(() => {
    return !shallowEqualFilters(filters, initialRef.current);
  }, [filters]);

  React.useEffect(() => {
    optionsRef.current.onChange?.(filters);
  }, [filters]);

  return {
    filters,
    setFilters,
    updateFilters,
    setFilter,
    removeFilter,
    resetFilters,
    clearFilters,
    hasFilters,
  };
}
