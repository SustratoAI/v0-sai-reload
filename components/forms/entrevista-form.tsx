"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { crearEntrevista } from "@/app/actions/entrevistas-actions"
import { toast } from "sonner"
import type { Entrevista, Fundacion, Entrevistado, Investigador } from "@/types/supabase"

const entrevistaSchema = z.object({
  codigo_entrevista: z.string().min(2, {
    message: "El código debe tener al menos 2 caracteres",
  }),
  fundacion_id: z.number({
    required_error: "Debes seleccionar una fundación",
    invalid_type_error: "Debes seleccionar una fundación",
  }),
  entrevistado_id: z.number({
    required_error: "Debes seleccionar un entrevistado",
    invalid_type_error: "Debes seleccionar un entrevistado",
  }),
  investigador_id: z
    .number({
      required_error: "Debes seleccionar un investigador",
      invalid_type_error: "Debes seleccionar un investigador",
    })
    .optional(),
  numero_entrevista: z
    .number({
      required_error: "Debes ingresar el número de entrevista",
      invalid_type_error: "Debes ingresar un número válido",
    })
    .int()
    .positive(),
  fecha_entrevista: z.string().optional(),
  duracion: z.number().optional(),
  notas: z.string().optional(),
})

type EntrevistaFormValues = z.infer<typeof entrevistaSchema>

interface EntrevistaFormProps {
  entrevista?: Entrevista
  fundaciones: Fundacion[]
  entrevistados: Entrevistado[]
  investigadores: Investigador[]
}

export function EntrevistaForm({ entrevista, fundaciones, entrevistados, investigadores }: EntrevistaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const isEditing = !!entrevista

  // Filtrar entrevistados por fundación seleccionada
  const [selectedFundacionId, setSelectedFundacionId] = useState<number | undefined>(
    entrevista?.fundacion_id || undefined,
  )

  const filteredEntrevistados = selectedFundacionId
    ? entrevistados.filter((e) => e.fundacion_id === selectedFundacionId)
    : entrevistados

  const form = useForm<EntrevistaFormValues>({
    resolver: zodResolver(entrevistaSchema),
    defaultValues: {
      codigo_entrevista: entrevista?.codigo_entrevista || "",
      fundacion_id: entrevista?.fundacion_id || undefined,
      entrevistado_id: entrevista?.entrevistado_id || undefined,
      investigador_id: entrevista?.investigador_id || undefined,
      numero_entrevista: entrevista?.numero_entrevista || undefined,
      fecha_entrevista: entrevista?.fecha_entrevista || "",
      duracion: entrevista?.duracion || undefined,
      notas: entrevista?.notas || "",
    },
  })

  async function onSubmit(data: EntrevistaFormValues) {
    setIsSubmitting(true)
    try {
      const result = await crearEntrevista(data)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Entrevista creada correctamente")
        router.push("/entrevistas")
        router.refresh()
      }
    } catch (error) {
      toast.error("Error al crear la entrevista")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="codigo_entrevista"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Entrevista</FormLabel>
                <FormControl>
                  <Input placeholder="ENT001" {...field} />
                </FormControl>
                <FormDescription>Código único para identificar la entrevista</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numero_entrevista"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Entrevista</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number.parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormDescription>Número secuencial de la entrevista</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="fundacion_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fundación</FormLabel>
              <Select
                onValueChange={(value) => {
                  const numValue = Number.parseInt(value)
                  field.onChange(numValue)
                  setSelectedFundacionId(numValue)
                  // Reset entrevistado selection when fundacion changes
                  form.setValue("entrevistado_id", undefined as any)
                }}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una fundación" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fundaciones.map((fundacion) => (
                    <SelectItem key={fundacion.id} value={fundacion.id.toString()}>
                      {fundacion.codigo} - {fundacion.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Fundación relacionada con la entrevista</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="entrevistado_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entrevistado</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number.parseInt(value))}
                  defaultValue={field.value?.toString()}
                  disabled={!selectedFundacionId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedFundacionId ? "Selecciona un entrevistado" : "Primero selecciona una fundación"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredEntrevistados.map((entrevistado) => (
                      <SelectItem key={entrevistado.id} value={entrevistado.id.toString()}>
                        {entrevistado.codigo} - {entrevistado.nombre} {entrevistado.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Persona entrevistada</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investigador_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Investigador</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number.parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un investigador" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {investigadores.map((investigador) => (
                      <SelectItem key={investigador.id} value={investigador.id.toString()}>
                        {investigador.codigo} - {investigador.nombre} {investigador.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Investigador que realizó la entrevista</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="fecha_entrevista"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Entrevista</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>Fecha en que se realizó la entrevista (opcional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duracion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración (minutos)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="60"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number.parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <FormDescription>Duración de la entrevista en minutos (opcional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea placeholder="Notas adicionales sobre la entrevista..." className="min-h-[120px]" {...field} />
              </FormControl>
              <FormDescription>Información adicional sobre la entrevista (opcional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/entrevistas")} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Entrevista"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
