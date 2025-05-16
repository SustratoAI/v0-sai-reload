import { Button } from "@/components/ui/button"
import Link from "next/link"
import { obtenerTranscripciones } from "@/app/actions/transcripciones-actions"
import { TranscripcionesTable } from "@/components/tables/transcripciones-table"

export default async function TranscripcionesPage() {
  const { data: transcripciones = [], error } = await obtenerTranscripciones()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transcripciones</h1>
        <div className="flex space-x-2">
          <Link href="/transcripciones/cargar">
            <Button>Cargar Transcripción</Button>
          </Link>
          <Link href="/transcripciones/txt-a-csv">
            <Button variant="outline">Convertir Texto a CSV</Button>
          </Link>
        </div>
      </div>

      {error ? (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          Error al cargar transcripciones: {error}
        </div>
      ) : transcripciones.length === 0 ? (
        <div className="p-8 text-center border rounded-md">
          <p className="text-gray-500 mb-4">No hay transcripciones cargadas</p>
          <Link href="/transcripciones/cargar">
            <Button>Cargar primera transcripción</Button>
          </Link>
        </div>
      ) : (
        <TranscripcionesTable transcripciones={transcripciones} />
      )}
    </div>
  )
}
