"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { crearEntrevistado, actualizarEntrevistado } from "@/app/actions/entrevistados-actions"
import { toast } from "sonner"
import type { Entrevistado, Fundacion } from "@/types/supabase"
import { Select } from "@/components/ui/select.sai"

const entrevistadoSchema = z.object({
  codigo: z
    .string()
    .length(2, {
      message: "El código debe tener exactamente 2 caracteres",
    })
    .toUpperCase(),
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  apellido: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres",
  }),
  cargo: z.string().optional(),
  fundacion_id: z.number({
    required_error: "Debes seleccionar una institución",
    invalid_type_error: "Debes seleccionar una institución",
  }),
  contacto: z.string().optional(),
  notas: z.string().optional(),
})

type EntrevistadoFormValues = z.infer<typeof entrevistadoSchema>

interface EntrevistadoFormProps {
  entrevistado?: Entrevistado
  fundaciones: Fundacion[]
}

export function EntrevistadoForm({ entrevistado, fundaciones }: EntrevistadoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const router = useRouter()
  const isEditing = !!entrevistado

  // Calcular la altura disponible para el select
  useEffect(() => {
    const calculateSelectHeight = () => {
      const viewportHeight = window.innerHeight
      const selectElements = document.querySelectorAll(".select-trigger")

      selectElements.forEach((selectEl) => {
        const rect = selectEl.getBoundingClientRect()
        const topPosition = rect.top
        const availableHeight = viewportHeight - topPosition - 40 // 40px de padding

        // Establecer una variable CSS personalizada con la altura disponible
        document.documentElement.style.setProperty(
          "--radix-select-content-available-height",
          `${Math.min(300, availableHeight)}px`,
        )
      })
    }

    // Calcular al montar y cuando cambie el tamaño de la ventana
    calculateSelectHeight()
    window.addEventListener("resize", calculateSelectHeight)

    return () => {
      window.removeEventListener("resize", calculateSelectHeight)
    }
  }, [])

  const form = useForm<EntrevistadoFormValues>({
    resolver: zodResolver(entrevistadoSchema),
    defaultValues: {
      codigo: entrevistado?.codigo || "",
      nombre: entrevistado?.nombre || "",
      apellido: entrevistado?.apellido || "",
      cargo: entrevistado?.cargo || "",
      fundacion_id: entrevistado?.fundacion_id || undefined,
      contacto: entrevistado?.contacto || "",
      notas: entrevistado?.notas || "",
    },
  })

  const formErrors = form.formState.errors

  async function onSubmit(data: EntrevistadoFormValues) {
    setIsSubmitting(true)
    setFormSubmitted(true)
    try {
      let result

      if (isEditing && entrevistado) {
        result = await actualizarEntrevistado(entrevistado.id, data)
      } else {
        result = await crearEntrevistado(data)
      }

      if (result.error) {
        toast.error(result.error)
        setIsSubmitting(false)
      } else {
        toast.success(isEditing ? "Entrevistado actualizado correctamente" : "Entrevistado creado correctamente")

        // Intentamos la redirección con el router de Next.js
        try {
          // Usamos setTimeout para dar tiempo al toast para mostrarse
          setTimeout(() => {
            router.push("/entrevistados")
            router.refresh()
          }, 800)
        } catch (e) {
          console.error("Error en router.push:", e)
          // Como fallback, usamos window.location
          setTimeout(() => {
            window.location.href = "/entrevistados"
          }, 1000)
        }
      }
    } catch (error) {
      toast.error(isEditing ? "Error al actualizar el entrevistado" : "Error al crear el entrevistado")
      console.error(error)
      setIsSubmitting(false)
    }
  }

  // Función para forzar la redirección en caso de problemas con el router
  const forceRedirect = (path: string) => {
    try {
      router.push(path)
      router.refresh()
    } catch (e) {
      console.error("Error en redirección:", e)
      window.location.href = path
    }
  }

  // Estilos para los labels con foco
  const labelStyles = `
    .custom-form-item:focus-within .custom-form-label {
      color: hsl(var(--primary));
    }
    
    /* Ocultar los mensajes de error que vienen del FormMessage */
    .hide-form-message {
      display: none !important;
    }
  `

  return (
    <>
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
                      placeholder="GS"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      maxLength={2}
                      showCharacterCount
                      error={formErrors.codigo?.message}
                      isEditing={isEditing}
                    />
                  </FormControl>
                  <FormDescription>Código de 2 caracteres para identificar al entrevistado</FormDescription>
                  {/* Ocultamos el FormMessage */}
                  <div className="hide-form-message">{formErrors.codigo?.message}</div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fundacion_id"
              render={({ field }) => (
                <FormItem className="custom-form-item">
                  <FormLabel className="custom-form-label">Institución</FormLabel>
                  <FormControl>
                    <Select
                      options={fundaciones.map((fundacion) => ({
                        value: fundacion.id.toString(),
                        label: `${fundacion.codigo} - ${fundacion.nombre}`,
                      }))}
                      value={field.value?.toString()}
                      onChange={(value) => field.onChange(Number.parseInt(value as string))}
                      placeholder="Selecciona una institución"
                      variant={formErrors.fundacion_id?.message ? "error" : isEditing ? "editing" : "default"}
                      error={formErrors.fundacion_id?.message}
                    />
                  </FormControl>
                  <FormDescription>Institución a la que pertenece el entrevistado</FormDescription>
                  {formErrors.fundacion_id?.message && (
                    <div className="text-xs text-red-500 mt-1">{formErrors.fundacion_id?.message}</div>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem className="custom-form-item">
                  <FormLabel className="custom-form-label">Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Gerardo" {...field} error={formErrors.nombre?.message} isEditing={isEditing} />
                  </FormControl>
                  <div className="hide-form-message">{formErrors.nombre?.message}</div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apellido"
              render={({ field }) => (
                <FormItem className="custom-form-item">
                  <FormLabel className="custom-form-label">Apellido</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Santibáñez"
                      {...field}
                      error={formErrors.apellido?.message}
                      isEditing={isEditing}
                    />
                  </FormControl>
                  <div className="hide-form-message">{formErrors.apellido?.message}</div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cargo"
            render={({ field }) => (
              <FormItem className="custom-form-item">
                <FormLabel className="custom-form-label">Cargo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Director Ejecutivo"
                    {...field}
                    error={formErrors.cargo?.message}
                    isEditing={isEditing}
                  />
                </FormControl>
                <FormDescription>Cargo o posición del entrevistado (opcional)</FormDescription>
                <div className="hide-form-message">{formErrors.cargo?.message}</div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contacto"
            render={({ field }) => (
              <FormItem className="custom-form-item">
                <FormLabel className="custom-form-label">Contacto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@ejemplo.com / +56 9 1234 5678"
                    {...field}
                    error={formErrors.contacto?.message}
                    isEditing={isEditing}
                  />
                </FormControl>
                <FormDescription>Información de contacto del entrevistado (opcional)</FormDescription>
                <div className="hide-form-message">{formErrors.contacto?.message}</div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notas"
            render={({ field }) => (
              <FormItem className="custom-form-item">
                <FormLabel className="custom-form-label">Notas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Notas adicionales sobre el entrevistado..."
                    className="min-h-[120px]"
                    {...field}
                    error={formErrors.notas?.message}
                    isEditing={isEditing}
                    showCharacterCount
                  />
                </FormControl>
                <FormDescription>Información adicional sobre el entrevistado (opcional)</FormDescription>
                <div className="hide-form-message">{formErrors.notas?.message}</div>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => forceRedirect("/entrevistados")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Entrevistado" : "Guardar Entrevistado"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
