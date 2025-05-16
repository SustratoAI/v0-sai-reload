import type React from "react"
import { Text } from "@/components/ui/text"

interface SimpleProps {
  children?: React.ReactNode
}

export const Simple = ({ children }: SimpleProps) => {
  return <div className="p-4 border rounded-md">{children}</div>
}

// Sección que recibe texto como prop
interface SimpleSectionProps {
  text: string
}

Simple.Section = function SimpleSection({ text }: SimpleSectionProps) {
  return (
    <div className="py-2">
      <Text variant="default">{text}</Text>
    </div>
  )
}

// Contenido que recibe children
interface SimpleContentProps {
  children: React.ReactNode
}

Simple.Content = function SimpleContent({ children }: SimpleContentProps) {
  return <div className="py-2">{children}</div>
}

// TextContent que recibe texto como children y usa Text internamente
interface SimpleTextContentProps {
  children: React.ReactNode
  variant?: string
  size?: string
  color?: string
}

Simple.TextContent = function SimpleTextContent({
  children,
  variant = "default",
  size,
  color,
}: SimpleTextContentProps) {
  // Usamos Text internamente para renderizar el texto recibido como children
  return (
    <div className="py-2">
      <Text variant={variant} size={size} color={color}>
        {children}
      </Text>
    </div>
  )
}
