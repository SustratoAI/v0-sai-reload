"use client"

import { Simple } from "@/components/Simple/simple"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Text } from "@/components/ui/text"

export default function ShowroomSimple() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Showroom Simple</h1>

      <Tabs defaultValue="props" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="props">Con Props</TabsTrigger>
          <TabsTrigger value="children">Con Children</TabsTrigger>
          <TabsTrigger value="textcontent">TextContent</TabsTrigger>
        </TabsList>

        <TabsContent value="props" className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Simple con texto como props</h2>

          <Simple>
            <Simple.Section text="Este es un componente extremadamente simple" />
          </Simple>

          <Simple>
            <Simple.Section text="Solo tiene un componente padre y una sección" />
            <Simple.Section text="Puedes añadir múltiples secciones si quieres" />
          </Simple>

          <Simple>
            <Simple.Section text="Usa el componente Text para renderizar texto" />
          </Simple>
        </TabsContent>

        <TabsContent value="children" className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Simple con children</h2>

          <Simple>
            <Simple.Content>
              <Text variant="default">Este contenido se pasa como children</Text>
            </Simple.Content>
          </Simple>

          <Simple>
            <Simple.Content>
              <Text variant="default">Puedes pasar cualquier componente como children</Text>
            </Simple.Content>
            <Simple.Content>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-blue-500"></span>
                <Text variant="default">Incluso elementos más complejos</Text>
              </div>
            </Simple.Content>
          </Simple>

          <Simple>
            <Simple.Content>
              <Text variant="heading" size="lg">
                Títulos
              </Text>
              <Text variant="default" className="mt-2">
                Y párrafos de texto normal
              </Text>
            </Simple.Content>
          </Simple>
        </TabsContent>

        <TabsContent value="textcontent" className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Simple con TextContent</h2>

          <Simple>
            <Simple.TextContent>
              Este componente recibe el texto como children y usa Text internamente
            </Simple.TextContent>
          </Simple>

          <Simple>
            <Simple.TextContent variant="heading" size="lg">
              Puedes personalizar la variante
            </Simple.TextContent>
            <Simple.TextContent color="primary">Y también el color</Simple.TextContent>
          </Simple>

          <Simple>
            <Simple.TextContent variant="heading" color="primary">
              Título con gradiente
            </Simple.TextContent>
            <Simple.TextContent variant="subheading" color="secondary">
              Subtítulo personalizado
            </Simple.TextContent>
            <Simple.TextContent>Y texto normal para el contenido</Simple.TextContent>
          </Simple>
        </TabsContent>
      </Tabs>
    </div>
  )
}
