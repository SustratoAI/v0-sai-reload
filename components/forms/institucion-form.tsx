"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { crearInstitucion } from "@/app/actions/instituciones-actions"

export default function InstitucionForm() {
  const router = useRouter()
  const [codigo, setCodigo] = useState("")
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Estado para rastrear qué campo está enfocado
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      if (!codigo || !nombre) {
        throw new Error("El código y el nombre son obligatorios")
      }

      if (codigo.length > 2) {
        throw new Error("El código debe tener máximo 2 caracteres")
      }

      await crearInstitucion({
        codigo,
        nombre,
        descripcion,
      })

      router.push("/instituciones")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la institución")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Nueva Institución</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="codigo" className="text-base font-medium mb-2 block">
                Código
              </label>
              <Input
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                maxLength={2}
                leadingIcon={<Building className="h-5 w-5" />}
                hint="Código de 2 caracteres para identificar la institución"
                showCharacterCount
                onFocus={() => setFocusedField("codigo")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div>
              <label htmlFor="nombre" className="text-base font-medium mb-2 block">
                Nombre
              </label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                hint="Nombre completo de la institución"
                onFocus={() => setFocusedField("nombre")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="descripcion" className="text-base font-medium mb-2 block">
              Descripción
            </label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción de la institución y su misión..."
              className="min-h-[150px]"
              hint="Información adicional sobre la institución (opcional)"
              onFocus={() => setFocusedField("descripcion")}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/instituciones")} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
