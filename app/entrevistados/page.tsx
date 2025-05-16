import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EntrevistadosTable } from "@/components/tables/entrevistados-table"
import { obtenerEntrevistados } from "@/app/actions/entrevistados-actions"

export default async function EntrevistadosPage() {
  const { data: entrevistados = [], error } = await obtenerEntrevistados()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Entrevistados</h1>
        <Link href="/entrevistados/nuevo">
          <Button>Nuevo Entrevistado</Button>
        </Link>
      </div>

      {error ? (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          Error al cargar entrevistados: {error}
        </div>
      ) : entrevistados.length === 0 ? (
        <div className="p-8 text-center border rounded-md">
          <p className="text-gray-500 mb-4">No hay entrevistados registrados</p>
          <Link href="/entrevistados/nuevo">
            <Button>Crear primer entrevistado</Button>
          </Link>
        </div>
      ) : (
        <EntrevistadosTable entrevistados={entrevistados} />
      )}
    </div>
  )
}
