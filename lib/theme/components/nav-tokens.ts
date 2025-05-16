import colors from "../colors"
import type { ColorScheme, Mode } from "../color-tokens"
import tinycolor from "tinycolor2"

export interface NavbarTokens {
  logo: {
    primary: string
    secondary: string
    accent: string
    titleGradient: string // Nuevo token para el degradado del título
  }
  gradientBar: {
    start: string
    middle: string
    end: string
  }
  hover: {
    bg: string
  }
  active: {
    bg: string
  }
  background: {
    normal: string
    scrolled: string
  }
  submenu: {
    background: string
    border: string
  }
  icon: {
    default: string
    active: string
    arrow: string
  }
  shadow: string
}

/**
 * Ajusta el color para mejorar el contraste en modo oscuro
 * @param color Color base
 * @param isDark Si estamos en modo oscuro
 * @param factor Factor de ajuste de luminosidad
 */
function adjustColorForContrast(color: string, isDark: boolean, factor = 0.2): string {
  if (!isDark) return color

  const tColor = tinycolor(color)
  // Si ya es muy luminoso en modo oscuro, lo dejamos como está
  if (tColor.getLuminance() > 0.6) return color

  // Aumentamos la luminosidad para mejor contraste en modo oscuro
  return tColor.lighten(factor * 100).toString()
}

/**
 * Crea un color de fondo oscuro con un sutil tinte del color del tema
 * @param baseColor Color base del tema
 * @returns Color oscuro con tinte
 */
function createThemedDarkBackground(baseColor: string): string {
  const color = tinycolor(baseColor)
  // Oscurecer significativamente el color pero mantener un sutil tinte
  return color.setAlpha(0.15).darken(75).toRgbString()
}

export const generateNavbarTokens = (colorScheme: ColorScheme, mode: Mode): NavbarTokens => {
  const isDark = mode === "dark"
  const theme = colors.themes[colorScheme] || colors.themes["blue"]
  const semantic = colors.semantic
  const neutral = colors.neutral

  // Colores básicos
  const whiteColor = neutral.white
  const grayColor = isDark ? neutral.gray[800] : neutral.gray[100]
  const borderColor = isDark ? neutral.gray[700] : neutral.gray[200]

  // Colores primarios con ajuste de contraste para modo oscuro
  const primaryColor = isDark ? adjustColorForContrast(theme.primary.pureDark, isDark) : theme.primary.pure

  const accentColor = isDark ? adjustColorForContrast(semantic.accent.pureDark, isDark) : semantic.accent.pure
  const secondaryColor = isDark ? adjustColorForContrast(theme.secondary.pureDark, isDark) : theme.secondary.pure

  const tertiaryColor = isDark ? adjustColorForContrast(theme.tertiary.pureDark, isDark) : theme.tertiary.pure

  // Crear el degradado específico para el título del logo
  const titleGradient = `linear-gradient(to right, ${primaryColor}, ${accentColor})`

  // Crear un fondo oscuro con un sutil tinte del color primario del tema
  const themedDarkBackground = createThemedDarkBackground(theme.primary.pure)

  return {
    logo: {
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor,
      titleGradient: titleGradient, // Nuevo token para el degradado del título
    },
    gradientBar: {
      start: primaryColor,
      middle: accentColor,
      // En modo oscuro, usamos un color más suave para el final del gradiente
      end: isDark ? neutral.gray[700] : whiteColor,
    },
    hover: {
      // Más visible en modo oscuro, usando color accent para el hover
      bg: isDark ? `${accentColor}22` : `${accentColor}15`,
    },
    active: {
      // Más visible en modo oscuro
      bg: isDark ? `${primaryColor}33` : `${theme.primary.pure}15`,
    },
    background: {
      normal: "transparent",
      // Usar un fondo oscuro con tinte del color del tema
      scrolled: isDark ? themedDarkBackground : `${whiteColor}DD`,
    },
    submenu: {
      background: isDark ? neutral.gray[800] : whiteColor,
      border: borderColor,
    },
    icon: {
      default: tertiaryColor,
      // Cambiar a secondaryColor en lugar de accentColor
      active: secondaryColor,
      arrow: tertiaryColor,
    },
    // Sombra más sutil en modo oscuro
    shadow: isDark ? "0 4px 8px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  }
}
