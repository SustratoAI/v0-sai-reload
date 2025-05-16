import { Text } from "@/components/ui/text"

export default function SustratoDemo() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6">Demostración del Tema Sustrato</h1>

      <div className="grid gap-8">
        <section>
          <h2 className="mb-4">Encabezados con Chau Philomene One</h2>
          <div className="space-y-4">
            <h1>Encabezado H1 con Chau Philomene One</h1>
            <h2>Encabezado H2 con Chau Philomene One</h2>
            <h3>Encabezado H3 con Chau Philomene One</h3>
            <h4>Encabezado H4 con Chau Philomene One</h4>
            <h5>Encabezado H5 con Chau Philomene One</h5>
            <h6>Encabezado H6 con Chau Philomene One</h6>
          </div>
        </section>

        <section>
          <h2 className="mb-4">Texto con Work Sans</h2>
          <div className="space-y-4">
            <p className="text-lg">
              Este es un párrafo con la fuente Work Sans. Work Sans es una fuente sans-serif geométrica con excelente
              legibilidad que complementa muy bien el estilo distintivo de Chau Philomene One.
            </p>
            <p>
              Work Sans tiene un diseño limpio y moderno que funciona bien tanto para textos largos como para interfaces
              de usuario. Su estructura geométrica sutil proporciona un buen contraste con los encabezados más
              distintivos de Chau Philomene One.
            </p>
            <p className="text-sm">
              También funciona bien en tamaños más pequeños, manteniendo su legibilidad y claridad. Esta combinación de
              fuentes crea una jerarquía visual clara y atractiva.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4">Componentes de Texto</h2>
          <div className="space-y-4">
            <Text variant="h1">Texto variante h1</Text>
            <Text variant="h2">Texto variante h2</Text>
            <Text variant="h3">Texto variante h3</Text>
            <Text variant="p" size="lg">
              Texto variante párrafo grande
            </Text>
            <Text variant="p">Texto variante párrafo normal</Text>
            <Text variant="p" size="sm">
              Texto variante párrafo pequeño
            </Text>
          </div>
        </section>
      </div>
    </div>
  )
}
