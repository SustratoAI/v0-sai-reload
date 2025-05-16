import { Button } from "@/components/ui/button"
import { obtenerEntrevistaPorId } from "@/app/actions/entrevistas-actions"
import { obtenerTranscripcionesPorEntrevista } from "@/app/actions/transcripciones-actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EliminarEntrevistaButton } from "@/components/buttons/eliminar-entrevista-button"
import { FileText } from "lucide-react"

export default async function DetalleEntrevistaPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const [entrevistaResult, transcripcionesResult] = await Promise.all([
    obtenerEntrevistaPorId(id),
    obtenerTranscripcionesPorEntrevista(id),
  ])

  const { data: entrevista, error } = entrevistaResult
  const { data: transcripciones = [] } = transcripcionesResult

  if (error || !entrevista) {
    notFound()
  }

  const tieneTranscripciones = transcripciones.length > 0

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Detalle de Entrevista</h1>
        <div className="flex space-x-2">
          {tieneTranscripciones && (
            <Link href={`/entrevistas/${id}/transcripciones`}>
              <Button variant="outline" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Ver Transcripciones
              </Button>
            </Link>
          )}
          <EliminarEntrevistaButton id={id} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{entrevista.codigo_entrevista}</CardTitle>
          {tieneTranscripciones && (
            <CardDescription className="flex items-center text-green-600">
              <FileText className="mr-1 h-4 w-4" />
              {transcripciones.length} segmentos de transcripción
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Fundación</h3>
              <p className="mt-1 text-lg">{entrevista.fundacion?.nombre || "-"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Entrevistado</h3>
              <p className="mt-1 text-lg">
                {entrevista.entrevistado
                  ? `${entrevista.entrevistado.nombre} ${entrevista.entrevistado.apellido}`
                  : "-"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Investigador</h3>
            <p className="mt-1 text-lg">
              {entrevista.investigador
                ? `${entrevista.investigador.nombre} ${entrevista.investigador.apellido}`
                : "No asignado"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Número de Entrevista</h3>
              <p className="mt-1">{entrevista.numero_entrevista}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Fecha</h3>
              <p className="mt-1">
                {entrevista.fecha_entrevista
                  ? new Date(entrevista.fecha_entrevista).toLocaleDateString("es-ES")
                  : "Sin fecha"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Duración</h3>
              <p className="mt-1">{entrevista.duracion ? `${entrevista.duracion} minutos` : "Sin duración"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Idioma</h3>
              <p className="mt-1">{entrevista.idioma || "es-ES"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Notas</h3>
            <p className="mt-1">{entrevista.notas || "Sin notas"}</p>
          </div>

          {!tieneTranscripciones && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700 font-medium">Esta entrevista no tiene transcripciones</p>
              <p className="text-blue-600 text-sm mt-1">
                Puedes cargar una transcripción para esta entrevista desde la sección de transcripciones.
              </p>
              <div className="mt-3">
                <Link href="/transcripciones/cargar">
                  <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                    Cargar Transcripción
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6">
        <Link href="/entrevistas">
          <Button variant="outline">Volver a Entrevistas</Button>
        </Link>
      </div>
    </div>
  )
}
