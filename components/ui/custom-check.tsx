"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/app/theme-provider";
import {
  generateCheckTokens,
  type CheckVariant,
  type CheckSize,
  type CheckVisualVariant,
} from "@/lib/theme/components/check-tokens";
import type { CheckTokens as CheckTokensType } from "@/lib/theme/components/check-tokens";

export interface CustomCheckProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  description?: string;
  variant?: CheckVariant;
  size?: CheckSize;
  visualVariant?: CheckVisualVariant;
  indeterminate?: boolean;
  error?: boolean;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
}

const CustomCheck = forwardRef<HTMLInputElement, CustomCheckProps>(
  (
    {
      className,
      label,
      description,
      variant = "primary",
      size = "md",
      visualVariant = "default",
      indeterminate = false,
      disabled = false,
      error = false,
      checked,
      defaultChecked,
      onChange,
      labelClassName,
      descriptionClassName,
      ...props
    },
    ref
  ) => {
    const { appColorTokens } = useTheme();
    const [isChecked, setIsChecked] = useState<boolean>(
      Boolean(defaultChecked || checked)
    );
    const [isIndeterminate, setIsIndeterminate] =
      useState<boolean>(indeterminate);

    // Generar tokens con manejo de errores
    const tokens: CheckTokensType | null = React.useMemo(() => {
      if (!appColorTokens) return null;
      return generateCheckTokens(
        appColorTokens,
        size,
        error ? "danger" : variant,
        visualVariant
      );
    }, [appColorTokens, size, error, variant, visualVariant]);

    // Actualizar estado cuando cambian las props
    useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    useEffect(() => {
      setIsIndeterminate(indeterminate);
    }, [indeterminate]);

    // Manejar cambios
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setIsChecked(e.target.checked);
        setIsIndeterminate(false);
      }

      onChange?.(e);
    };

    // Referencia para manejar el estado indeterminado
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Combinar refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Actualizar el estado indeterminado del input nativo
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = isIndeterminate;
      }
    }, [isIndeterminate]);

    // Fallback if tokens are not ready
    if (!tokens) {
      // Simple fallback rendering - a disabled-looking checkbox
      return (
        <label
          className={cn(
            "flex items-start gap-2 cursor-not-allowed opacity-50",
            className
          )}
        >
          <div
            className="flex-shrink-0"
            style={{
              width: getSizeTokens(size).box,
              height: getSizeTokens(size).box,
              border: "1px solid #cccccc",
              borderRadius: getSizeTokens(size).borderRadius,
              backgroundColor: "#e0e0e0",
            }}
          />
          {(label || description) && (
            <div className="flex flex-col">
              {label && (
                <span
                  className={cn(
                    "text-sm font-medium text-gray-400",
                    labelClassName
                  )}
                  style={{ fontSize: getSizeTokens(size).fontSize }}
                >
                  {label}
                </span>
              )}
              {description && (
                <span
                  className={cn("text-xs text-gray-400", descriptionClassName)}
                >
                  {description}
                </span>
              )}
            </div>
          )}
        </label>
      );
    }

    // Estilos base
    const checkboxStyle: React.CSSProperties = {
      width: tokens.size.box,
      height: tokens.size.box,
      backgroundColor:
        isChecked || isIndeterminate
          ? tokens.checked.background
          : tokens.background,
      borderColor:
        isChecked || isIndeterminate ? tokens.checked.border : tokens.border,
      borderWidth: "1px", // Borde más fino
      borderStyle: "solid",
      borderRadius: tokens.size.borderRadius,
      transition: "all 0.2s ease",
    };

    // Variantes para la animación del check
    const checkVariants = {
      checked: {
        pathLength: 1,
        opacity: 1,
      },
      unchecked: {
        pathLength: 0,
        opacity: 0,
      },
    };

    // Variantes para la animación del indeterminado
    const indeterminateVariants = {
      checked: {
        scaleX: 1,
        opacity: 1,
      },
      unchecked: {
        scaleX: 0,
        opacity: 0,
      },
    };

    // Determinar el grosor del check según el tamaño
    let checkThickness = 2.5;
    let svgPadding = "1px";

    switch (size) {
      case "xs":
        checkThickness = 2.5;
        svgPadding = "1px";
        break;
      case "sm":
        checkThickness = 3;
        svgPadding = "1px";
        break;
      case "md":
        checkThickness = 3.5;
        svgPadding = "1px";
        break;
      case "lg":
        checkThickness = 4;
        svgPadding = "2px";
        break;
      case "xl":
        checkThickness = 5;
        svgPadding = "2px";
        break;
    }

    return (
      <label
        className={cn(
          "flex items-start gap-2 cursor-pointer",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        <div className="relative flex-shrink-0">
          {/* Input nativo (oculto) */}
          <input
            type="checkbox"
            ref={inputRef}
            checked={isChecked}
            disabled={disabled}
            onChange={handleChange}
            className="sr-only"
            {...props}
          />

          {/* Checkbox personalizado */}
          <motion.div
            style={checkboxStyle}
            whileHover={
              !disabled
                ? {
                    backgroundColor: tokens.hover.background,
                    borderColor: tokens.hover.border,
                    scale: 1.05,
                  }
                : {}
            }
            whileTap={
              !disabled
                ? {
                    backgroundColor: tokens.active.background,
                    borderColor: tokens.active.border,
                    scale: 0.95,
                  }
                : {}
            }
            animate={{
              boxShadow:
                typeof document !== "undefined" &&
                props.id === document.activeElement?.id
                  ? `0 0 0 3px ${tokens.focus.outline}`
                  : "none",
            }}
          >
            {/* Check mark */}
            {!isIndeterminate && (
              <motion.svg
                viewBox="0 0 24 24"
                className="absolute inset-0 w-full h-full"
                style={{ padding: svgPadding }}
                initial={false}
                animate={isChecked ? "checked" : "unchecked"}
              >
                <motion.path
                  d="M4 12l5 5L20 7"
                  fill="transparent"
                  strokeWidth={checkThickness}
                  stroke={isChecked ? tokens.checked.check : "transparent"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={checkVariants}
                  transition={{ duration: 0.2 }}
                />
              </motion.svg>
            )}

            {/* Indeterminate mark */}
            {isIndeterminate && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={false}
                animate={isIndeterminate ? "checked" : "unchecked"}
              >
                <motion.div
                  style={{
                    width: "70%",
                    height: checkThickness,
                    backgroundColor: tokens.checked.check,
                    borderRadius: "1px",
                  }}
                  variants={indeterminateVariants}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            )}

            {/* Ripple effect on click */}
            <motion.div
              className="absolute inset-0 rounded-full bg-current"
              initial={{ opacity: 0, scale: 0 }}
              whileTap={{ opacity: 0.2, scale: 1.5 }}
              transition={{ duration: 0.4 }}
              style={{ color: tokens.checked.check }}
            />
          </motion.div>
        </div>

        {/* Label y descripción */}
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span
                className={cn(
                  "text-sm font-medium",
                  disabled && "opacity-60",
                  labelClassName
                )}
                style={{ fontSize: tokens.size.fontSize, color: tokens.text }}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                className={cn(
                  "text-xs",
                  disabled && "opacity-60",
                  descriptionClassName
                )}
                style={{ color: tokens.text }}
              >
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

CustomCheck.displayName = "CustomCheck";

export { CustomCheck };

// Helper function (or import if it's moved to a shared util)
// This is duplicated from check-tokens.ts for now.
// In a real scenario, this should be a shared utility or imported.
function getSizeTokens(size: CheckSize) {
  switch (size) {
    case "xs":
      return {
        box: "16px",
        checkThickness: 2.5,
        borderRadius: "3px",
        fontSize: "0.75rem",
        padding: "0.25rem",
      };
    case "sm":
      return {
        box: "18px",
        checkThickness: 3,
        borderRadius: "4px",
        fontSize: "0.875rem",
        padding: "0.375rem",
      };
    case "lg":
      return {
        box: "24px",
        checkThickness: 4,
        borderRadius: "6px",
        fontSize: "1.125rem",
        padding: "0.625rem",
      };
    case "xl":
      return {
        box: "28px",
        checkThickness: 5,
        borderRadius: "7px",
        fontSize: "1.25rem",
        padding: "0.75rem",
      };
    default: // md
      return {
        box: "20px",
        checkThickness: 3.5,
        borderRadius: "5px",
        fontSize: "1rem",
        padding: "0.5rem",
      };
  }
}
