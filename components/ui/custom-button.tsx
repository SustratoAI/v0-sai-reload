"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/app/theme-provider";
import { useRipple } from "@/components/ripple/RippleProvider";
import {
  generateButtonTokens,
  type ButtonColor,
  type ButtonRounded,
  type ButtonSize,
  type ButtonVariant,
} from "@/lib/theme/components/button-tokens";

// Definimos las propiedades del botón
export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  color?: ButtonColor;
  rounded?: ButtonRounded;
  bordered?: boolean;
  gradient?: boolean;
  elevated?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disableRipple?: boolean;
}

// Definimos las variantes del botón usando CVA
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none relative overflow-hidden",
  {
    variants: {
      variant: {
        solid: "",
        outline: "",
        ghost: "",
        link: "underline-offset-4 hover:underline",
        subtle: "",
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
      },
      rounded: {
        none: "",
        sm: "",
        md: "",
        lg: "",
        full: "",
      },
      fullWidth: {
        true: "w-full",
      },
      bordered: {
        true: "",
      },
      gradient: {
        true: "",
      },
      elevated: {
        true: "",
      },
      iconOnly: {
        true: "",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
      rounded: "md",
    },
  }
);

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      className,
      variant = "solid",
      size = "md",
      rounded = "md",
      color = "primary",
      asChild = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      loading = false,
      loadingText,
      fullWidth = false,
      bordered = false,
      gradient = false,
      elevated = false,
      children,
      disabled,
      disableRipple = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const { appColorTokens, mode } = useTheme();

    const buttonTokens = React.useMemo(() => {
      if (!appColorTokens) return null;
      return generateButtonTokens(appColorTokens, mode);
    }, [appColorTokens, mode]);

    // Obtenemos el hook de ripple
    const triggerRipple = useRipple();

    // Estado para el efecto de presionado
    const [isPressed, setIsPressed] = React.useState(false);
    // Estado para el efecto hover
    const [isHovered, setIsHovered] = React.useState(false);

    // Referencia al botón
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    // Referencias para los iconos
    const leftIconRef = React.useRef<HTMLSpanElement>(null);
    const rightIconRef = React.useRef<HTMLSpanElement>(null);
    // Referencia para el texto
    const textRef = React.useRef<HTMLSpanElement>(null);

    // Combinamos las referencias
    const combinedRef = React.useMemo(() => {
      return (node: HTMLButtonElement) => {
        buttonRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      };
    }, [ref]);

    // Manejadores de eventos para los efectos
    const handleMouseDown = React.useCallback(() => {
      if (disabled || loading) return;
      setIsPressed(true);
    }, [disabled, loading]);

    const handleMouseUp = React.useCallback(() => {
      setIsPressed(false);
    }, []);

    const handleMouseEnter = React.useCallback(() => {
      setIsHovered(true);
    }, []);

    const handleMouseLeave = React.useCallback(() => {
      setIsPressed(false);
      setIsHovered(false);
    }, []);

    // Manejador de clic para el efecto ripple
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (
          disabled ||
          loading ||
          disableRipple ||
          !buttonTokens ||
          !appColorTokens
        )
          return;

        let finalRippleColor: string;

        if (
          variant === "ghost" ||
          variant === "outline" ||
          variant === "subtle"
        ) {
          switch (color) {
            case "primary":
              finalRippleColor = appColorTokens.primary.pure;
              break;
            case "secondary":
              finalRippleColor = appColorTokens.secondary.pure;
              break;
            case "tertiary":
              finalRippleColor = appColorTokens.tertiary.pure;
              break;
            case "accent":
              finalRippleColor = appColorTokens.accent.pure;
              break;
            case "success":
              finalRippleColor = appColorTokens.success.pure;
              break;
            case "warning":
              finalRippleColor = appColorTokens.warning.pure;
              break;
            case "danger":
              finalRippleColor = appColorTokens.danger.pure;
              break;
            case "default": // Para el color "default" del botón, usamos neutral.pure
              finalRippleColor = appColorTokens.neutral.pure;
              break;
            default:
              // Si 'color' es un ButtonColor que no se manejó explícitamente (no debería pasar
              // ya que todos los ButtonColor están en el switch), o si hay un tipo inesperado,
              // usamos un fallback seguro.
              finalRippleColor = appColorTokens.primary.pure; // Fallback seguro
              break;
          }
        } else {
          // Para 'solid' y otras variantes (como 'link', si tuviera ripple)
          // Aquí 'color' es definitivamente un ButtonColor válido.
          finalRippleColor = buttonTokens.colors[color].rippleColor;
        }

        // Calcular la escala del ripple basada en el tamaño del botón
        const buttonRect = buttonRef.current?.getBoundingClientRect();
        const maxDimension = buttonRect
          ? Math.max(buttonRect.width, buttonRect.height)
          : 100;
        const scale = (maxDimension / 8) * 0.6; // Reducido en un 40% respecto al original (maxDimension / 8)

        // Activar el efecto ripple
        triggerRipple(e, finalRippleColor, scale);

        // Llamar al manejador de clic original si existe
        if (onClick) {
          onClick(e);
        }
      },
      [
        disabled,
        loading,
        disableRipple,
        buttonTokens,
        appColorTokens,
        color,
        variant,
        triggerRipple,
        onClick,
      ]
    );

    // Si los tokens no están listos, renderizar un botón deshabilitado simple o null
    if (!buttonTokens) {
      return (
        <button
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap font-medium",
            "px-3 py-2 text-sm rounded-md", // Estilos mínimos para un placeholder
            "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50",
            fullWidth ? "w-full" : "",
            className
          )}
          disabled
          {...props}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading && loadingText ? loadingText : children}
          {!loading && !loadingText ? children : null}
        </button>
      );
    }

    // Obtenemos los estilos base del botón
    const baseStyles = buttonTokens.base;
    const variantStyles = buttonTokens.variants[variant];
    const colorStyles = buttonTokens.colors[color];

    // Función para convertir hex a rgb
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        hex.trim()
      );
      return result
        ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(
            result[2],
            16
          )}, ${Number.parseInt(result[3], 16)}`
        : null;
    };

    // Función para aclarar un color (para gradientes)
    const lightenColor = (hex: string, percent: number) => {
      const rgb = hexToRgb(hex);
      if (!rgb) return hex;

      const [r, g, b] = rgb.split(",").map(Number);
      const lightenAmount = 255 * (percent / 100);

      const newR = Math.min(255, r + lightenAmount);
      const newG = Math.min(255, g + lightenAmount);
      const newB = Math.min(255, b + lightenAmount);

      return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(
        newB
      )})`;
    };

    // Función para oscurecer un color (para gradientes)
    const darkenColor = (hex: string, percent: number) => {
      const rgb = hexToRgb(hex);
      if (!rgb) return hex;

      const [r, g, b] = rgb.split(",").map(Number);
      const darkenAmount = percent / 100;

      const newR = Math.max(0, r * (1 - darkenAmount));
      const newG = Math.max(0, g * (1 - darkenAmount));
      const newB = Math.max(0, b * (1 - darkenAmount));

      return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(
        newB
      )})`;
    };

    // Crear un gradiente más visible
    const createVisibleGradient = (
      baseColor: string,
      isPressed: boolean,
      isHovered: boolean
    ) => {
      // Colores para el gradiente
      const lightColor = lightenColor(
        baseColor,
        isPressed ? 10 : isHovered ? 20 : 30
      );
      const darkColor = darkenColor(
        baseColor,
        isPressed ? 30 : isHovered ? 20 : 10
      );

      // Dirección del gradiente según el estado
      const direction = isPressed ? "to bottom" : "to top";

      return `linear-gradient(${direction}, ${darkColor}, ${baseColor} 50%, ${lightColor})`;
    };

    // Determinar el color de texto según la variante y el tipo de botón
    const getTextColor = () => {
      if (variant === "ghost") {
        return colorStyles.ghostColor;
      } else if (variant === "outline") {
        return colorStyles.outlineColor;
      } else if (variant === "solid") {
        return colorStyles.color;
      } else if (variant === "subtle") {
        return colorStyles.color;
      } else if (variant === "link") {
        return colorStyles.color;
      }

      return colorStyles.color;
    };

    // Efecto para animar los iconos y el texto en hover
    React.useEffect(() => {
      if (disabled || loading) return;

      // Animación para el icono izquierdo
      if (leftIconRef.current) {
        if (isHovered) {
          leftIconRef.current.style.transform = "scale(1.15)";
        } else {
          leftIconRef.current.style.transform = "scale(1)";
        }
      }

      // Animación para el icono derecho
      if (rightIconRef.current) {
        if (isHovered) {
          rightIconRef.current.style.transform = "scale(1.15)";
        } else {
          rightIconRef.current.style.transform = "scale(1)";
        }
      }

      // Animación para el texto
      if (textRef.current) {
        if (isHovered) {
          textRef.current.style.transform = "scale(1.03)";
          // Eliminamos el cambio de letter-spacing para evitar que afecte el tamaño del botón
        } else {
          textRef.current.style.transform = "scale(1)";
        }
      }
    }, [isHovered, disabled, loading]);

    // Determinamos el contenido del botón
    const buttonContent = loading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span className="inline-block">{loadingText || children}</span>
      </>
    ) : (
      <>
        {leftIcon && (
          <span
            ref={leftIconRef}
            className="mr-2 inline-flex items-center justify-center transition-transform duration-300 ease-in-out"
            style={{ transformOrigin: "center" }}
          >
            {leftIcon}
          </span>
        )}
        <span
          ref={textRef}
          className="inline-block transition-transform duration-300 ease-in-out"
          style={{ transformOrigin: "center" }}
        >
          {children}
        </span>
        {rightIcon && (
          <span
            ref={rightIconRef}
            className="ml-2 inline-flex items-center justify-center transition-transform duration-300 ease-in-out"
            style={{ transformOrigin: "center" }}
          >
            {rightIcon}
          </span>
        )}
      </>
    );

    // Construimos los estilos CSS personalizados usando solo JavaScript
    const customStyles = React.useMemo(() => {
      const styles: React.CSSProperties = {
        padding: iconOnly ? "0" : baseStyles.padding[size],
        height: iconOnly ? baseStyles.height[size] : "auto",
        width: iconOnly ? baseStyles.height[size] : "auto",
        minHeight: baseStyles.height[size],
        borderRadius: baseStyles.borderRadius[rounded],
        fontSize: baseStyles.fontSize[size],
        fontWeight: baseStyles.fontWeight,
        gap: baseStyles.gap[size],
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      };

      // Obtener el color de texto según la variante y el tipo de botón
      const textColor = getTextColor();
      const rgbColor = hexToRgb(colorStyles.background) || "0,0,0";

      // Aplicar estilos según la variante
      if (variant === "solid") {
        if (gradient) {
          // Usar un gradiente más visible
          styles.backgroundImage = createVisibleGradient(
            colorStyles.background,
            isPressed,
            isHovered
          );
          // No establecer backgroundColor cuando hay gradiente
        } else {
          styles.backgroundColor = isPressed
            ? colorStyles.activeBackground
            : isHovered
            ? colorStyles.hoverBackground
            : colorStyles.background;
        }

        // Aplicar el color de texto para botones solid
        styles.color = textColor;
        styles.border = "none";

        // Efecto más pronunciado para gradientes al hacer clic
        if (gradient && isPressed) {
          styles.boxShadow = "inset 0 3px 5px rgba(0, 0, 0, 0.3)";
          styles.transform = "scale(0.97) translateY(3px)";
        }
      } else if (variant === "outline") {
        const bgOpacity =
          color === "default"
            ? isPressed
              ? 0.25
              : isHovered
              ? 0.15
              : 0
            : isPressed
            ? 0.15
            : isHovered
            ? 0.08
            : 0;

        styles.backgroundColor = `rgba(${rgbColor}, ${bgOpacity})`;

        // Aplicar el color de texto para botones outline
        styles.color = textColor;
        styles.border = `1px solid ${
          isPressed
            ? colorStyles.activeBorder
            : isHovered
            ? colorStyles.hoverBorder
            : colorStyles.outlineBorder
        }`;
      } else if (variant === "ghost") {
        const bgOpacity =
          color === "default"
            ? isPressed
              ? 0.35
              : isHovered
              ? 0.2
              : 0
            : isPressed
            ? 0.25
            : isHovered
            ? 0.12
            : 0;

        styles.backgroundColor = `rgba(${rgbColor}, ${bgOpacity})`;

        // Aplicar el color de texto para botones ghost
        styles.color = textColor;
        styles.border = "none";
      } else if (variant === "subtle") {
        const bgOpacity = isPressed ? 0.4 : isHovered ? 0.3 : 0.2;
        styles.backgroundColor = `rgba(${rgbColor}, ${bgOpacity})`;

        // Aplicar el color de texto para botones subtle
        styles.color = textColor;
        styles.border = "none";
      } else if (variant === "link") {
        styles.backgroundColor = "transparent";

        // Aplicar el color de texto para botones link
        styles.color = textColor;
        styles.border = "none";
        if (isHovered) {
          styles.textDecoration = "underline";
        }
      }

      // Aplicar sombras si es elevado
      if (elevated && !disabled) {
        styles.boxShadow = isPressed
          ? "0 1px 2px rgba(0, 0, 0, 0.2)"
          : isHovered
          ? "0 8px 16px rgba(0, 0, 0, 0.2)"
          : "0 4px 8px rgba(0, 0, 0, 0.15)";
      }

      // Aplicar transformación según el estado
      if (!disabled) {
        if (isPressed) {
          // Efecto de clic más pronunciado
          styles.transform = gradient
            ? "scale(0.97) translateY(3px)"
            : "translateY(2px)";
        } else if (isHovered && elevated) {
          styles.transform = "translateY(-3px)";
        }
      }

      // Aplicar estilos para estado deshabilitado
      if (disabled) {
        styles.backgroundColor = variantStyles.disabled.background;
        styles.color = variantStyles.disabled.color;
        styles.border = variantStyles.disabled.border;
        styles.opacity = variantStyles.disabled.opacity;
        styles.cursor = variantStyles.disabled.cursor;
      }

      return styles;
    }, [
      baseStyles,
      variantStyles,
      colorStyles,
      size,
      rounded,
      iconOnly,
      elevated,
      gradient,
      isPressed,
      isHovered,
      disabled,
      variant,
      color,
    ]);

    // Componente a renderizar
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            rounded,
            fullWidth,
            bordered,
            gradient,
            elevated,
            iconOnly,
            className,
          })
        )}
        ref={combinedRef}
        disabled={disabled || loading}
        style={customStyles}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  }
);

CustomButton.displayName = "CustomButton";

export { CustomButton, buttonVariants };
