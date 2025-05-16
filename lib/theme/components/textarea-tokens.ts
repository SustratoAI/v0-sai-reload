import type { AppColorTokens, ColorShade, Mode } from "../ColorToken";
import tinycolor from "tinycolor2";

export type TextareaVariant =
  | "default"
  | "neutral"
  | "white"
  | "tertiary"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";
export type TextareaSize = "sm" | "md" | "lg";

export interface TextareaVariantTokens {
  background: string;
  border: string;
  text: string;
  placeholder: string;
  iconColor: string;
  disabledBackground: string;
  disabledBorder: string;
  disabledText: string;
  errorBackground: string;
  errorBorder: string;
  errorText: string;
  errorRing: string;
  successBackground: string;
  successBorder: string;
  successText: string;
  successRing: string;
  warningText: string;
  focusBorder: string;
  focusRing: string;
  hoverBorder: string;
  editingBackground: string;
  optionSelectedBackground: string;
  optionSelectedText: string;
  optionHoverBackground: string;
  optionText: string;
  dropdownBackground: string;
  dropdownBorder: string;
}

export interface TextareaSizeTokens {
  height: string;
  minHeight: string;
  fontSize: string;
  paddingX: string;
  paddingY: string;
  dropdownMaxHeight: string;
}

export interface TextareaTokens {
  variants: Record<TextareaVariant, TextareaVariantTokens>;
  sizes: Record<TextareaSize, TextareaSizeTokens>;
}

export function generateTextareaTokens(
  appColorTokens: AppColorTokens,
  mode: Mode
): TextareaTokens {
  const {
    primary,
    secondary,
    tertiary,
    neutral,
    danger,
    success,
    warning,
    accent,
    white,
  } = appColorTokens;

  const info = accent;

  // Determinar colores de texto apropiados según el modo
  const textColor = neutral.text;
  const placeholderColor = tinycolor(textColor).setAlpha(0.6).toRgbString();

  // Usar el color primary para los iconos, similar a select e input
  const mainIconColor =
    mode === "dark"
      ? tinycolor(primary.text).setAlpha(0.9).toRgbString()
      : tinycolor(primary.pure).setAlpha(0.9).toRgbString();

  // Color de fondo según el modo
  const backgroundColorByMode = mode === "dark" ? neutral.bg : white.bg;

  const disabledBackground = neutral.bgShade;
  const disabledBorder = tinycolor(neutral.pure).setAlpha(0.4).toRgbString();
  const disabledText = tinycolor(textColor).setAlpha(0.5).toRgbString();

  const editingBackground = tinycolor(tertiary.bg ? tertiary.bg : neutral.bg)
    .setAlpha(mode === "dark" ? 0.3 : 0.5)
    .toRgbString();

  const createColoredVariant = (
    shade: ColorShade,
    shadeForFocusRing?: ColorShade
  ) => {
    const focusRingColor = shadeForFocusRing
      ? shadeForFocusRing.pure
      : shade.pure;

    // Ajuste del color del icono según la variante
    const variantIconColor =
      mode === "dark"
        ? tinycolor(shade.text).setAlpha(0.9).toRgbString()
        : tinycolor(shade.pure).setAlpha(0.9).toRgbString();

    // Ajuste del color del borde al pasar el ratón según el modo
    const variantHoverBorder =
      mode === "dark"
        ? tinycolor(shade.pure).lighten(10).toString()
        : shade.bgShade;

    return {
      background: backgroundColorByMode,
      border: shade.pure,
      text: textColor,
      placeholder: placeholderColor,
      iconColor: variantIconColor,
      disabledBackground,
      disabledBorder,
      disabledText,
      errorBackground: tinycolor(danger.bg)
        .setAlpha(mode === "dark" ? 0.3 : 0.5)
        .toRgbString(),
      errorBorder: danger.pure,
      errorText: danger.text,
      errorRing: tinycolor(danger.pure).setAlpha(0.2).toRgbString(),
      successBackground: tinycolor(success.bg)
        .setAlpha(mode === "dark" ? 0.3 : 0.5)
        .toRgbString(),
      successBorder: success.pure,
      successText: success.text,
      successRing: tinycolor(success.pure).setAlpha(0.2).toRgbString(),
      warningText: warning.text,
      focusBorder: shade.pure,
      focusRing: tinycolor(focusRingColor).setAlpha(0.2).toRgbString(),
      hoverBorder: variantHoverBorder,
      editingBackground,
      optionSelectedBackground: primary.bg,
      optionSelectedText: primary.contrastText,
      optionHoverBackground: neutral.bg,
      optionText: neutral.text,
      dropdownBackground: mode === "dark" ? neutral.bg : white.bg,
      dropdownBorder: mode === "dark" ? neutral.bgShade : neutral.pure,
    };
  };

  const defaultVariantTokens = {
    ...createColoredVariant(neutral, primary),
    border: neutral.pure,
    hoverBorder:
      mode === "dark"
        ? tinycolor(neutral.pure).lighten(10).toString()
        : neutral.bgShade,
    iconColor: mainIconColor,
  };

  return {
    variants: {
      default: defaultVariantTokens,
      neutral: createColoredVariant(neutral),
      white: {
        ...createColoredVariant(neutral),
        background: mode === "dark" ? neutral.bg : white.pure,
        dropdownBackground: mode === "dark" ? neutral.bg : white.pure,
      },
      tertiary: createColoredVariant(tertiary),
      primary: createColoredVariant(primary),
      secondary: createColoredVariant(secondary),
      success: createColoredVariant(success),
      warning: createColoredVariant(warning),
      danger: createColoredVariant(danger),
      info: createColoredVariant(info),
    },
    sizes: {
      sm: {
        height: "h-auto",
        minHeight: "min-h-[70px]",
        fontSize: "text-sm",
        paddingX: "px-3",
        paddingY: "py-1.5",
        dropdownMaxHeight: "max-h-[200px]",
      },
      md: {
        height: "h-auto",
        minHeight: "min-h-[80px]",
        fontSize: "text-base",
        paddingX: "px-4",
        paddingY: "py-2",
        dropdownMaxHeight: "max-h-[300px]",
      },
      lg: {
        height: "h-auto",
        minHeight: "min-h-[100px]",
        fontSize: "text-lg",
        paddingX: "px-4",
        paddingY: "py-3",
        dropdownMaxHeight: "max-h-[400px]",
      },
    },
  };
}
