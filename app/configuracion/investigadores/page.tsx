import { Button } from "@/components/ui/button"
import Link from "next/link"
import { InvestigadoresTable } from "@/components/tables/investigadores-table"
import { obtenerInvestigadores } from "@/app/actions/investigadores-actions"

export default async function InvestigadoresPage() {
  const { data: investigadores = [], error } = await obtenerInvestigadores()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Investigadores</h1>
        <Link href="/configuracion/investigadores/nuevo">
          <Button>Nuevo Investigador</Button>
        </Link>
      </div>

      {error ? (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          Error al cargar investigadores: {error}
        </div>
      ) : investigadores.length === 0 ? (
        <div className="p-8 text-center border rounded-md">
          <p className="text-gray-500 mb-4">No hay investigadores registrados</p>
          <Link href="/configuracion/investigadores/nuevo">
            <Button>Crear primer investigador</Button>
          </Link>
        </div>
      ) : (
        <InvestigadoresTable investigadores={investigadores} />
      )}
    </div>
  )
}
