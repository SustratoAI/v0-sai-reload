"use client"

import { Text } from "@/components/ui/text"
import { useTheme } from "@/app/theme-provider"
import { Button } from "@/components/ui/button"
import { PageBackground } from "@/components/ui/page-background"
import { PageWrapper } from "@/components/ui/page-wrapper"

export default function TextColorTestPage() {
  const { colorScheme, setColorScheme, mode, setMode } = useTheme()

  return (
    <PageWrapper>
      <PageBackground variant="gradient" />
      <div className="container mx-auto py-8">
        <div className="mb-8 flex flex-wrap gap-2">
          <Button onClick={() => setColorScheme("blue")}>Tema Azul</Button>
          <Button onClick={() => setColorScheme("green")}>Tema Verde</Button>
          <Button onClick={() => setColorScheme("orange")}>Tema Naranja</Button>
          <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
            Modo {mode === "light" ? "Oscuro" : "Claro"}
          </Button>
        </div>

        <div className="grid gap-8">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Colores de Texto por Variante</h2>
            <div className="grid gap-4">
              <Text variant="default">Texto Default</Text>
              <Text variant="heading">Texto Heading</Text>
              <Text variant="subheading">Texto Subheading</Text>
              <Text variant="title">Texto Title (Primary)</Text>
              <Text variant="subtitle">Texto Subtitle (Secondary)</Text>
              <Text variant="label">Texto Label</Text>
              <Text variant="caption">Texto Caption (Muted)</Text>
              <Text variant="muted">Texto Muted</Text>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Colores de Texto Explícitos</h2>
            <div className="grid gap-4">
              <Text color="default">Color Default</Text>
              <Text color="primary">Color Primary</Text>
              <Text color="secondary">Color Secondary</Text>
              <Text color="tertiary">Color Tertiary</Text>
              <Text color="accent">Color Accent</Text>
              <Text color="success">Color Success</Text>
              <Text color="warning">Color Warning</Text>
              <Text color="danger">Color Danger</Text>
              <Text color="muted">Color Muted</Text>
              <Text color="neutral">Color Neutral</Text>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Variantes de Color</h2>
            <div className="grid gap-4">
              <Text color="primary" colorVariant="pure">
                Primary Pure
              </Text>
              <Text color="primary" colorVariant="text">
                Primary Text
              </Text>
              <Text color="primary" colorVariant="dark">
                Primary Dark
              </Text>

              <Text color="secondary" colorVariant="pure">
                Secondary Pure
              </Text>
              <Text color="secondary" colorVariant="text">
                Secondary Text
              </Text>
              <Text color="secondary" colorVariant="dark">
                Secondary Dark
              </Text>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Gradientes de Texto</h2>
            <div className="grid gap-4">
              <Text gradient>Gradiente Default (Primary)</Text>
              <Text gradient="primary">Gradiente Primary</Text>
              <Text gradient="secondary">Gradiente Secondary</Text>
              <Text gradient="tertiary">Gradiente Tertiary</Text>
              <Text gradient="accent">Gradiente Accent</Text>
              <Text gradient="success">Gradiente Success</Text>
              <Text gradient="warning">Gradiente Warning</Text>
              <Text gradient="danger">Gradiente Danger</Text>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
