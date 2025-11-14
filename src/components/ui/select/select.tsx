import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/use-cn"; // Ajuste para seu import de cn
import { FaChevronDown, FaChevronUp, FaXmark } from "react-icons/fa6";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange"
  > {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  helperText?: string;
  error?: string;
  clearable?: boolean;
  listClassName?: string;
  compact?: boolean;
  inputSize?: "sm" | "md" | "lg";
  inputClassName?: string;
}

// Hook para gerenciar posicionamento do Portal
const useDropdownPosition = (
  isOpen: boolean,
  triggerRef: React.RefObject<HTMLElement | null>
) => {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    placement: "bottom" as "top" | "bottom",
    maxHeight: 250,
  });

  const updatePosition = useCallback(() => {
    if (!isOpen || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Configurações desejadas
    const margin = 4; // Espaço entre input e menu
    const desiredHeight = 250; // Altura máxima desejada do menu
    const minSpaceForBottom = 150; // Espaço mínimo para forçar abrir embaixo

    // Lógica de decisão de posicionamento (Auto-flip)
    let placement: "top" | "bottom" = "bottom";
    let calculatedMaxHeight = desiredHeight;

    if (
      spaceBelow < desiredHeight &&
      spaceAbove > spaceBelow &&
      spaceBelow < minSpaceForBottom
    ) {
      placement = "top";
      // Se abrir pra cima, limitamos a altura ao espaço disponível acima (menos margem)
      calculatedMaxHeight = Math.min(desiredHeight, spaceAbove - margin - 10);
    } else {
      placement = "bottom";
      // Se abrir pra baixo, limitamos a altura ao espaço disponível abaixo
      calculatedMaxHeight = Math.min(desiredHeight, spaceBelow - margin - 10);
    }

    setPosition({
      left: rect.left + window.scrollX,
      width: rect.width,
      placement,
      maxHeight: calculatedMaxHeight,
      // Se for bottom: topo do menu = base do input + scrollY + margem
      // Se for top: topo do menu = topo do input + scrollY - alturaMenu (mas calculamos via CSS transform ou bottom no render)
      top:
        placement === "bottom"
          ? rect.bottom + window.scrollY + margin
          : rect.top + window.scrollY - margin,
    });
  }, [isOpen, triggerRef]);

  // useLayoutEffect evita "piscar" antes de posicionar corretamente
  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, { passive: true });
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  return position;
};

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      label,
      helperText,
      error,
      placeholder = "Selecionar...",
      disabled,
      className,
      inputClassName,
      listClassName,
      clearable = true,
      compact = false,
      inputSize = "md",
      id,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const listboxId = `${inputId}-listbox`;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = error ? errorId : helperId;

    // State Logic
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<string>(
      defaultValue ?? value ?? ""
    );
    const currentValue = isControlled ? value ?? "" : internalValue;

    const selectedOption = useMemo(
      () => options.find((option) => String(option.value) === currentValue),
      [options, currentValue]
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    // Refs
    const containerRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<Array<HTMLLIElement | null>>([]);
    const dropdownRef = useRef<HTMLUListElement | null>(null);

    // Hook de Posicionamento (Portal)
    const { top, left, width, placement, maxHeight } = useDropdownPosition(
      isOpen,
      containerRef
    );

    // Reset states on close
    useEffect(() => {
      if (!isOpen) {
        setHighlightedIndex(-1);
        setSearchTerm("");
      }
    }, [isOpen]);

    // Filter Options
    const filteredOptions = useMemo(() => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      if (!normalizedSearch) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(normalizedSearch)
      );
    }, [options, searchTerm]);

    // Auto-highlight logic
    useEffect(() => {
      if (!isOpen) return;
      if (filteredOptions.length === 0) {
        setHighlightedIndex(-1);
        return;
      }
      const selectedIndex = filteredOptions.findIndex(
        (option) => String(option.value) === currentValue
      );
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }, [isOpen, filteredOptions, currentValue]);

    // Scroll active option into view
    useEffect(() => {
      if (!isOpen || highlightedIndex < 0) return;
      const element = listRef.current[highlightedIndex];
      element?.scrollIntoView({ block: "nearest" });
    }, [highlightedIndex, isOpen]);

    const closeList = useCallback(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
      setSearchTerm("");
    }, []);

    // Click Outside Logic (Updated for Portal)
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        // Verifica se clicou no container do input OU no dropdown (que está no portal)
        if (
          containerRef.current &&
          !containerRef.current.contains(target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(target)
        ) {
          closeList();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [closeList, isOpen]); // isOpen dependency helps avoiding attaching unnecessary listeners

    const commitValue = useCallback(
      (option: SelectOption) => {
        if (option.disabled) return;
        if (!isControlled) setInternalValue(String(option.value));
        onValueChange?.(String(option.value));
        closeList();
      },
      [closeList, isControlled, onValueChange]
    );

    // Handlers
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      if (!isOpen) setIsOpen(true);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isControlled) setInternalValue("");
      setSearchTerm("");
      onValueChange?.("");
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        setHighlightedIndex((prev) =>
          prev + 1 >= filteredOptions.length ? 0 : prev + 1
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        setHighlightedIndex((prev) =>
          prev - 1 < 0 ? filteredOptions.length - 1 : prev - 1
        );
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (!isOpen) setIsOpen(true);
        else if (highlightedIndex >= 0)
          commitValue(filteredOptions[highlightedIndex]);
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeList();
      }
    };

    const displayValue = isOpen ? searchTerm : selectedOption?.label ?? "";
    const hasClearButton =
      clearable && (currentValue || searchTerm) && !disabled;

    // Styles
    const sizeClasses = {
      sm: "h-8 text-xs py-1",
      md: "h-10 text-sm py-2",
      lg: "h-12 text-base py-3",
    };
    const currentSizeClass = compact
      ? sizeClasses.sm
      : sizeClasses[inputSize] || sizeClasses.md;
    const paddingRightClass = hasClearButton ? "pr-14" : "pr-8";

    // Portal Content
    const dropdownContent = (
      <div
        ref={dropdownRef as any} // as any para simplificar tipagem do Portal ref
        style={{
          position: "absolute", // Absolute relative to document (via Portal + Top/Left)
          top: placement === "bottom" ? top : "auto",
          bottom: placement === "top" ? window.innerHeight - top : "auto", // Ajuste para crescer para cima
          left: left,
          width: width,
          maxHeight: maxHeight,
          zIndex: 9999,
        }}
        className="flex flex-col"
      >
        {filteredOptions.length > 0 ? (
          <ul
            id={listboxId}
            role="listbox"
            className={cn(
              "w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-xl focus:outline-none",
              // Animaçãozinha suave opcional
              placement === "bottom" ? "origin-top" : "origin-bottom",
              listClassName
            )}
            style={{ maxHeight }}
          >
            {(listRef.current = [])}
            {filteredOptions.map((option, index) => {
              const isSelected =
                String(option.value) === String(selectedOption?.value);
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  id={`${inputId}-option-${index}`}
                  key={String(option.value)}
                  role="option"
                  aria-selected={isSelected}
                  ref={(element) => {
                    listRef.current[index] = element;
                  }}
                  className={cn(
                    "relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm transition",
                    isHighlighted
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700",
                    isSelected && "bg-gray-200 font-medium",
                    option.disabled && "cursor-not-allowed opacity-50"
                  )}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commitValue(option)}
                >
                  <span className="block truncate">{option.label}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div
            className={cn(
              "w-full rounded-md border border-gray-200 bg-white py-3 text-center text-sm text-gray-500 shadow-xl",
              listClassName
            )}
          >
            Nenhuma opção encontrada
          </div>
        )}
      </div>
    );

    return (
      <>
        <div
          ref={containerRef}
          className={cn("relative flex w-full flex-col gap-1", className)}
          data-slot="select"
        >
          {label && (
            <label
              htmlFor={inputId}
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              {label}
            </label>
          )}

          <div className="relative w-full">
            <input
              id={inputId}
              ref={ref}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls={listboxId}
              aria-describedby={describedBy}
              value={displayValue}
              placeholder={placeholder}
              disabled={disabled}
              onChange={handleInputChange}
              onFocus={() => {
                setIsOpen(true);
                setSearchTerm("");
              }}
              onKeyDown={handleKeyDown}
              className={cn(
                "w-full rounded-md border border-gray-300 bg-white text-gray-900 transition",
                "focus:border-gray-400 focus:outline-none ",
                "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400",
                "pl-3 truncate",
                currentSizeClass,
                paddingRightClass,
                error &&
                  "border-red-400 text-red-600 focus:border-red-500 focus:ring-red-200",
                inputClassName
              )}
              {...rest}
            />

            {/* Icons Wrapper */}
            <div className="absolute right-0 top-0 bottom-0 flex items-center px-2 pointer-events-none">
              {hasClearButton && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="pointer-events-auto mr-1 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                >
                  <FaXmark className="h-3 w-3" />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                disabled={disabled}
                className="pointer-events-auto flex h-5 w-5 items-center justify-center text-gray-400 hover:text-gray-600"
              >
                {isOpen ? (
                  <FaChevronUp className="h-3 w-3" />
                ) : (
                  <FaChevronDown className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>

          {/* Error / Helper */}
          {(helperText || error) && (
            <p
              id={error ? errorId : helperId}
              className={cn(
                "text-xs",
                error ? "text-red-500" : "text-gray-500"
              )}
            >
              {error || helperText}
            </p>
          )}
        </div>

        {/* Renderização do Dropdown no Body via Portal */}
        {isOpen && createPortal(dropdownContent, document.body)}
      </>
    );
  }
);

Select.displayName = "Select";
