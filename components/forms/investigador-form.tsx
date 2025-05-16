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
import { crearInvestigador, actualizarInvestigador } from "@/app/actions/investigadores-actions"
import { toast } from "sonner"
import type { Investigador } from "@/types/supabase"

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

const investigadorSchema = z.object({
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
  email: z.string().email({ message: "Debe ser un email válido" }).optional().or(z.literal("")),
  telefono: z.string().optional(),
  institucion: z.string().optional(),
  cargo: z.string().optional(),
  notas: z.string().optional(),
})

type InvestigadorFormValues = z.infer<typeof investigadorSchema>

interface InvestigadorFormProps {
  investigador?: Investigador
}

export function InvestigadorForm({ investigador }: InvestigadorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const router = useRouter()
  const isEditing = !!investigador

  const form = useForm<InvestigadorFormValues>({
    resolver: zodResolver(investigadorSchema),
    defaultValues: {
      codigo: investigador?.codigo || "",
      nombre: investigador?.nombre || "",
      apellido: investigador?.apellido || "",
      email: investigador?.email || "",
      telefono: investigador?.telefono || "",
      institucion: investigador?.institucion || "",
      cargo: investigador?.cargo || "",
      notas: investigador?.notas || "",
    },
    mode: "onChange", // Validar al cambiar para mejor UX
  })

  // Obtener los errores del formulario
  const formErrors = form.formState.errors

  async function onSubmit(data: InvestigadorFormValues) {
    setFormSubmitted(true)
    setIsSubmitting(true)
    try {
      let result

      if (isEditing && investigador) {
        result = await actualizarInvestigador(investigador.id, data)
      } else {
        result = await crearInvestigador(data)
      }

      if (result.error) {
        toast.error(result.error)
        setIsSubmitting(false)
      } else {
        toast.success(isEditing ? "Investigador actualizado correctamente" : "Investigador creado correctamente")

        // Intentamos la redirección con el router de Next.js
        try {
          // Usamos setTimeout para dar tiempo al toast para mostrarse
          setTimeout(() => {
            router.push("/configuracion/investigadores")
            router.refresh()
          }, 800)
        } catch (e) {
          console.error("Error en router.push:", e)
          // Como fallback, usamos window.location
          setTimeout(() => {
            window.location.href = "/configuracion/investigadores"
          }, 1000)
        }
      }
    } catch (error) {
      toast.error(isEditing ? "Error al actualizar el investigador" : "Error al crear el investigador")
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
                      placeholder="IN"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      maxLength={2}
                      showCharacterCount
                      error={formErrors.codigo?.message}
                      isEditing={isEditing}
                    />
                  </FormControl>
                  <FormDescription>Código de 2 caracteres para identificar al investigador</FormDescription>
                  <div className="hide-form-message">{formErrors.codigo?.message}</div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="institucion"
              render={({ field }) => (
                <FormItem className="custom-form-item">
                  <FormLabel className="custom-form-label">Institución</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Universidad de Chile"
                      {...field}
                      error={formErrors.institucion?.message}
                      isEditing={isEditing}
                    />
                  </FormControl>
                  <FormDescription>Institución a la que pertenece el investigador (opcional)</FormDescription>
                  <div className="hide-form-message">{formErrors.institucion?.message}</div>
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
                    <Input placeholder="María" {...field} error={formErrors.nombre?.message} isEditing={isEditing} />
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
                      placeholder="González"
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
                    placeholder="Investigador Principal"
                    {...field}
                    error={formErrors.cargo?.message}
                    isEditing={isEditing}
                  />
                </FormControl>
                <FormDescription>Cargo o posición del investigador (opcional)</FormDescription>
                <div className="hide-form-message">{formErrors.cargo?.message}</div>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="custom-form-item">
                  <FormLabel className="custom-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@ejemplo.com"
                      type="email"
                      {...field}
                      error={formErrors.email?.message}
                      isEditing={isEditing}
                    />
                  </FormControl>
                  <FormDescription>Email de contacto (opcional)</FormDescription>
                  <div className="hide-form-message">{formErrors.email?.message}</div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem className="custom-form-item">
                  <FormLabel className="custom-form-label">Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+56 9 1234 5678"
                      {...field}
                      error={formErrors.telefono?.message}
                      isEditing={isEditing}
                    />
                  </FormControl>
                  <FormDescription>Teléfono de contacto (opcional)</FormDescription>
                  <div className="hide-form-message">{formErrors.telefono?.message}</div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notas"
            render={({ field }) => (
              <FormItem className="custom-form-item">
                <FormLabel className="custom-form-label">Notas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Notas adicionales sobre el investigador..."
                    className="min-h-[120px]"
                    {...field}
                    error={formErrors.notas?.message}
                    isEditing={isEditing}
                    showCharacterCount
                  />
                </FormControl>
                <FormDescription>Información adicional sobre el investigador (opcional)</FormDescription>
                <div className="hide-form-message">{formErrors.notas?.message}</div>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/configuracion/investigadores")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Investigador" : "Guardar Investigador"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
