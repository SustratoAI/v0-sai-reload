"use client"

import { GradientStrokeElement } from "@/components/ui/gradient-stroke-element"
import { Text } from "@/components/ui/text"

export default function GradientStrokeShowroom() {
  return (
    <div className="container mx-auto py-12 space-y-12">
      <div className="text-center mb-8">
        <Text as="h1" variant="heading" size="3xl" className="mb-4">
          Elementos con Gradiente y Contorno Inverso
        </Text>
        <Text variant="subheading" size="lg" className="max-w-2xl mx-auto">
          Demostración de elementos con gradiente de relleno y contorno inverso para resaltar formas internas
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ejemplos básicos con diferentes variantes */}
        <GradientStrokeElement variant="primary" className="aspect-square">
          <Text as="h3" variant="heading" size="xl" className="text-white">
            Primario
          </Text>
        </GradientStrokeElement>

        <GradientStrokeElement variant="secondary" className="aspect-square">
          <Text as="h3" variant="heading" size="xl" className="text-white">
            Secundario
          </Text>
        </GradientStrokeElement>

        <GradientStrokeElement variant="accent" className="aspect-square">
          <Text as="h3" variant="heading" size="xl" className="text-white">
            Acento
          </Text>
        </GradientStrokeElement>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ejemplos con diferentes grosores de contorno */}
        <GradientStrokeElement variant="success" strokeWidth={1} className="aspect-square">
          <Text as="h3" variant="heading" size="xl" className="text-white">
            Contorno 1px
          </Text>
        </GradientStrokeElement>

        <GradientStrokeElement variant="success" strokeWidth={4} className="aspect-square">
          <Text as="h3" variant="heading" size="xl" className="text-white">
            Contorno 4px
          </Text>
        </GradientStrokeElement>

        <GradientStrokeElement variant="success" strokeWidth={8} className="aspect-square">
          <Text as="h3" variant="heading" size="xl" className="text-white">
            Contorno 8px
          </Text>
        </GradientStrokeElement>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ejemplos con diferentes bordes redondeados */}
        <GradientStrokeElement variant="warning" rounded="sm" className="aspect-square">
          <Text as="h3" variant="heading" size="xl" className="text-white">
            Borde SM
          </Text>
        </GradientStrokeElement>

        <GradientStrokeElement variant="warning" rounded="lg" className="aspect-square">
          <Text as="h3" variant="heading" size="xl" className="text-white">
            Borde LG
          </Text>
        </GradientStrokeElement>

        <GradientStrokeElement variant="warning" rounded="full" className="aspect-square">
          <Text as="h3" variant="heading" size="xl" className="text-white">
            Borde Circular
          </Text>
        </GradientStrokeElement>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Comparación de contorno inverso vs no inverso */}
        <GradientStrokeElement variant="danger" inverseStroke={true} className="aspect-square">
          <Text as="h3" variant="heading" size="xl" className="text-white">
            Contorno Inverso
          </Text>
        </GradientStrokeElement>

        <GradientStrokeElement variant="danger" inverseStroke={false} className="aspect-square">
          <Text as="h3" variant="heading" size="xl" className="text-white">
            Contorno No Inverso
          </Text>
        </GradientStrokeElement>
      </div>

      {/* Ejemplo de botón con este efecto */}
      <div className="flex justify-center mt-12">
        <GradientStrokeElement
          variant="primary"
          strokeWidth={3}
          rounded="full"
          className="px-8 py-2 h-auto cursor-pointer hover:scale-105 transition-transform"
        >
          <Text as="span" variant="heading" size="lg" className="text-white">
            Botón con Gradiente y Contorno
          </Text>
        </GradientStrokeElement>
      </div>
    </div>
  )
}
