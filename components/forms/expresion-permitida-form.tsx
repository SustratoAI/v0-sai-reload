"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  crearExpresionPermitida,
  actualizarExpresionPermitida,
  type ExpresionPermitida,
} from "@/app/actions/expresiones-permitidas-actions"
import { toast } from "sonner"

const expresionPermitidaSchema = z.object({
  expresion_original: z.string().min(1, {
    message: "La expresión original es obligatoria",
  }),
  normalizaciones_esperadas_text: z.string().min(1, {
    message: "Debes ingresar al menos una normalización esperada",
  }),
  es_permitida_como_normalizacion: z.boolean().default(false),
  idioma: z.string().min(1, {
    message: "Debes seleccionar un idioma",
  }),
})

type ExpresionPermitidaFormValues = z.infer<typeof expresionPermitidaSchema>

interface ExpresionPermitidaFormProps {
  expresion?: ExpresionPermitida
}

export function ExpresionPermitidaForm({ expresion }: ExpresionPermitidaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const isEditing = !!expresion

  const form = useForm<ExpresionPermitidaFormValues>({
    resolver: zodResolver(expresionPermitidaSchema),
    defaultValues: {
      expresion_original: expresion?.expresion_original || "",
      normalizaciones_esperadas_text: expresion?.normalizaciones_esperadas
        ? expresion.normalizaciones_esperadas.join(", ")
        : "",
      es_permitida_como_normalizacion: expresion?.es_permitida_como_normalizacion || false,
      idioma: expresion?.idioma || "es-ES",
    },
  })

  async function onSubmit(data: ExpresionPermitidaFormValues) {
    setIsSubmitting(true)
    try {
      // Convertir el texto de normalizaciones a un array
      const normalizaciones_esperadas = data.normalizaciones_esperadas_text
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)

      const expresionData = {
        expresion_original: data.expresion_original,
        normalizaciones_esperadas,
        es_permitida_como_normalizacion: data.es_permitida_como_normalizacion,
        idioma: data.idioma,
      }

      let result

      if (isEditing && expresion) {
        result = await actualizarExpresionPermitida(expresion.id!, expresionData)
      } else {
        result = await crearExpresionPermitida(expresionData)
      }

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(
          isEditing ? "Expresi��n permitida actualizada correctamente" : "Expresión permitida creada correctamente",
        )
        router.push("/configuracion/expresiones-permitidas")
        router.refresh()
      }
    } catch (error) {
      toast.error(isEditing ? "Error al actualizar la expresión" : "Error al crear la expresión")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="expresion_original"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expresión Original</FormLabel>
              <FormControl>
                <Input placeholder="sí" {...field} />
              </FormControl>
              <FormDescription>
                Texto original corto que debe ser normalizado (ej: "sí", "no", "hmm", etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="normalizaciones_esperadas_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Normalizaciones Esperadas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Afirmación, Respuesta afirmativa, Confirma"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Lista de posibles normalizaciones separadas por comas (ej: "Afirmación, Respuesta afirmativa, Confirma")
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idioma"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idioma</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un idioma" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="es-ES">Español (España)</SelectItem>
                  <SelectItem value="es-MX">Español (México)</SelectItem>
                  <SelectItem value="es-CL">Español (Chile)</SelectItem>
                  <SelectItem value="en-US">Inglés (Estados Unidos)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Idioma al que aplica esta expresión. Cada variante de idioma se trata como un idioma separado.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="es_permitida_como_normalizacion"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Permitida como normalización</FormLabel>
                <FormDescription>
                  Si está marcado, esta expresión puede usarse directamente como texto normalizado sin cambios (ej:
                  "Fin.")
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/configuracion/expresiones-permitidas")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Expresión" : "Guardar Expresión"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
