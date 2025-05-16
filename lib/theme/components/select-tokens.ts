import colors from "../colors";
import tinycolor from "tinycolor2";
import type { AppColorTokens, ColorShade, Mode } from "../ColorToken";

export type SelectSize = "sm" | "md" | "lg";
export type SelectVariant =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "neutral";

export type SelectTokens = {
  variants: Record<
    SelectVariant,
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
      // Dropdown específicos
      dropdownBackground: string;
      dropdownBorder: string;
      optionHoverBackground: string;
      optionSelectedBackground: string;
      optionSelectedText: string;
      optionText: string;
      // Nuevo token para el fondo del botón del chevron
      chevronButtonBackground: string;
    }
  >;
  sizes: Record<
    SelectSize,
    {
      height: string;
      fontSize: string;
      paddingX: string;
      paddingY: string;
      iconSize: string;
      iconPadding: string;
      // Dropdown específicos
      optionPaddingX: string;
      optionPaddingY: string;
      dropdownMaxHeight: string;
    }
  >;
};

export function generateSelectTokens(
  appColorTokens: AppColorTokens,
  mode: Mode
): SelectTokens {
  // Usamos neutral.text directamente, que ya está definido correctamente según el modo
  const textColor = appColorTokens.neutral.text;
  const placeholderTextColor = tinycolor(textColor).setAlpha(0.6).toRgbString();

  // Definir color de icono por defecto basado en primary
  const defaultIconColor =
    mode === "dark"
      ? tinycolor(appColorTokens.primary.text).setAlpha(0.9).toRgbString()
      : tinycolor(appColorTokens.primary.pure).setAlpha(0.9).toRgbString();

  // Función para generar variantes
  const generateVariant = (baseColor: ColorShade) => {
    // Para el borde normal, usamos gris en lugar del color de la variante
    const borderColor = appColorTokens.neutral.pure;
    const focusBorderColor = baseColor.pure;
    const focusRingColor = tinycolor(baseColor.pure)
      .setAlpha(0.2)
      .toRgbString();

    // Fondos con degradado sutil para estados especiales
    const errorBgColor = tinycolor(appColorTokens.danger.bg)
      .setAlpha(mode === "dark" ? 0.3 : 0.5)
      .toRgbString();

    const successBgColor = tinycolor(appColorTokens.success.bg)
      .setAlpha(mode === "dark" ? 0.3 : 0.5)
      .toRgbString();

    const editingBgColor = tinycolor(appColorTokens.tertiary.bg)
      .setAlpha(mode === "dark" ? 0.3 : 0.5)
      .toRgbString();

    // Colores específicos para el dropdown
    const dropdownBgColor =
      mode === "dark" ? appColorTokens.neutral.bg : appColorTokens.white.bg;
    const optionHoverBgColor = tinycolor(baseColor.pure)
      .setAlpha(0.15)
      .toRgbString();
    const optionSelectedBgColor = tinycolor(baseColor.pure)
      .setAlpha(0.25)
      .toRgbString();
    const optionSelectedTextColor = baseColor.pure;

    // Color del icono según la variante y el modo
    const variantIconColor =
      mode === "dark"
        ? tinycolor(baseColor.text).setAlpha(0.9).toRgbString()
        : tinycolor(baseColor.pure).setAlpha(0.9).toRgbString();

    // Nuevo color para el fondo del botón del chevron con mejor contraste
    const chevronButtonBgColor =
      mode === "dark"
        ? tinycolor(baseColor.pure).setAlpha(0.2).toRgbString()
        : tinycolor(baseColor.bg).darken(5).toRgbString();

    return {
      background:
        mode === "dark" ? appColorTokens.neutral.bg : appColorTokens.white.bg,
      border: borderColor,
      text: textColor,
      placeholder: placeholderTextColor,
      focusBorder: focusBorderColor,
      focusRing: focusRingColor,
      hoverBorder:
        mode === "dark"
          ? tinycolor(baseColor.pure).lighten(10).toString()
          : tinycolor(baseColor.pure).darken(10).toString(),
      errorBorder: appColorTokens.danger.pure,
      errorRing: tinycolor(appColorTokens.danger.pure)
        .setAlpha(0.2)
        .toRgbString(),
      errorBackground: errorBgColor,
      successBorder: appColorTokens.success.pure,
      successRing: tinycolor(appColorTokens.success.pure)
        .setAlpha(0.2)
        .toRgbString(),
      successText: appColorTokens.success.text,
      successBackground: successBgColor,
      iconColor: variantIconColor,
      disabledBackground: appColorTokens.neutral.bgShade,
      disabledBorder: tinycolor(appColorTokens.neutral.pure)
        .setAlpha(0.4)
        .toRgbString(),
      disabledText: tinycolor(appColorTokens.neutral.text)
        .setAlpha(0.5)
        .toRgbString(),
      editingBackground: editingBgColor,
      // Dropdown específicos
      dropdownBackground: dropdownBgColor,
      dropdownBorder:
        mode === "dark"
          ? appColorTokens.neutral.bgShade
          : appColorTokens.neutral.pure,
      optionHoverBackground: optionHoverBgColor,
      optionSelectedBackground: optionSelectedBgColor,
      optionSelectedText: optionSelectedTextColor,
      optionText: appColorTokens.neutral.text,
      // Nuevo token para el fondo del botón del chevron
      chevronButtonBackground: chevronButtonBgColor,
    };
  };

  // Generar fondo de edición para el tema terciario
  const tertiaryEditingBg = tinycolor(appColorTokens.tertiary.bg)
    .setAlpha(mode === "dark" ? 0.3 : 0.5)
    .toRgbString();

  // Fondos con degradado sutil para estados especiales
  const errorBgColor = tinycolor(appColorTokens.danger.bg)
    .setAlpha(mode === "dark" ? 0.3 : 0.5)
    .toRgbString();

  const successBgColor = tinycolor(appColorTokens.success.bg)
    .setAlpha(mode === "dark" ? 0.3 : 0.5)
    .toRgbString();

  // Colores específicos para el dropdown en variante default
  const defaultOptionHoverBgColor = tinycolor(appColorTokens.primary.pure)
    .setAlpha(0.15)
    .toRgbString();
  const defaultOptionSelectedBgColor = tinycolor(appColorTokens.primary.pure)
    .setAlpha(0.25)
    .toRgbString();
  const defaultOptionSelectedTextColor = appColorTokens.primary.pure;

  // Nuevo token para el fondo del botón del chevron con mejor contraste
  const defaultChevronButtonBgColor =
    mode === "dark"
      ? tinycolor(appColorTokens.primary.pure).setAlpha(0.2).toRgbString()
      : tinycolor(appColorTokens.primary.bg).darken(5).toRgbString();

  return {
    variants: {
      default: {
        background:
          mode === "dark" ? appColorTokens.neutral.bg : appColorTokens.white.bg,
        border:
          mode === "dark"
            ? appColorTokens.neutral.pure
            : appColorTokens.neutral.pure,
        text: textColor,
        placeholder: placeholderTextColor,
        focusBorder: appColorTokens.primary.pure,
        focusRing: tinycolor(appColorTokens.primary.pure)
          .setAlpha(0.2)
          .toRgbString(),
        hoverBorder: appColorTokens.neutral.bgShade,
        errorBorder: appColorTokens.danger.pure,
        errorRing: tinycolor(appColorTokens.danger.pure)
          .setAlpha(0.2)
          .toRgbString(),
        errorBackground: errorBgColor,
        successBorder: appColorTokens.success.pure,
        successRing: tinycolor(appColorTokens.success.pure)
          .setAlpha(0.2)
          .toRgbString(),
        successText: appColorTokens.success.text,
        successBackground: successBgColor,
        iconColor: defaultIconColor,
        disabledBackground: appColorTokens.neutral.bgShade,
        disabledBorder: tinycolor(appColorTokens.neutral.pure)
          .setAlpha(0.4)
          .toRgbString(),
        disabledText: tinycolor(appColorTokens.neutral.text)
          .setAlpha(0.5)
          .toRgbString(),
        editingBackground: tertiaryEditingBg,
        dropdownBackground:
          mode === "dark" ? appColorTokens.neutral.bg : appColorTokens.white.bg,
        dropdownBorder:
          mode === "dark"
            ? appColorTokens.neutral.bgShade
            : appColorTokens.neutral.pure,
        optionHoverBackground: defaultOptionHoverBgColor,
        optionSelectedBackground: defaultOptionSelectedBgColor,
        optionSelectedText: defaultOptionSelectedTextColor,
        optionText: appColorTokens.neutral.text,
        chevronButtonBackground: defaultChevronButtonBgColor,
      },
      primary: generateVariant(appColorTokens.primary),
      secondary: generateVariant(appColorTokens.secondary),
      tertiary: generateVariant(appColorTokens.tertiary),
      accent: generateVariant(appColorTokens.accent),
      neutral: {
        ...generateVariant(appColorTokens.neutral),
      },
    },
    sizes: {
      sm: {
        height: "h-8",
        fontSize: "text-xs",
        paddingX: "px-2",
        paddingY: "py-1",
        iconSize: "h-2.5 w-2.5",
        iconPadding: "pl-7 pr-2",
        optionPaddingX: "px-2",
        optionPaddingY: "py-1",
        dropdownMaxHeight: "max-h-40",
      },
      md: {
        height: "h-10",
        fontSize: "text-sm",
        paddingX: "px-3",
        paddingY: "py-2",
        iconSize: "h-3.5 w-3.5",
        iconPadding: "pl-10 pr-3",
        optionPaddingX: "px-3",
        optionPaddingY: "py-2",
        dropdownMaxHeight: "max-h-60",
      },
      lg: {
        height: "h-12",
        fontSize: "text-base",
        paddingX: "px-4",
        paddingY: "py-2.5",
        iconSize: "h-4 w-4",
        iconPadding: "pl-12 pr-4",
        optionPaddingX: "px-4",
        optionPaddingY: "py-2.5",
        dropdownMaxHeight: "max-h-72",
      },
    },
  };
}
