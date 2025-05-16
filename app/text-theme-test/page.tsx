"use client";
import { ProCard } from "@/components/ui/pro-card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/app/theme-provider";
import { useDarkModeText } from "@/hooks/use-dark-mode-text";

export default function TextThemeTestPage() {
  const { setMode, mode } = useTheme();
  const isDark = mode === "dark";

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  // Usar nuestro hook para adaptar los colores en modo oscuro
  const primaryOptions = useDarkModeText({ color: "primary" });
  const secondaryOptions = useDarkModeText({ color: "secondary" });
  const tertiaryOptions = useDarkModeText({ color: "tertiary" });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prueba de Texto en ProCards</h1>
        <Button onClick={toggleTheme}>
          Cambiar a tema {mode === "dark" ? "claro" : "oscuro"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ProCard Neutral */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">ProCard Neutral</h2>
          <ProCard variant="neutral" className="p-6">
            <div className="space-y-6">
              <div>
                <Text as="h3" size="lg" weight="semibold" className="mb-2">
                  Variantes de Color Primary
                </Text>
                <div className="space-y-3 pl-4">
                  <Text color="primary" colorVariant="pure">
                    Primary Pure - Universidad Católica de Chile
                  </Text>
                  <Text color="primary">
                    Primary Text (default) - Universidad Católica de Chile
                  </Text>
                  <Text color="primary" colorVariant="dark">
                    Primary Dark - Universidad Católica de Chile
                  </Text>
                  <Text gradient="primary">
                    Primary Gradient - Universidad Católica de Chile
                  </Text>
                </div>
              </div>

              <div>
                <Text as="h3" size="lg" weight="semibold" className="mb-2">
                  Variantes de Color Secondary
                </Text>
                <div className="space-y-3 pl-4">
                  <Text color="secondary" colorVariant="pure">
                    Secondary Pure - Escuela de Trabajo Social
                  </Text>
                  <Text color="secondary">
                    Secondary Text (default) - Escuela de Trabajo Social
                  </Text>
                  <Text color="secondary" colorVariant="dark">
                    Secondary Dark - Escuela de Trabajo Social
                  </Text>
                  <Text gradient="secondary">
                    Secondary Gradient - Escuela de Trabajo Social
                  </Text>
                </div>
              </div>
            </div>
          </ProCard>
        </div>

        {/* ProCard White */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">ProCard White</h2>
          <ProCard variant="white" className="p-6">
            <div className="space-y-6">
              <div>
                <Text as="h3" size="lg" weight="semibold" className="mb-2">
                  Variantes de Color Tertiary
                </Text>
                <div className="space-y-3 pl-4">
                  <Text color="tertiary" colorVariant="pure">
                    Tertiary Pure - Ayudas Técnicas
                  </Text>
                  <Text color="tertiary">
                    Tertiary Text (default) - Ayudas Técnicas
                  </Text>
                  <Text color="tertiary" colorVariant="dark">
                    Tertiary Dark - Ayudas Técnicas
                  </Text>
                  <Text gradient="tertiary">
                    Tertiary Gradient - Ayudas Técnicas
                  </Text>
                </div>
              </div>

              <div>
                <Text as="h3" size="lg" weight="semibold" className="mb-2">
                  Ejemplo Completo
                </Text>
                <div className="space-y-3 pl-4">
                  <Text
                    color="primary"
                    colorVariant="pure"
                    size="xl"
                    weight="bold"
                    className="uppercase"
                  >
                    Universidad Católica de Chile
                  </Text>
                  <Text gradient="primary" size="4xl" weight="bold">
                    Ayudas Técnicas
                  </Text>
                  <Text gradient="secondary" size="2xl">
                    Escuela de Trabajo Social
                  </Text>
                </div>
              </div>
            </div>
          </ProCard>
        </div>
      </div>

      {/* ProCards con bordes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">ProCards con Bordes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProCard variant="neutral" border="normal" className="p-6">
            <Text as="h3" size="lg" weight="semibold" className="mb-4">
              ProCard Neutral con Borde Normal
            </Text>
            <Text gradient="primary" size="xl">
              Ayudas Técnicas
            </Text>
            <Text color="secondary" className="mt-2">
              Este es un ejemplo de texto en una ProCard neutral con borde
              normal.
            </Text>
          </ProCard>

          <ProCard variant="white" border="left" className="p-6">
            <Text as="h3" size="lg" weight="semibold" className="mb-4">
              ProCard White con Borde Izquierdo
            </Text>
            <Text gradient="secondary" size="xl">
              Escuela de Trabajo Social
            </Text>
            <Text color="tertiary" className="mt-2">
              Este es un ejemplo de texto en una ProCard blanca con borde
              izquierdo.
            </Text>
          </ProCard>
        </div>
      </div>

      {/* Comparación con/sin adaptación */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Comparación: Con/Sin Adaptación para Modo Oscuro
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProCard variant="neutral" className="p-6">
            <Text as="h3" size="lg" weight="semibold" className="mb-4">
              Con Adaptación (Por defecto)
            </Text>
            <div className="space-y-3">
              <Text color="primary" colorVariant="pure">
                Primary Pure
              </Text>
              <Text color="primary">Primary Text</Text>
              <Text color="primary" colorVariant="dark">
                Primary Dark
              </Text>
              <Text color="secondary">Secondary Text</Text>
              <Text color="tertiary">Tertiary Text</Text>
              <Text gradient="primary">Primary Gradient</Text>
              <Text gradient="secondary">Secondary Gradient</Text>
            </div>
          </ProCard>

          <ProCard variant="neutral" className="p-6">
            <Text as="h3" size="lg" weight="semibold" className="mb-4">
              Sin Adaptación
            </Text>
            <div className="space-y-3">
              <Text color="primary" colorVariant="pure" adaptToDarkMode={false}>
                Primary Pure
              </Text>
              <Text color="primary" adaptToDarkMode={false}>
                Primary Text
              </Text>
              <Text color="primary" colorVariant="dark" adaptToDarkMode={false}>
                Primary Dark
              </Text>
              <Text color="secondary" adaptToDarkMode={false}>
                Secondary Text
              </Text>
              <Text color="tertiary" adaptToDarkMode={false}>
                Tertiary Text
              </Text>
              <Text gradient="primary" adaptToDarkMode={false}>
                Primary Gradient
              </Text>
              <Text gradient="secondary" adaptToDarkMode={false}>
                Secondary Gradient
              </Text>
            </div>
          </ProCard>
        </div>
      </div>
    </div>
  );
}
