import tinycolor from "tinycolor2";
import type { AppColorTokens, ColorShade, Mode } from "../ColorToken";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "neutral";

export type InputTokens = {
  variants: Record<
    InputVariant,
    {
      background: string;
      border: string;
      text: string;
      placeholder: string;
      focusBorder: string;
      focusRing: string;
      hoverBorder: string;
      errorBorder: string;
      errorRing: string;
      errorBackground: string;
      successBorder: string;
      successRing: string;
      successText: string;
      successBackground: string;
      iconColor: string;
      disabledBackground: string;
      disabledBorder: string;
      disabledText: string;
      editingBackground: string;
    }
  >;
  sizes: Record<
    InputSize,
    {
      height: string;
      fontSize: string;
      paddingX: string;
      paddingY: string;
      iconSize: string;
      iconPadding: string;
    }
  >;
};

export function generateInputTokens(
  appColorTokens: AppColorTokens,
  mode: Mode
): InputTokens {
  const {
    primary,
    secondary,
    tertiary,
    accent,
    neutral,
    danger,
    success,
    white,
  } = appColorTokens;

  // Determinar colores de texto apropiados según el modo y fondo
  // En modo oscuro, usamos text que ya está pensado para fondos oscuros
  const textColor = mode === "dark" ? neutral.text : neutral.text;
  const placeholderColor = tinycolor(textColor).setAlpha(0.6).toRgbString();

  // Usar el color primary para los iconos, similar a select-tokens
  const iconColor =
    mode === "dark"
      ? tinycolor(primary.text).setAlpha(0.9).toRgbString()
      : tinycolor(primary.pure).setAlpha(0.9).toRgbString();

  // Color de fondo según el modo
  const backgroundColorByMode = mode === "dark" ? neutral.bg : white.bg;

  // Colores para estados especiales
  const errorBg = tinycolor(danger.bg)
    .setAlpha(mode === "dark" ? 0.3 : 0.5)
    .toRgbString();
  const successBg = tinycolor(success.bg)
    .setAlpha(mode === "dark" ? 0.3 : 0.5)
    .toRgbString();
  const editingBg = tinycolor(tertiary.bg ? tertiary.bg : neutral.bg)
    .setAlpha(mode === "dark" ? 0.3 : 0.5)
    .toRgbString();

  // Manejo de estados de borde según el modo
  const borderColor = neutral.pure;
  const hoverBorderColor =
    mode === "dark"
      ? tinycolor(neutral.pure).lighten(10).toString()
      : neutral.bgShade;

  // Estados deshabilitados
  const disabledBackground = neutral.bgShade;
  const disabledBorder = tinycolor(neutral.pure).setAlpha(0.4).toRgbString();
  const disabledText = tinycolor(textColor).setAlpha(0.5).toRgbString();

  const commonVariantStyles = {
    text: textColor,
    placeholder: placeholderColor,
    errorBorder: danger.pure,
    errorRing: tinycolor(danger.pure).setAlpha(0.2).toRgbString(),
    errorBackground: errorBg,
    successBorder: success.pure,
    successRing: tinycolor(success.pure).setAlpha(0.2).toRgbString(),
    successText: success.text,
    successBackground: successBg,
    iconColor: iconColor,
    disabledBackground: disabledBackground,
    disabledBorder: disabledBorder,
    disabledText: disabledText,
    editingBackground: editingBg,
  };

  const createColoredVariant = (variantShade: ColorShade) => {
    // Ajuste del color del borde al pasar el ratón según el modo
    const variantHoverBorder =
      mode === "dark"
        ? tinycolor(variantShade.pure).lighten(10).toString()
        : variantShade.bgShade;

    // Ajuste del color del icono según la variante
    const variantIconColor =
      mode === "dark"
        ? tinycolor(variantShade.text).setAlpha(0.9).toRgbString()
        : tinycolor(variantShade.pure).setAlpha(0.9).toRgbString();

    return {
      background: backgroundColorByMode,
      border: variantShade.pure,
      focusBorder: variantShade.pure,
      focusRing: tinycolor(variantShade.pure).setAlpha(0.2).toRgbString(),
      hoverBorder: variantHoverBorder,
      ...commonVariantStyles,
      iconColor: variantIconColor, // Sobreescribir iconColor para cada variante
    };
  };

  return {
    variants: {
      default: {
        background: backgroundColorByMode,
        border: borderColor,
        focusBorder: primary.pure,
        focusRing: tinycolor(primary.pure).setAlpha(0.2).toRgbString(),
        hoverBorder: hoverBorderColor,
        ...commonVariantStyles,
      },
      primary: createColoredVariant(primary),
      secondary: createColoredVariant(secondary),
      tertiary: createColoredVariant(tertiary),
      accent: createColoredVariant(accent),
      neutral: {
        ...createColoredVariant(neutral),
        focusBorder: neutral.pure,
        focusRing: tinycolor(neutral.pure).setAlpha(0.2).toRgbString(),
        hoverBorder:
          mode === "dark"
            ? tinycolor(neutral.pure).lighten(10).toString()
            : neutral.bgShade,
      },
    },
    sizes: {
      sm: {
        height: "h-8",
        fontSize: "text-xs",
        paddingX: "px-2",
        paddingY: "py-1",
        iconSize: "h-3 w-3", // Ligeramente más grande para mejor visibilidad
        iconPadding: "pl-7 pr-2",
      },
      md: {
        height: "h-10",
        fontSize: "text-sm",
        paddingX: "px-3",
        paddingY: "py-2",
        iconSize: "h-4 w-4", // Ligeramente más grande para mejor visibilidad
        iconPadding: "pl-10 pr-3",
      },
      lg: {
        height: "h-12",
        fontSize: "text-base",
        paddingX: "px-4",
        paddingY: "py-2.5",
        iconSize: "h-5 w-5", // Ligeramente más grande para mejor visibilidad
        iconPadding: "pl-12 pr-4",
      },
    },
  };
}
