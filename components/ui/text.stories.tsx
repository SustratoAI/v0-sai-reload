import { Text, type TextProps } from "./text"

export default {
  title: "UI/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "heading", "subheading", "title", "subtitle", "label", "caption", "muted"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"],
    },
    weight: {
      control: "select",
      options: ["normal", "medium", "semibold", "bold"],
    },
    align: {
      control: "select",
      options: ["left", "center", "right", "justify"],
    },
    as: {
      control: "select",
      options: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span", "div"],
    },
    truncate: {
      control: "boolean",
    },
    gradient: {
      control: "boolean",
    },
  },
}

const Template = (args: TextProps) => <Text {...args} />

export const Default = Template.bind({})
Default.args = {
  children: "Este es un texto de ejemplo",
  variant: "default",
}

export const Heading = Template.bind({})
Heading.args = {
  children: "Este es un encabezado",
  variant: "heading",
  as: "h1",
}

export const Subheading = Template.bind({})
Subheading.args = {
  children: "Este es un subencabezado",
  variant: "subheading",
  as: "h2",
}

export const Title = Template.bind({})
Title.args = {
  children: "Este es un título",
  variant: "title",
  as: "h3",
}

export const Subtitle = Template.bind({})
Subtitle.args = {
  children: "Este es un subtítulo",
  variant: "subtitle",
}

export const Label = Template.bind({})
Label.args = {
  children: "Esta es una etiqueta",
  variant: "label",
}

export const Caption = Template.bind({})
Caption.args = {
  children: "Este es un texto de pie de foto",
  variant: "caption",
}

export const Muted = Template.bind({})
Muted.args = {
  children: "Este es un texto atenuado",
  variant: "muted",
}

export const Gradient = Template.bind({})
Gradient.args = {
  children: "Este es un texto con gradiente",
  variant: "heading",
  gradient: true,
  size: "4xl",
}

export const Truncated = Template.bind({})
Truncated.args = {
  children:
    "Este es un texto muy largo que será truncado cuando alcance el final del contenedor y se mostrará con puntos suspensivos",
  truncate: true,
  className: "max-w-xs",
}

export const AllVariants = () => (
  <div className="space-y-4">
    <Text variant="heading" as="h1">
      Heading (h1)
    </Text>
    <Text variant="subheading" as="h2">
      Subheading (h2)
    </Text>
    <Text variant="title" as="h3">
      Title (h3)
    </Text>
    <Text variant="subtitle">Subtitle</Text>
    <Text variant="default">Default text</Text>
    <Text variant="label">Label</Text>
    <Text variant="caption">Caption</Text>
    <Text variant="muted">Muted text</Text>
  </div>
)

export const AllSizes = () => (
  <div className="space-y-2">
    <Text size="xs">Tamaño xs</Text>
    <Text size="sm">Tamaño sm</Text>
    <Text size="base">Tamaño base</Text>
    <Text size="lg">Tamaño lg</Text>
    <Text size="xl">Tamaño xl</Text>
    <Text size="2xl">Tamaño 2xl</Text>
    <Text size="3xl">Tamaño 3xl</Text>
    <Text size="4xl">Tamaño 4xl</Text>
    <Text size="5xl">Tamaño 5xl</Text>
  </div>
)

export const AllWeights = () => (
  <div className="space-y-2">
    <Text weight="normal">Peso normal</Text>
    <Text weight="medium">Peso medium</Text>
    <Text weight="semibold">Peso semibold</Text>
    <Text weight="bold">Peso bold</Text>
  </div>
)

export const AllAlignments = () => (
  <div className="space-y-4">
    <Text align="left" className="border p-2">
      Alineado a la izquierda
    </Text>
    <Text align="center" className="border p-2">
      Alineado al centro
    </Text>
    <Text align="right" className="border p-2">
      Alineado a la derecha
    </Text>
    <Text align="justify" className="border p-2">
      Texto justificado. Este es un párrafo más largo para demostrar cómo funciona la justificación. El texto se
      distribuye uniformemente entre los márgenes izquierdo y derecho, creando un borde limpio en ambos lados. Esto es
      común en periódicos, revistas y libros.
    </Text>
  </div>
)
