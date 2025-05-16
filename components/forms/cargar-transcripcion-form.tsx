"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Entrevistado, Investigador } from "@/types/supabase"
import {
  obtenerSiguienteNumeroEntrevista,
  crearEntrevistaParaTranscripcion,
  procesarCSVTranscripcion,
} from "@/app/actions/transcripciones-actions"
import { validateCSV } from "@/lib/utils/csv-validator"
import { CSVValidationResult } from "@/components/validation/csv-validation-result"
import { AlertCircle, FileText, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const transcripcionSchema = z.object({
  entrevistado_id: z.number({
    required_error: "Debes seleccionar un entrevistado",
    invalid_type_error: "Debes seleccionar un entrevistado",
  }),
  investigador_id: z.number({
    required_error: "Debes seleccionar un investigador",
    invalid_type_error: "Debes seleccionar un investigador",
  }),
  fecha_entrevista: z.string().optional(),
  duracion: z.number().optional(),
  notas: z.string().optional(),
  idioma: z.string().default("es-ES"),
})

type TranscripcionFormValues = z.infer<typeof transcripcionSchema>

interface CargarTranscripcionFormProps {
  entrevistados: Entrevistado[]
  investigadores: Investigador[]
}

export function CargarTranscripcionForm({ entrevistados, investigadores }: CargarTranscripcionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEntrevistado, setSelectedEntrevistado] = useState<Entrevistado | null>(null)
  const [codigoEntrevista, setCodigoEntrevista] = useState("")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvContent, setCsvContent] = useState<string | null>(null)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [showValidationResult, setShowValidationResult] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<{
    isProcessing: boolean
    success?: boolean
    message?: string
    error?: string
  }>({ isProcessing: false })
  const router = useRouter()

  const form = useForm<TranscripcionFormValues>({
    resolver: zodResolver(transcripcionSchema),
    defaultValues: {
      entrevistado_id: undefined,
      investigador_id: undefined,
      fecha_entrevista: "",
      duracion: undefined,
      notas: "",
      idioma: "es-ES",
    },
  })

  // Cuando cambia el entrevistado seleccionado, actualizar el código de entrevista
  useEffect(() => {
    const entrevistadoId = form.watch("entrevistado_id")
    if (entrevistadoId) {
      const entrevistado = entrevistados.find((e) => e.id === entrevistadoId)
      if (entrevistado && entrevistado.fundacion) {
        setSelectedEntrevistado(entrevistado)

        // Generar código base (fundación + entrevistado)
        const codigoBase = `${entrevistado.fundacion.codigo}${entrevistado.codigo}`

        // Obtener el siguiente número de entrevista
        obtenerSiguienteNumeroEntrevista(codigoBase).then((result) => {
          if (result.success) {
            setCodigoEntrevista(`${codigoBase}${result.numero}`)
          } else if (result.error) {
            toast.error(result.error)
          }
        })
      }
    } else {
      setSelectedEntrevistado(null)
      setCodigoEntrevista("")
    }
  }, [form.watch("entrevistado_id"), entrevistados])

  async function onSubmit(data: TranscripcionFormValues) {
    if (!codigoEntrevista) {
      toast.error("No se pudo generar el código de entrevista")
      return
    }

    if (!selectedEntrevistado || !selectedEntrevistado.fundacion) {
      toast.error("Información de entrevistado o institución incompleta")
      return
    }

    if (!csvFile || !csvContent) {
      toast.error("Debes seleccionar un archivo CSV")
      return
    }

    if (!validationResult || !validationResult.isValid) {
      toast.error("El archivo CSV no ha sido validado o contiene errores")
      return
    }

    setIsSubmitting(true)
    setProcessingStatus({ isProcessing: true })

    try {
      // Crear la entrevista primero
      const entrevistaData = {
        codigo_entrevista: codigoEntrevista,
        fundacion_id: selectedEntrevistado.fundacion.id,
        entrevistado_id: data.entrevistado_id,
        investigador_id: data.investigador_id,
        numero_entrevista: Number.parseInt(codigoEntrevista.substring(4), 10),
        fecha_entrevista: data.fecha_entrevista,
        duracion: data.duracion,
        notas: data.notas,
        idioma: data.idioma,
      }

      const entrevistaResult = await crearEntrevistaParaTranscripcion(entrevistaData)

      if (entrevistaResult.error) {
        setProcessingStatus({
          isProcessing: false,
          success: false,
          error: entrevistaResult.error,
        })
        toast.error(entrevistaResult.error)
        return
      }

      // Procesar el archivo CSV
      const csvResult = await procesarCSVTranscripcion(entrevistaResult.data.id, csvContent)

      if (csvResult.error) {
        setProcessingStatus({
          isProcessing: false,
          success: false,
          error: csvResult.error,
        })
        toast.error(csvResult.error)
        return
      }

      // Todo salió bien
      setProcessingStatus({
        isProcessing: false,
        success: true,
        message: csvResult.message,
      })
      toast.success(csvResult.message)

      // Redirigir después de 2 segundos usando window.location para forzar recarga completa
      setTimeout(() => {
        window.location.href = "/transcripciones"
      }, 2000)
    } catch (error) {
      console.error("Error en el proceso de carga:", error)
      setProcessingStatus({
        isProcessing: false,
        success: false,
        error: "Error inesperado durante el proceso de carga",
      })
      toast.error("Error inesperado durante el proceso de carga")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setCsvFile(file)

      // Leer el contenido del archivo
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setCsvContent(event.target.result as string)
        }
      }
      reader.readAsText(file)

      // Resetear validación
      setValidationResult(null)
      setShowValidationResult(false)
    }
  }

  const handleValidateCSV = async () => {
    if (!csvContent) {
      toast.error("No hay archivo CSV para validar")
      return
    }

    setIsValidating(true)
    try {
      const entrevistado = selectedEntrevistado
      const investigador = investigadores.find((i) => i.id === form.getValues("investigador_id"))
      const idioma = form.getValues("idioma")

      const result = await validateCSV(csvContent, entrevistado || undefined, investigador || undefined, idioma)
      setValidationResult(result)
      setShowValidationResult(true)

      if (!result.isValid) {
        toast.error("Se encontraron errores en el archivo CSV")
      } else if (result.warnings.length > 0 || result.segmentsWithIssues.length > 0) {
        toast.warning("Se encontraron advertencias en el archivo CSV")
      } else {
        toast.success("El archivo CSV es válido")
      }
    } catch (error) {
      console.error("Error al validar CSV:", error)
      toast.error("Error al validar el archivo CSV")
    } finally {
      setIsValidating(false)
    }
  }

  // Si estamos procesando o ya terminamos con éxito, mostrar un estado especial
  if (processingStatus.isProcessing || processingStatus.success) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Procesando Transcripción</CardTitle>
          <CardDescription>
            {processingStatus.isProcessing
              ? "Estamos procesando tu archivo de transcripción..."
              : "¡Transcripción cargada con éxito!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          {processingStatus.isProcessing ? (
            <>
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
              <p className="text-lg font-medium">Cargando transcripción...</p>
              <p className="text-sm text-gray-500 mt-2">
                Esto puede tomar unos momentos dependiendo del tamaño del archivo.
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-lg font-medium">¡Transcripción cargada correctamente!</p>
              <p className="text-sm text-gray-500 mt-2">{processingStatus.message}</p>
              <p className="text-sm text-gray-500 mt-1">Serás redirigido en unos momentos...</p>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  // Si hay un error en el procesamiento, mostrar el error
  if (processingStatus.error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Error al Procesar Transcripción</CardTitle>
          <CardDescription>Ocurrió un error durante el procesamiento de la transcripción.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{processingStatus.error}</AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button onClick={() => setProcessingStatus({ isProcessing: false })} variant="outline">
              Volver al formulario
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {showValidationResult && validationResult ? (
        <CSVValidationResult
          validationResult={validationResult}
          onContinue={() => setShowValidationResult(false)}
          onCancel={() => {
            setShowValidationResult(false)
            setCsvFile(null)
            setCsvContent(null)
            setValidationResult(null)
          }}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Información de la Entrevista</CardTitle>
            <CardDescription>
              Selecciona el entrevistado y el investigador para generar el código de entrevista
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un entrevistado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {entrevistados.map((entrevistado) => (
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
                      <FormDescription>Idioma de la transcripción</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedEntrevistado && selectedEntrevistado.fundacion && (
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Institución</h3>
                        <p className="mt-1">
                          {selectedEntrevistado.fundacion.codigo} - {selectedEntrevistado.fundacion.nombre}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Código de Entrevista</h3>
                        <p className="mt-1 font-medium">{codigoEntrevista}</p>
                      </div>
                    </div>
                  </div>
                )}

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
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value === "" ? undefined : Number.parseInt(value))
                          }}
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
                        <Textarea
                          placeholder="Notas adicionales sobre la entrevista..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Información adicional sobre la entrevista (opcional)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Archivo CSV de Transcripción</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      disabled={isSubmitting || isValidating}
                    />
                    <Button
                      type="button"
                      onClick={handleValidateCSV}
                      disabled={!csvFile || isValidating || isSubmitting}
                      className="whitespace-nowrap"
                    >
                      {isValidating ? "Validando..." : "Validar CSV"}
                    </Button>
                  </div>
                  <FormDescription>Selecciona el archivo CSV con la transcripción de la entrevista</FormDescription>

                  {csvFile && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start">
                      <FileText className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-700">{csvFile.name}</p>
                        <p className="text-sm text-blue-600">
                          {(csvFile.size / 1024).toFixed(2)} KB • {new Date().toLocaleDateString()}
                        </p>
                        {validationResult && (
                          <div className="mt-1 flex items-center">
                            {validationResult.isValid ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">Archivo validado correctamente</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-sm text-red-600">El archivo contiene errores</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/transcripciones")}
                    disabled={isSubmitting || isValidating}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      isValidating ||
                      !csvFile ||
                      !validationResult ||
                      !validationResult.isValid ||
                      !codigoEntrevista
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Transcripción"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
