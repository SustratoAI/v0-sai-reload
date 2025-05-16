"use client"

import * as React from "react"
import { Label } from "./label"
import { cn } from "@/lib/utils"
import { Text } from "./text"

interface FormFieldProps {
  label: string
  htmlFor: string
  className?: string
  children: React.ReactNode
  hint?: string
  error?: string
}

export function FormField({ label, htmlFor, className, children, hint, error }: FormFieldProps) {
  const [isFocused, setIsFocused] = React.useState(false)

  // Usamos un ID único para el contenedor
  const containerId = React.useMemo(() => `form-field-${htmlFor}`, [htmlFor])

  // Efecto para manejar el focus usando eventos a nivel de documento
  React.useEffect(() => {
    const handleFocusChange = (e: FocusEvent) => {
      const container = document.getElementById(containerId)
      if (!container) return

      // Verificamos si el elemento enfocado está dentro de nuestro contenedor
      if (container.contains(e.target as Node)) {
        console.log(`Focus detected in container for: ${htmlFor}`)
        setIsFocused(true)
      } else if (isFocused) {
        console.log(`Focus lost from container for: ${htmlFor}`)
        setIsFocused(false)
      }
    }

    // Agregamos listeners para capturar focus y blur en todo el documento
    document.addEventListener("focusin", handleFocusChange)
    document.addEventListener("focusout", handleFocusChange)

    return () => {
      document.removeEventListener("focusin", handleFocusChange)
      document.removeEventListener("focusout", handleFocusChange)
    }
  }, [containerId, htmlFor, isFocused])

  // Clonamos el hijo para asignarle el ID correcto
  const childrenWithId = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        id: htmlFor,
        ...child.props,
      })
    }
    return child
  })

  return (
    <div id={containerId} className={cn("space-y-2", className)}>
      <div>
        <Text variant="label" color={isFocused ? "primary" : "neutral"} colorVariant={isFocused ? "pure" : "text"}>
          <Label htmlFor={htmlFor}>{label}</Label>
        </Text>
      </div>
      {childrenWithId}
      {hint && !error && (
        <Text variant="caption" color="neutral" colorVariant="text">
          {hint}
        </Text>
      )}
      {error && (
        <Text variant="caption" color="error" colorVariant="text">
          {error}
        </Text>
      )}
    </div>
  )
}
