"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { crearFundacion, actualizarFundacion } from "@/app/actions/fundaciones-actions"
import { toast } from "sonner"
import type { Fundacion } from "@/types/supabase"
import { Building2 } from "lucide-react"

// Definimos un estilo personalizado para los labels que cambian de color con foco
const labelStyles = `
.custom-form-item:focus-within .custom-form-label {
  color: hsl(var(--primary));
}

/* Ocultar los mensajes de error que vienen del FormMessage */
.hide-form-message {
  display: none !important;
}
`

const fundacionSchema = z.object({
  codigo: z
    .string()
    .length(2, {
      message: "El código debe tener exactamente 2 caracteres",
    })
    .toUpperCase(),
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  descripcion: z.string().optional(),
})

type FundacionFormValues = z.infer<typeof fundacionSchema>

interface FundacionFormProps {
  fundacion?: Fundacion
}

export function FundacionForm({ fundacion }: FundacionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const router = useRouter()
  const isEditing = !!fundacion

  const form = useForm<FundacionFormValues>({
    resolver: zodResolver(fundacionSchema),
    defaultValues: {
      codigo: fundacion?.codigo || "",
      nombre: fundacion?.nombre || "",
      descripcion: fundacion?.descripcion || "",
    },
    mode: "onChange", // Validar al cambiar para mejor UX
  })

  // Obtener los errores del formulario
  const formErrors = form.formState.errors

  async function onSubmit(data: FundacionFormValues) {
    setFormSubmitted(true)
    setIsSubmitting(true)
    try {
      let result

      if (isEditing && fundacion) {
        result = await actualizarFundacion(fundacion.id, data)
      } else {
        result = await crearFundacion(data)
      }

      if (result.error) {
        toast.error(result.error)
        setIsSubmitting(false)
      } else {
        toast.success(isEditing ? "Institución actualizada correctamente" : "Institución creada correctamente")

        // Intentamos la redirección con el router de Next.js
        try {
          // Usamos setTimeout para dar tiempo al toast para mostrarse
          setTimeout(() => {
            router.push("/fundaciones")
          }, 800)
        } catch (e) {
          console.error("Error en router.push:", e)
          // Como fallback, usamos window.location
          setTimeout(() => {
            window.location.href = "/fundaciones"
          }, 1000)
        }
      }
    } catch (error) {
      toast.error(isEditing ? "Error al actualizar la institución" : "Error al crear la institución")
      console.error(error)
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Inyectamos los estilos CSS personalizados */}
      <style jsx global>
        {labelStyles}
      </style>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem className="custom-form-item">
                  <FormLabel className="custom-form-label">Código</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="FR"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      maxLength={2}
                      showCharacterCount
                      error={formErrors.codigo?.message}
                      isEditing={isEditing}
                      leadingIcon={<Building2 className="h-4 w-4" />}
                    />
                  </FormControl>
                  <FormDescription>Código de 2 caracteres para identificar la institución</FormDescription>
                  {/* Ocultamos el FormMessage */}
                  <div className="hide-form-message">{formErrors.codigo?.message}</div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem className="custom-form-item">
                  <FormLabel className="custom-form-label">Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Las Rosas"
                      {...field}
                      error={formErrors.nombre?.message}
                      isEditing={isEditing}
                    />
                  </FormControl>
                  <FormDescription>Nombre completo de la institución</FormDescription>
                  {/* Ocultamos el FormMessage */}
                  <div className="hide-form-message">{formErrors.nombre?.message}</div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem className="custom-form-item">
                <FormLabel className="custom-form-label">Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descripción de la institución y su misión..."
                    className="min-h-[120px]"
                    {...field}
                    error={formErrors.descripcion?.message}
                    isEditing={isEditing}
                    showCharacterCount
                  />
                </FormControl>
                <FormDescription>Información adicional sobre la institución (opcional)</FormDescription>
                {/* Ocultamos el FormMessage */}
                <div className="hide-form-message">{formErrors.descripcion?.message}</div>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/fundaciones")} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Institución" : "Guardar Institución"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
