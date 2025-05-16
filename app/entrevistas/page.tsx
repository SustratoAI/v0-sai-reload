import { Button } from "@/components/ui/button"
import Link from "next/link"
import { obtenerEntrevistas } from "@/app/actions/entrevistas-actions"
import { EntrevistasTable } from "@/components/tables/entrevistas-table"

export default async function EntrevistasPage() {
  const { data: entrevistas = [], error } = await obtenerEntrevistas()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Entrevistas</h1>
        <Link href="/entrevistas/nueva">
          <Button>Nueva Entrevista</Button>
        </Link>
      </div>

      {error ? (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          Error al cargar entrevistas: {error}
        </div>
      ) : entrevistas.length === 0 ? (
        <div className="p-8 text-center border rounded-md">
          <p className="text-gray-500 mb-4">No hay entrevistas registradas</p>
          <Link href="/entrevistas/nueva">
            <Button>Crear primera entrevista</Button>
          </Link>
        </div>
      ) : (
        <EntrevistasTable entrevistas={entrevistas} />
      )}
    </div>
  )
}
