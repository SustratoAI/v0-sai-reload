"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/theme-provider";
import { generateSelectTokens } from "@/lib/theme/components/select-tokens";
import type {
  SelectSize,
  SelectVariant,
} from "@/lib/theme/components/select-tokens";
import type { AppColorTokens, Mode } from "@/lib/theme/ColorToken";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ComponentType<any>;
}

export interface SelectCustomProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  options: SelectOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  variant?: SelectVariant;
  size?: SelectSize;
  error?: string;
  hint?: string;
  label?: string;
  placeholder?: string;
  leadingIcon?: React.ComponentType<any>;
  trailingIcon?: React.ReactNode;
  clearable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  fullWidth?: boolean;
  isEditing?: boolean;
  success?: boolean;
  successMessage?: string;
  autoFocus?: boolean;
}

const SelectCustom = React.forwardRef<HTMLDivElement, SelectCustomProps>(
  (
    {
      options,
      className,
      variant = "default",
      size = "md",
      error,
      hint,
      label,
      placeholder = "Seleccione una opción",
      leadingIcon,
      trailingIcon,
      clearable = false,
      multiple = false,
      onChange,
      value,
      defaultValue,
      disabled = false,
      required = false,
      name,
      id,
      fullWidth = true,
      isEditing = false,
      success = false,
      successMessage,
      autoFocus = false,
      ...props
    },
    ref
  ) => {
    const {
      appColorTokens,
      mode,
    }: { appColorTokens: AppColorTokens; mode: Mode } = useTheme();
    const selectTokens = generateSelectTokens(appColorTokens, mode);
    const variantTokens = selectTokens.variants[variant];
    const sizeTokens = selectTokens.sizes[size];

    // Obtener el color de fondo del botón del chevron usando el nuevo token
    const chevronBgColor = variantTokens.chevronButtonBackground;
    console.log(`Chevron button background color: ${chevronBgColor}`);

    // Referencias y estados
    const [isOpen, setIsOpen] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [initialRender, setInitialRender] = React.useState(true);
    const [hasMounted, setHasMounted] = React.useState(false);
    const selectRef = React.useRef<HTMLDivElement>(null);
    const optionsRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Inicializa el estado para valores múltiples o único
    const [selectedValues, setSelectedValues] = React.useState<string[]>(() => {
      if (value !== undefined) {
        return Array.isArray(value) ? value : value ? [value] : [];
      }
      if (defaultValue !== undefined) {
        return Array.isArray(defaultValue)
          ? defaultValue
          : defaultValue
          ? [defaultValue]
          : [];
      }
      return [];
    });

    // Sincroniza el estado interno con las props externas
    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValues(Array.isArray(value) ? value : value ? [value] : []);
      }
    }, [value]);

    // Encuentra las opciones seleccionadas para mostrar sus etiquetas
    const selectedOptions = options.filter((option) =>
      selectedValues.includes(option.value)
    );

    console.log("selectedOptions:", selectedOptions);

    // Mapear tamaños de Select a tamaños de Icon
    const mapSelectSizeToIconSize = (selectSize: SelectSize) => {
      switch (selectSize) {
        case "sm":
          return "xs";
        case "lg":
          return "md";
        default:
          return "sm"; // md select -> sm icon
      }
    };

    const iconSize = mapSelectSizeToIconSize(size);

    // Determinar si mostrar un icono y cuál
    const hasSelectedOptionWithIcon =
      !multiple && selectedOptions.length > 0 && !!selectedOptions[0].icon;
    const shouldShowLeadingIcon =
      !hasSelectedOptionWithIcon &&
      selectedValues.length === 0 &&
      !!leadingIcon;

    // No padding si no hay icono
    const getLeadingPadding = () => {
      if (!hasSelectedOptionWithIcon && !shouldShowLeadingIcon) return "";
      switch (size) {
        case "sm":
          return "pl-7";
        case "lg":
          return "pl-12";
        default:
          return "pl-10"; // md
      }
    };

    // Definir el padding derecho basado en el tamaño del select
    const getTrailingPadding = () => {
      if (!hasTrailingIcon) return "";
      switch (size) {
        case "sm":
          return "pr-7";
        case "lg":
          return "pr-12";
        default:
          return "pr-10"; // md
      }
    };

    // Ajustar la posición del icono según el tamaño
    const getIconLeftPosition = () => {
      switch (size) {
        case "sm":
          return "left-2.5";
        case "lg":
          return "left-4";
        default:
          return "left-3"; // md
      }
    };

    // Maneja el clic en una opción
    const handleOptionClick = (optionValue: string) => {
      if (disabled || isEditing) return;

      let newValues: string[];

      if (multiple) {
        // Para selección múltiple, toggle el valor
        newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];
      } else {
        // Para selección única, reemplaza el valor
        newValues = [optionValue];
        setIsOpen(false);
      }

      setSelectedValues(newValues);

      // Notifica el cambio
      if (multiple) {
        onChange?.(newValues);
      } else {
        onChange?.(optionValue);
      }

      // Actualiza el valor del input oculto para integración con formularios
      if (inputRef.current) {
        inputRef.current.value = multiple
          ? newValues.join(",")
          : newValues[0] || "";
        const event = new Event("change", { bubbles: true });
        inputRef.current.dispatchEvent(event);
      }
    };

    // Maneja la limpieza del valor
    const handleClear = (e: React.MouseEvent, valueToRemove?: string) => {
      if (disabled || isEditing) return;

      e.preventDefault();
      e.stopPropagation();

      let newValues: string[];

      if (valueToRemove && multiple) {
        // Elimina solo un valor específico en modo múltiple
        newValues = selectedValues.filter((v) => v !== valueToRemove);
      } else {
        // Limpia todos los valores
        newValues = [];
      }

      setSelectedValues(newValues);

      // Notifica el cambio
      if (multiple) {
        onChange?.(newValues);
      } else {
        onChange?.("");
      }

      // Actualiza el valor del input oculto
      if (inputRef.current) {
        inputRef.current.value = multiple ? newValues.join(",") : "";
        const event = new Event("change", { bubbles: true });
        inputRef.current.dispatchEvent(event);
      }
    };

    // Cierra el dropdown cuando se hace clic fuera
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node) &&
          optionsRef.current &&
          !optionsRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setIsFocused(false); // Asegurarse de quitar el foco cuando se hace clic fuera
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [id, isOpen]);

    // Maneja la navegación con teclado
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled || isEditing) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          setIsOpen(!isOpen);
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (!multiple) {
            // Navegar a la siguiente opción (solo en modo único)
            const currentIndex =
              selectedValues.length > 0
                ? options.findIndex((opt) => opt.value === selectedValues[0])
                : -1;
            const nextIndex = (currentIndex + 1) % options.length;
            const nextOption = options[nextIndex];
            if (nextOption && !nextOption.disabled) {
              handleOptionClick(nextOption.value);
            }
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (!multiple) {
            // Navegar a la opción anterior (solo en modo único)
            const currentIndex =
              selectedValues.length > 0
                ? options.findIndex((opt) => opt.value === selectedValues[0])
                : options.length;
            const prevIndex =
              (currentIndex - 1 + options.length) % options.length;
            const prevOption = options[prevIndex];
            if (prevOption && !prevOption.disabled) {
              handleOptionClick(prevOption.value);
            }
          }
          break;
      }
    };

    // Obtener el color de borde basado en el estado
    const getBorderColor = () => {
      if (disabled) return variantTokens.disabledBorder;
      if (error) return variantTokens.errorBorder;
      if (success) return variantTokens.successBorder;
      if (isFocused || isOpen) return variantTokens.focusBorder;
      return variantTokens.border;
    };

    // Obtener el color de fondo basado en el estado
    const getBackgroundColor = () => {
      if (disabled) return variantTokens.disabledBackground;
      if (error) return variantTokens.errorBackground;
      if (success) return variantTokens.successBackground;
      if (isEditing) return variantTokens.editingBackground;
      return variantTokens.background;
    };

    // Obtener el color del texto basado en el estado
    const getTextColor = () => {
      if (disabled) return variantTokens.disabledText;
      return variantTokens.text;
    };

    // Variantes de animación para el dropdown
    const dropdownVariants = {
      hidden: {
        opacity: 0,
        y: -5,
        scale: 0.98,
        transition: {
          duration: 0.15,
          ease: "easeInOut",
        },
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.2,
          ease: "easeOut",
        },
      },
    };

    // Variantes de animación para las opciones (efecto cascada)
    const optionVariants = {
      hidden: { opacity: 0, y: -5 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.03,
          duration: 0.2,
          ease: "easeOut",
        },
      }),
    };

    const hasTrailingIcon =
      !!trailingIcon ||
      (selectedValues.length > 0 && clearable) ||
      !!error ||
      success;

    // Marcar como montado después del primer render
    React.useEffect(() => {
      setHasMounted(true);
    }, []);

    // Asegurarse de que el componente no comience con foco a menos que se especifique
    React.useEffect(() => {
      if (initialRender && hasMounted) {
        setInitialRender(false);
        if (autoFocus && selectRef.current) {
          selectRef.current.focus();
          setIsFocused(true);
        } else {
          setIsFocused(false);
        }
      }
    }, [autoFocus, id, initialRender, hasMounted]);

    return (
      <div
        className={cn("relative", fullWidth ? "w-full" : "w-auto", className)}
        ref={ref}
        {...props}
      >
        {/* Label */}
        {label && (
          <Text
            variant="label"
            color={
              isFocused
                ? variant === "default"
                  ? "primary"
                  : variant
                : "neutral"
            }
            colorVariant={isFocused ? "pure" : "text"}
            className={cn(
              "mb-1.5",
              required &&
                "after:content-['*'] after:ml-0.5 after:text-destructive",
              error && "text-destructive",
              disabled && "opacity-70"
            )}
          >
            {label}
          </Text>
        )}

        {/* Select container */}
        <div
          ref={selectRef}
          style={{
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            color: getTextColor(),
            boxShadow:
              isFocused || isOpen
                ? `0 0 0 4px ${
                    error
                      ? variantTokens.errorRing
                      : success
                      ? variantTokens.successRing
                      : variantTokens.focusRing
                  }`
                : "0 0 0 1px rgba(176,190,217,0.2), 0 1px 2px rgba(176,190,217,0.2)",
          }}
          className={cn(
            "relative rounded-md border transition-all duration-200",
            "shadow-[0_0_0_1px_rgba(176,190,217,0.2),0_1px_2px_rgba(176,190,217,0.2)]",
            sizeTokens.height,
            sizeTokens.fontSize,
            !hasSelectedOptionWithIcon && !shouldShowLeadingIcon
              ? sizeTokens.paddingX
              : "pr-3",
            sizeTokens.paddingY,
            getLeadingPadding(),
            getTrailingPadding(),
            {
              "cursor-not-allowed": disabled,
              "pointer-events-none": isEditing,
            }
          )}
          tabIndex={disabled || isEditing ? -1 : 0}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={(e) => {
            setIsFocused(false);
          }}
          onClick={() => {
            if (!disabled && !isEditing) {
              setIsOpen(!isOpen);
              setIsFocused(true);
            }
          }}
          onMouseEnter={(e) => {
            if (!disabled && !isEditing) {
              e.currentTarget.style.borderColor = variantTokens.hoverBorder;
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !isEditing && !isFocused && !isOpen) {
              e.currentTarget.style.borderColor = getBorderColor();
            }
          }}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled || isEditing}
          role="combobox"
        >
          {/* Icono principal - solo uno o ninguno */}
          {hasSelectedOptionWithIcon && selectedOptions[0].icon && (
            <div
              className={`absolute ${getIconLeftPosition()} top-0 h-full flex items-center`}
              style={{
                color: disabled
                  ? variantTokens.disabledText
                  : variantTokens.iconColor,
              }}
            >
              <Icon
                size={iconSize}
                color={variant === "default" ? "primary" : variant}
                colorVariant="text"
              >
                {selectedOptions[0].icon &&
                  React.createElement(selectedOptions[0].icon)}
              </Icon>
            </div>
          )}

          {/* Icono por defecto - solo si no hay selección */}
          {shouldShowLeadingIcon && leadingIcon && (
            <div
              className={`absolute ${getIconLeftPosition()} top-0 h-full flex items-center`}
              style={{
                color: disabled
                  ? variantTokens.disabledText
                  : variantTokens.iconColor,
              }}
            >
              <Icon
                size={iconSize}
                color={variant === "default" ? "primary" : variant}
                colorVariant="text"
              >
                {leadingIcon && React.createElement(leadingIcon)}
              </Icon>
            </div>
          )}

          {/* Selected values or placeholder */}
          <div className="flex-1 flex flex-wrap gap-1 items-center">
            {selectedOptions.length > 0 ? (
              multiple ? (
                // Mostrar múltiples valores como chips
                selectedOptions.map((option) => (
                  <div
                    key={option.value}
                    style={{
                      backgroundColor: variantTokens.optionSelectedBackground,
                    }}
                    className="rounded-md px-2 py-0.5 flex items-center gap-1 max-w-[calc(100%-8px)]"
                  >
                    {option.icon && (
                      <span className="flex-shrink-0">
                        <Icon size={iconSize}>
                          {React.createElement(option.icon)}
                        </Icon>
                      </span>
                    )}
                    <span className="truncate">{option.label}</span>
                    {clearable && (
                      <button
                        type="button"
                        onClick={(e) => handleClear(e, option.value)}
                        className="cursor-pointer flex-shrink-0 p-0.5 rounded-full hover:bg-gray-100"
                        aria-label={`Remove ${option.label}`}
                      >
                        <Icon size="xs">{React.createElement(X)}</Icon>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                // Mostrar un solo valor (sin icono aquí, ya que se muestra arriba)
                <div className="flex items-center gap-2 max-w-full">
                  <span className="truncate">{selectedOptions[0].label}</span>
                </div>
              )
            ) : (
              <span style={{ color: variantTokens.placeholder }}>
                {placeholder}
              </span>
            )}
          </div>

          {/* Trailing icons */}
          <div className="absolute right-1 top-0 h-full flex items-center gap-2">
            {/* Clear button */}
            {clearable &&
              selectedValues.length > 0 &&
              !disabled &&
              !isEditing && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-full p-0.5 hover:bg-muted hover:text-foreground transition-colors flex items-center justify-center"
                  aria-label="Limpiar"
                >
                  <Icon size={iconSize}>{React.createElement(X)}</Icon>
                </button>
              )}

            {/* Dropdown icon */}
            <div
              className="flex items-center justify-center"
              style={{
                color: disabled
                  ? variantTokens.disabledText
                  : variantTokens.iconColor,
              }}
            >
              <div
                className="p-1 rounded transition-colors duration-200"
                style={{
                  backgroundColor: chevronBgColor, // Usar el nuevo token para el fondo del botón del chevron
                }}
              >
                <AnimatePresence initial={false} mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="up"
                      initial={{ opacity: 0, rotate: 180, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 180, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon
                        size={iconSize}
                        color={variant === "default" ? "primary" : variant}
                        colorVariant="pure"
                      >
                        {React.createElement(ChevronUp)}
                      </Icon>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="down"
                      initial={{ opacity: 0, rotate: -180, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -180, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon
                        size={iconSize}
                        color={variant === "default" ? "primary" : variant}
                        colorVariant="pure"
                      >
                        {React.createElement(ChevronDown)}
                      </Icon>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Hidden input for form integration */}
          <input
            ref={inputRef}
            type="hidden"
            name={name}
            id={id ? `${id}-input` : undefined}
            value={
              multiple ? selectedValues.join(",") : selectedValues[0] || ""
            }
            required={required}
            disabled={disabled}
            aria-hidden="true"
          />
        </div>

        {/* Dropdown options with animation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={optionsRef}
              style={{
                backgroundColor: variantTokens.dropdownBackground,
                borderColor: variantTokens.dropdownBorder,
                maxHeight: sizeTokens.dropdownMaxHeight.replace("max-h-", ""),
              }}
              className="absolute z-50 mt-1 w-full rounded-md border shadow-md overflow-auto"
              role="listbox"
              aria-multiselectable={multiple}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dropdownVariants}
            >
              <div className="py-1">
                {options.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <motion.div
                      key={option.value}
                      custom={index}
                      variants={optionVariants}
                      style={{
                        backgroundColor: isSelected
                          ? variantTokens.optionSelectedBackground
                          : "transparent",
                        color: isSelected
                          ? variantTokens.optionSelectedText
                          : variantTokens.optionText,
                      }}
                      className={cn(
                        "px-3 py-2 text-sm flex items-center cursor-pointer transition-colors",
                        option.disabled &&
                          "opacity-50 cursor-not-allowed pointer-events-none"
                      )}
                      onClick={() =>
                        !option.disabled && handleOptionClick(option.value)
                      }
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                      onMouseEnter={(e) => {
                        if (!option.disabled) {
                          e.currentTarget.style.backgroundColor =
                            variantTokens.optionHoverBackground;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!option.disabled) {
                          e.currentTarget.style.backgroundColor = isSelected
                            ? variantTokens.optionSelectedBackground
                            : "transparent";
                        }
                      }}
                    >
                      <div className="flex-1 flex items-center">
                        {option.icon && (
                          <span className="mr-2 flex items-center">
                            <Icon size={iconSize}>
                              {React.createElement(option.icon)}
                            </Icon>
                          </span>
                        )}
                        <div>
                          <div className="font-medium">{option.label}</div>
                          {option.description && (
                            <div
                              className="text-xs"
                              style={{ color: variantTokens.placeholder }}
                            >
                              {option.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon
                            size={iconSize}
                            color={variant === "default" ? "primary" : variant}
                            className="ml-2 flex-shrink-0"
                          >
                            {React.createElement(Check)}
                          </Icon>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        {error && (
          <Text variant="caption" color="danger" className="mt-1.5">
            {error}
          </Text>
        )}

        {/* Success message */}
        {success && successMessage && !error && (
          <Text variant="caption" color="success" className="mt-1.5">
            {successMessage}
          </Text>
        )}

        {/* Hint text */}
        {hint && !(error || (success && successMessage)) && (
          <Text variant="caption" color="neutral" className="mt-1.5">
            {hint}
          </Text>
        )}
      </div>
    );
  }
);

SelectCustom.displayName = "SelectCustom";

export { SelectCustom };
